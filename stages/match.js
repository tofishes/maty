// 得到参数
// https://github.com/expressjs/express/blob/master/lib/router/layer.js
function getParam(pathInfo, paramKeys) {
  const param = {};

  for (let j = 1; j < pathInfo.length; j++) {
    const key = paramKeys[j - 1];
    const prop = key.name;
    const val = decodeURIComponent(pathInfo[j]);

    if (val !== 'undefined') {
      param[prop] = val;
    }
  }

  return param;
}

/**
 * 匹配route
 * 两种匹配方法： 1、用filter得到全部匹配； 2、for循环得到一个匹配就终止；
 * 目前按第二种方式
 */
function matchRouter(pathname, routers) {
  for (let i = 0, l = routers.length, router, pathInfo; i < l; i++) {
    router = routers[i];
    pathInfo = router.pathRegx.exec(pathname);

    if (pathInfo) {
      const param = getParam(pathInfo, router.paramKeys);
      return { router, param };
    }
  }

  return {};
}

function matchInterceptor(req, interceptors) {
  const pathname = req.path;

  return interceptors.filter(interceptor => {
    if (req.xhr && interceptor.ajax !== true) {
      return false;
    }

    const matchPath = interceptor.pathRegx.test(pathname);
    const route = interceptor.route;

    // 排除静态文件，除非主动匹配
    const routeExt = ~route.indexOf('.');
    const ignoreExt = routeExt || !~pathname.indexOf('.');

    return matchPath && ignoreExt;
  });
}

const defaultMethods = ['get'];

async function match(ctx, next) {
  const { request, stage } = ctx;

  const { router, param = {} } = matchRouter(request.path, stage.get('routers'));
  request.interceptors = matchInterceptor(request, stage.get('interceptors'));

  request.param = param;

  // 未匹配到路由
  if (!router) {
    await next();
    return;
  }

  const method = request.method.toLowerCase();
  const supportRouter = (router.methods || defaultMethods).includes(method);

  if (!supportRouter) {
    ctx.status = 405;
    ctx.body = `${method.toUpperCase()} Method Not Allowed`;
    return;
  }

  request.router = router;
  // 合并参数
  Object.assign(request.query, param);
  Object.assign(request.body, param);

  await next();
}

module.exports = match;
