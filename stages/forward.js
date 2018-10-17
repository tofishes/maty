/**
 * 转发请求：
 * 1、使用ctx.forward(url)
 * 2、router且router.forward = true
 * 3、通过外部设置，ctx.forwardUrl = path
 *
 * 实践：
 * 1、ajax请求未配置router，可以ctx.forwardUrl = ajax请求地址来转发
 * 2、router设置了proxy属性为true，例如 验证码接口，需转发后端生成的captcha图片
 * 3、业务中主动ctx.forward转发
 *
 * @param  {[type]} req    [description]
 * @param  {[type]} res    [description]
 * @return {[type]}        [description]
 */
const typeOf = require('../utils/typeof');
const parseURLMethod = require('../utils/parse-url-method');

function getForwardInfo(ctx) {
  let method = ctx.method.toLowerCase();
  let url = ctx.forwardUrl;

  let { proxy } = ctx.router || {};

  if (proxy) {
    if (typeOf(proxy).isFunc) {
      proxy = proxy(ctx);
    }

    const urlMethod = parseURLMethod(proxy, method);

    method = urlMethod.method;
    url = ctx.stage.get('handleAPI')(urlMethod.url, ctx);
  }

  return { method, url };
}

// 如果是get请求，为什么不用redirect跳转:
// 避免redirect url不支持对外访问
module.exports = async function forward(ctx, next) {
  const { method, url } = getForwardInfo(ctx);

  // 无跳转url
  if (!url) {
    return next();
  }

  const request = ctx.httpRequest();
  const options = {
    url,
    qs: ctx.query,
    body: ctx.reqBody
  };

  // 记录apiInfo数据
  ctx.apiInfo.proxy = {
    api: url,
    query: ctx.query,
    body: ctx.reqBody
  };

  ctx.body = request[method](options);
}
