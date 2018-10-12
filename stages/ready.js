const parser = require('ua-parser-js');
const valueChain = require('value-chain');
const urlInfo = require('../utils/url-info');

/**
 * 页面变量初始化等
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = async function ready(ctx, next) {
  const { moduleName, pathes, pathname } = urlInfo(ctx.path);
  const ua = parser(ctx.get('User-Agent'));

  const type = ctx.get('X-Requested-With') || '';
  const xhr = type.toLowerCase() === 'xmlhttprequest';
  const reqBody = ctx.request.body;

  Object.assign(ctx, {
    ua,
    moduleName,
    pathes,
    pathname,
    xhr,
    reqBody
  });

  ctx.state.request = ctx.request;
  ctx.state.response = ctx.response;
  ctx.apiData = valueChain.set({});
  ctx.apiInfo = {};
  ctx.apisTask = {};

  return next();
}
