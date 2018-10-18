const glob = require('glob');
const nunjucks = require('nunjucks');
const cache = require("lru-cache");

const env = require('../utils/env');
const makedir = require('../utils/makedir');
const parseMultiName = require('../utils/parse-multi-name');
const parseRouter = require('./parse-router');
const Stage = require('./stage');

const pwd = process.cwd();
const defaultRouterDir = `${pwd}/routers`;
const defaultInterceptorDir = `${pwd}/interceptors`;
const defaultViewDir = `${pwd}/views`;
const defaultUploadDir = `${pwd}/uploads`;

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
 * 框架maty，基于koa.js用于简化前端页面直出流程的框架
 *
 * @param  {[type]} args 配置对象
 * args.routerDir: 路由配置目录
 * args.handleAPI: 预处理api地址
 * @return {[type]}      [description]
 */
module.exports = (args = {}) => {
  const {
    routerDir = defaultRouterDir,           // 路由目录
    interceptorDir = defaultInterceptorDir, // 拦截器目录
    viewDir = defaultViewDir,               // 视图模板目录
    viewExclude = ['**/include/**'],        // 排除自动渲染模板的目录，采用glob匹配规则
    apiDataCache = cache(),                 // 接口数据缓存方法，默认lru-cache实现
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

  const stage = new Stage();

  // 存储
  stage.set('interceptorMap', interceptorMap);
  stage.set('interceptors', interceptors);
  stage.set('routerMap', routerMap);
  stage.set('routers', routers);
  stage.set('views', viewDir);
  stage.set('viewExclude', viewExclude);
  // 保存接口数据缓存方法
  stage.set('apiDataCache', apiDataCache);
  // 保存接口数据名方法
  stage.set('apiDataName', apiDataName);
  // 保存接口地址处理方法
  stage.set('handleAPI', handleAPI);

  stage.set('ajaxCache', ajaxCache);
  stage.set('uploadDir', uploadDir);

  makedir(uploadDir);

  // 添加默认模板引擎
  const nunjucksEnv = nunjucks.configure(viewDir, {
    autoescape: true,
    noCache: env.isDev,
    watch: env.isDev
  });
  stage.set('nunjucks', nunjucks);
  stage.set('nunjucksEnv', nunjucksEnv);
  stage.engine('njk', (filePath, data) => {
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
  stage.set('view engine', 'njk');

  return stage;
};
