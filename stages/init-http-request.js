const request = require('../utils/request');
const methods = require('../utils/parse-url-method').methods;

const cacheHeader = 'Cache-Control';

function disableCache(disabled) {
  if (!disabled) {
    this.remove(cacheHeader);
    return;
  }

  this.set(cacheHeader, 'no-cache, no-store, must-revalidate');
}


function getRequest() {
  const req = this;
  const config = req.httpRequestConfig || {};

  if (req.router && req.router.timeout) {
    config.timeout = req.router.timeout;
  }

  const httpRequest = request(config);

  request.methods = methods.map(method => {
    request[method] = (options, complete) => httpRequest[method](options, complete);
    return method;
  });

  return request;
}

module.exports = async function initHttpRequest(ctx, next) {
  const { request, response } = ctx;

  request.httpRequest = getRequest;
  request.apisTask = {};
  response.disableCache = disableCache.bind(response);

  // 保证在router.handle等处自处理响应时有效
  const disablePageCache = request.router && request.router.pageCache === false;
  const disableAjaxCache = request.xhr && this.get('ajaxCache') === false;

  response.disableCache(disablePageCache || disableAjaxCache);

  return next();
};
