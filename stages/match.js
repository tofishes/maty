/**
 * 匹配route
 * 两种匹配方法： 1、用filter得到全部匹配； 2、for循环得到一个匹配就终止；
 * 目前按第二种方式
 */
function getParam(pathInfo, paramKeys) {
  // 得到参数
  // https://github.com/expressjs/express/blob/master/lib/router/layer.js
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
    const routeExt = ~route.indexOf('.');
    const ignoreExt = routeExt || !~pathname.indexOf('.');

    return matchPath && ignoreExt;
  });
}

function match(ctx, next) {
  const { request, stage } = ctx;

  const pathname = request.pathname;
  const routers = stage.get('routers');

  const { router, param = {} } = matchRouter(pathname, routers);
  request.interceptors = matchInterceptor(request, stage.get('interceptors'));

  request.param = param;

  // 未匹配到路由
  if (!router) {
    return next();
  }

  const method = request.method.toLowerCase();
  const supportRouter = router.methods.includes(method);

  if (!supportRouter) {
    throw new Error(`405 ${method.toUpperCase()} Method Not Allowed`);
  }

  request.router = router;
  // 合并参数
  Object.assign(request.query, param);
  // 若未使用body-parser，request.body为undefined
  Object.assign(request.body, param);

  return next();
}

module.exports = matchRouter;
