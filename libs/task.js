const querystring = require('querystring');
const async = require('async');
const log = require('t-log');
const valueChain = require('value-chain');
const parseURLMethod = require('../utils/parse-url-method');
const typeOf = require('../utils/typeof');

function isFunc(obj) {
  return typeOf(obj).is('function');
}
function isString(obj) {
  return typeOf(obj).is('string');
}

class Task {
  constructor(isSeries) {
    this.tasks = [];
    this.props = {};
    this.mode(isSeries);
  }

  context(context) {
    this.props.context = context;
    return this;
  }

  mode(isSeries) {
    this.props.mode = isSeries ? 'series' : 'parallel';
    return this;
  }

  add(task) {
    this.tasks.push(task);
    return this;
  }

  run() {
    if (!this.tasks.length) {
      return null;
    }

    return new Promise((resolve, reject) => {
      async[this.props.mode](this.tasks, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    })
  }

  // api类型任务
  addApiTask(apiItem, config) {
    const ctx = this.props.context;
    const { request, stage } = ctx;
    const httpRequest = request.httpRequest();

    const excute = func => {
      if (isFunc(func)) {
        return func.call(config, ctx);
      }

      return func;
    };

    const query = config.query || request.query;
    const body = config.body || request.body;
    const name = config.name;
    let cache = config.cache;

    async function action(callback) {
      const timer = log.time();

      let apiConfig = apiItem;

      if (isString(apiItem)) {
        apiConfig = { 'api': apiItem };
      } else if (isFunc(apiItem)) {
        apiConfig = excute(apiItem);

        if (!apiConfig) {
          return callback();
        }

        if (isString(apiConfig)) {
          apiConfig = { 'api': apiConfig };
        }
      }

      // 默认为对象类型，合并第一级配置的参数处理器
      apiConfig = Object.assign({ query, body, name, cache }, apiConfig);

      // 参数处理
      apiConfig.query = excute(apiConfig.query);
      apiConfig.body = excute(apiConfig.body);
      // 缓存
      apiConfig.cache = cache = excute(apiConfig.cache);
      // 数据名
      if (!apiConfig.name) {
        apiConfig.name = stage.get('apiDataName').call(config, apiConfig.api);
      }

      const dataName = apiConfig.name;

      const urlMethod = parseURLMethod(apiConfig.api, request.method);
      let url = urlMethod.url;
      const cacheKey = url + querystring.stringify(apiConfig.query);

      const handleAPI = stage.get('handleAPI');
      url = handleAPI(url, request);

      apiConfig.method = urlMethod.method;

      ctx.apiInfo[dataName] = apiConfig;

      let expires = cache;
      if (cache === true) {
        expires = Number.MAX_VALUE;
      }

      if (cache) {
        const apiDataCache = stage.get('apiDataCache');
        let result = apiDataCache.get(cacheKey);

        if (result) {
          const consumeTime = timer.end();
          const resBody = result;
          const headers = { 'x-data-from': 'cache' };
          Object.assign(ctx.apiInfo[dataName], { consumeTime, headers, resBody });

          if (apiConfig.handle) {
            result = await apiConfig.handle.call(config, result, req, res);
          }

          ctx.apiData[dataName] = valueChain.set(result);

          return callback(null, result);
        }
      }

      const complete = (error, response, resBody) => {
        const consumeTime = timer.end();
        const headers = response && response.headers;
        Object.assign(ctx.apiInfo[dataName], { consumeTime, headers, resBody });

        let result = resBody;
        let willCache = !!cache;

        if (error) {
          willCache = false;
          let code = 503;
          let message = `API ${url} Service Unavailable. ${error.message}`;

          if (error.code === 'ETIMEDOUT') {
            code = 504;
            message = `API ${url} Request Timeout.`;
          }

          result = { code, message, resBody, error };
        } else if (response.statusCode !== 200) {
          willCache = false;
          result = {
            code: response.statusCode,
            message: 'response exception, not 200 ok.',
            resBody
          };
        }
        // 必须缓存原始数据，否则不同路由的数据共享在handle时会出问题
        if (willCache) {
          const apiDataCache = stage.get('apiDataCache');
          apiDataCache.set(cacheKey, result, expires);
        }

        if (apiConfig.handle) {
          result = apiConfig.handle.call(config, valueChain.set(result), req, res);
        }

        ctx.apiData[dataName] = valueChain.set(result);

        return callback(null, result);
      };

      return httpRequest[apiConfig.method]({
        body: apiConfig.body,
        qs: apiConfig.query,
        url
      }, complete);
    }

    this.add(action);

    return this;
  }
}

module.exports = Task;
