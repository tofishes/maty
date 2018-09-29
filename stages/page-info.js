const parser = require('ua-parser-js');
const valueChain = require('value-chain');
const urlInfo = require('../utils/url-info');

/**
 * 页面变量初始化等
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = function pageInfo(ctx, next) {
  const req = ctx.request;
  const { moduleName, pathes, pathname } = urlInfo(req.path);
  const ua = parser(req.get('User-Agent'));

  const type = req.get('X-Requested-With') || '';
  const xhr = type.toLowerCase() === 'xmlhttprequest';

  Object.assign(req, {
    ua,
    moduleName,
    pathes,
    pathname,
    xhr
  });

  ctx.state.request = req;
  ctx.state.response = ctx.response;
  ctx.apiData = valueChain.set({});

  next();
}
