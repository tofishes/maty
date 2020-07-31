/**
 * 解析route配置文件
 * 名词定义：
 * route - 路由、路线，仅指字符串路径，例如 '/hello/:name'
 * router - 路由器，只包含route在内的一个配置对象
 */
const { pathToRegexp } = require('path-to-regexp');
const loop = item => item;

function parseRouter(route, config = {}) {
  config.route = route;
  // 发现：config.paramKeys === config.pathRegx.keys 为true
  // 不明白express为什么这么写，可能是为了代码清晰，也可能写的时候不知道这种情况？
  config.paramKeys = [];
  config.pathRegx = pathToRegexp(route, config.paramKeys);

  return config;
}

// 解析route为正则并存到router对象中
exports.parseRouter = parseRouter;

exports.parseRouters = (routerMap, each = loop) => {
  const routers = Object.keys(routerMap).map(route => {
    const router = parseRouter(route, routerMap[route]);

    each(router);

    return router;
  });
  return routers;
}

/**
 * 根据是否有参数来排序，让无参数的排前面优先匹配
 * 解决类似 /news/list 和 /news/:id 这样的路由冲突
 */
exports.optimizeRouters = (routers) =>
  routers.sort(router => router.paramKeys.length ? 1 : -1)