const typeOf = require('../utils/typeof');
const Task = require('../libs/task');
const valueChain = require('value-chain');

function isFunc(obj) {
  return typeOf(obj).is('function');
}
function isString(obj) {
  return typeOf(obj).is('string');
}
function handleConfig(originConfig, ctx) {
  const req = ctx.request;
  let config = originConfig;

  if (isFunc(config)) {
    config = config(ctx);
  }

  if (!config) {
    return config;
  }

  let api = config.api;
  const isInterceptor = config.type === 'interceptor';

  // api可以是字符串，字符串数组，对象混合字符串数组，函数(返回前面3中类型数据)
  if (isFunc(api)) {
    api = api.call(config, ctx);
  }

  // 无api配置，直接执行下一个stage
  if (!api) {
    if (isInterceptor && config.handle) {
      const data = config.handle(ctx.apiData, ctx);

      if (data) {
        valueChain.set(data);
      }

      if (config.name) {
        ctx.apiData[config.name] = data;
      } else {
        ctx.apiData = data || ctx.apiData;
      }
    }
    return config;
  }

  // 如果是拦截器，需要把handle合并进来
  // 拦截器api为非字符串型时，仅支持数组项内的handle，不支持全局handle
  if (isString(api)) {
    const handle = isInterceptor ? config.handle : null;
    api = [{ api, handle }];
  }

  if (!Array.isArray(api)) {
    throw new TypeError('The type of api must be String or Array or Function');
  }

  /*
   * 统一格式为： [{api, query, body}...]，转为apiTask， 过滤掉item为函数情况下返回false
   */
  req.apis = api.map(item => {
    const isSeries = item.series || config.series;
    const taskName = isSeries ? 'series' : 'parallel';
    let task = req.apisTask[taskName];

    if (!task) {
      task = new Task(isSeries).context(ctx);
      req.apisTask[taskName] = task;
    }

    task.addApiTask(item, config);

    return item;
  });

  console.log(__filename, ': ', config)

  return config;
}

async function handleInterceptor(ctx) {
  const req = ctx.request;
  if (!req.interceptors.length) {
    return;
  }

  req.interceptors = req.interceptors.map(interceptor => handleConfig(interceptor, ctx));

  const seriesTask = req.apisTask.series;

  if (seriesTask) {
    await seriesTask.run();
    req.apisTask.series = null;
  }
}

async function handleData(router, ctx) {
  if (!router || !router.handle) {
    return;
  }

  const data = await router.handle(ctx.apiData, ctx);

  valueChain.set(data);

  if (router.name) {
    ctx.apiData[router.name] = data;
  } else {
    ctx.apiData = data;
  }
}

/**
 * 处理路由
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function handler(ctx, next) {
  const req = ctx.request;
  await handleInterceptor(ctx);

  if (ctx.isEnd) {
    return;
  }

  req.router = handleConfig(req.router, ctx);

  const seriesTask = req.apisTask.series;
  const parallelTask = req.apisTask.parallel;

  if (seriesTask) {
    await seriesTask.run();
  }

  if (parallelTask) {
    await parallelTask.run();
  }

  await handleData(req.router, ctx);

  return next();
}

module.exports = handler;
