/**
 * 转发请求：
 * 1、使用req.forward(url)
 * 2、router且router.forward = true
 * 3、通过外部设置，req.forwardUrl = path
 *
 * 实践：
 * 1、ajax请求未配置router，可以req.forwardUrl = ajax请求地址来转发
 * 2、router设置了proxy属性为true，例如 验证码接口，需转发后端生成的captcha图片
 * 3、业务中主动req.forward转发
 *
 * @param  {[type]} req    [description]
 * @param  {[type]} res    [description]
 * @return {[type]}        [description]
 */
const log = require('t-log');
const parseURLMethod = require('../utils/parse-url-method');

function getForwardUrl(req) {
  if (req.forwardUrl) {
    return {
      url: req.forwardUrl
    };
  }

  const router = req.router;

  if (!router || !router.forward) {
    return {};
  }

  let method = req.method.toLowerCase();
  let url = req.path;

  if (router.api) {
    const urlMethod = parseURLMethod(router.api, method);

    method = urlMethod.method;
    url = req.ctx.stage.get('handleAPI')(urlMethod.url, req);
  }

  return { method, url };
}

// 如果是get请求，为什么不用redirect跳转:
// 避免redirect url不支持对外访问
module.exports = async function forward(ctx, next) {
  const req = ctx.request;
  const res = ctx.response;

  const { method, url } = getForwardUrl(req);

  // 无跳转url
  if (!url) {
    return await next();
  }

  const request = req.httpRequest();
  const options = {
    url,
    qs: req.query,
    body: req.body
  };

  // 记录apiInfo数据
  res.apiInfo.proxy = {
    api: req.path,
    query: req.query,
    body: req.body
  };

  return new Promise((resolve, reject) => {
    const timer = log.time();

    ctx.body = request[method](options).on('response', response => {
      res.set(response.headers);

      res.apiInfo.proxy.headers = response.headers;
      res.apiInfo.proxy.consumeTime = timer.end();

      resolve(response);
    }).on('error', function(err) {
      reject(err);
    });
  });
}
