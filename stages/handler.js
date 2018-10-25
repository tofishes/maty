const valueChain = require('value-chain');

const typeOf = require('../utils/typeof');
const Task = require('../libs/task');

async function handleConfig(originConfig, ctx) {
  let config = originConfig;

  if (typeOf(config).isFunc) {
    config = await config(ctx);
  }

  if (!config) {
    return config;
  }

  let api = config.api;
  const isInterceptor = config.type === 'interceptor';

  // api可以是字符串，字符串数组，对象混合字符串数组，函数(返回前面3中类型数据)
  if (typeOf(api).isFunc) {
    api = await api.call(config, ctx);
  }

  // 无api配置，直接返回
  if (!api) {
    if (isInterceptor && config.handle) {
      const data = await config.handle(ctx.apiData, ctx);

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
  if (typeOf(api).isString) {
    const handle = isInterceptor ? config.handle : null;
    api = [{ api, handle }];
  }

  if (!Array.isArray(api)) {
    throw new TypeError('The type of api must be String or Array or Function');
  }

  /*
   * 统一格式为： [{api, query, body}...]，转为apiTask， 过滤掉item为函数情况下返回false
   */
  api.map(item => {
    const isSeries = item.series || config.series;
    const taskName = isSeries ? 'series' : 'parallel';
    let task = ctx.apisTask[taskName];

    if (!task) {
      task = new Task(isSeries).context(ctx);
      ctx.apisTask[taskName] = task;
    }

    task.addApiTask(item, config);
  });

  return config;
}

async function handleInterceptor(ctx) {
  if (!ctx.interceptors.length) {
    return;
  }

  ctx.interceptors = await Promise.all(
    ctx.interceptors.map(async interceptor =>
      await handleConfig(interceptor, ctx)
    )
  );

  const seriesTask = ctx.apisTask.series;

  if (seriesTask) {
    await seriesTask.run();
    ctx.apisTask.series = null;
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
  await handleInterceptor(ctx);

  if (ctx.isEnd) {
    return next();
  }

  ctx.router = await handleConfig(ctx.router, ctx);

  const seriesTask = ctx.apisTask.series;
  const parallelTask = ctx.apisTask.parallel;

  if (seriesTask) {
    await seriesTask.run();
  }

  if (parallelTask) {
    await parallelTask.run();
  }

  await handleData(ctx.router, ctx);

  return next();
}

module.exports = handler;
