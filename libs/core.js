const glob = require('glob');
const nunjucks = require('nunjucks');
const Cache = require("lru-cache");

const Maty = require('./maty');
const parseRouter = require('./parse-router');
const env = require('../utils/env');
const makedir = require('../utils/makedir');
const parseMultiName = require('../utils/parse-multi-name');

function loadRoutes(dir) {
  const map = {};
  const files = glob.sync(`${dir}/**/*.js`);

  files.forEach(file => {
    const routesPart = require(file); // eslint-disable-line
    Object.assign(map, parseMultiName(routesPart));
  });

  return map;
}

function simpleApiDataName(api) {
  return api.substr(api.lastIndexOf('/') + 1);
}

/**
 * maty，基于koa.js用于简化前端页面直出流程的框架
 *
 * @param  {[type]} args 配置对象
 * args.routerDir: 路由配置目录
 * args.handleAPI: 预处理api地址
 * @return {[type]}      [description]
 */
module.exports = (args = {}) => {
  const base = args.baseDir || process.cwd();
  const defaultRouterDir = `${base}/routers`;
  const defaultInterceptorDir = `${base}/interceptors`;
  const defaultViewDir = `${base}/views`;
  const defaultUploadDir = `${base}/uploads`;

  const {
    routerDir = defaultRouterDir,           // 路由目录
    interceptorDir = defaultInterceptorDir, // 拦截器目录
    viewDir = defaultViewDir,               // 视图模板目录
    viewExclude = ['**/include/**'],        // 排除自动渲染模板的目录，采用glob匹配规则
    apiDataCache = new Cache(500),          // 接口数据缓存方法，默认lru-cache实现
    apiDataName = simpleApiDataName,        // 接口数据名方法，默认为获取api地址最后一个/后面的单词名
    handleAPI = url => url,                 // router.api地址预处理方法，默认返回自身
    ajaxCache = true,                       // 是否允许缓存ajax响应结果，默认允许缓存
    uploadDir = defaultUploadDir
  } = args;

  const interceptorMap = loadRoutes(interceptorDir);
  const routerMap = loadRoutes(routerDir);
  const routers = parseRouter(routerMap);
  const interceptors = parseRouter(interceptorMap, interceptor => {
    interceptor.type = 'interceptor';
  });

  const app = new Maty();

  // 存储
  app.set('interceptorMap', interceptorMap);
  app.set('interceptors', interceptors);
  app.set('routerMap', routerMap);
  app.set('routers', routers);
  app.set('views', viewDir);
  app.set('viewExclude', viewExclude);
  // 保存接口数据缓存方法
  app.set('apiDataCache', apiDataCache);
  // 保存接口数据名方法
  app.set('apiDataName', apiDataName);
  // 保存接口地址处理方法
  app.set('handleAPI', handleAPI);

  app.set('ajaxCache', ajaxCache);
  app.set('uploadDir', uploadDir);

  makedir(uploadDir);

  // 添加默认模板引擎
  const nunjucksEnv = nunjucks.configure(viewDir, {
    autoescape: true,
    noCache: env.isDev,
    watch: env.isDev
  });
  app.set('nunjucks', nunjucks);
  app.set('nunjucksEnv', nunjucksEnv);
  app.engine('njk', (filePath, data) => {
    return new Promise((resolve, reject) => {
      nunjucksEnv.render(filePath, data, (error, html) => {
        if (error) {
          reject(error);
        } else {
          resolve(html);
        }
      });
    });
  });
  app.set('view engine', 'njk');

  return app;
};
