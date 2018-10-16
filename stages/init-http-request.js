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
  const config = this.httpRequestConfig || {};

  if (this.router && this.router.timeout) {
    config.timeout = this.router.timeout;
  }

  const httpRequest = request(config);

  request.methods = methods.map(method => {
    request[method] = (options, complete) => httpRequest[method](options, complete);
    return method;
  });

  return request;
}

module.exports = async function initHttpRequest(ctx, next) {
  ctx.httpRequest = getRequest;
  ctx.disableCache = disableCache;

  // 保证在router.handle等处自处理响应时有效
  const disablePageCache = ctx.router && ctx.router.pageCache === false;
  const disableAjaxCache = ctx.xhr && ctx.stage.get('ajaxCache') === false;

  ctx.disableCache(disablePageCache || disableAjaxCache);

  return next();
};
