const log = require('t-log');
const maty = require('../index');
const apiMap = require('./api-map');

const stage = maty({
  interceptorDir: `${__dirname}/interceptors`,
  routerDir: `${__dirname}/routers`,
  viewDir: `${__dirname}/views`,
  handleAPI(apiUrl) {
    const apiDomain = apiMap[apiUrl] || '';

    return apiDomain + apiUrl;
  }
});

stage.app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    ctx.body = 'ok';
    return;
  }

  const timer = log.time();

  await next();

  log.warn(`this request ${ctx.path} cost time ${timer.end()}`)
});


require('marko/node-require').install();  // eslint-disable-line
stage.engine('marko', (filePath, data, callback) => {
  const template = require(filePath); // eslint-disable-line

  template.renderToString(data, callback);
});

stage.filter('response', async (ctx, next) => {
  await next();

  const apiInfo = ctx.apiInfo;

  Object.keys(apiInfo).map(name => {
    const info = apiInfo[name];
    log.info(info.method, info.api, info.consumeTime, 'ms');
  });
});

stage.listen(8080, () => {
  const startInfo = 'server run at http://localhost:8080';

  log.info(startInfo);
});
