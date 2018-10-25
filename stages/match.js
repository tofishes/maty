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

function matchInterceptor(ctx, interceptors) {
  const pathname = ctx.path;

  return interceptors.filter(interceptor => {
    if (ctx.xhr && interceptor.ajax !== true) {
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

const defaultMethod = 'get';
async function match(ctx, next) {
  const { app } = ctx;

  const { router, param = {} } = matchRouter(ctx.path, app.get('routers'));
  ctx.interceptors = matchInterceptor(ctx, app.get('interceptors'));

  ctx.param = param;

  // 未匹配到路由
  if (!router) {
    return next();
  }

  const method = ctx.method.toLowerCase();
  const supportRouter = (router.method || defaultMethod).includes(method);

  if (!supportRouter) {
    ctx.status = 405;
    ctx.body = `${method.toUpperCase()} Method Not Allowed`;
    return next();
  }

  ctx.router = router;
  // 合并参数
  Object.assign(ctx.query, param);
  Object.assign(ctx.reqBody, param);

  return next();
}

module.exports = match;
