const jade = require('jade');
const log = require('t-log');
const maty = require('../index');

const stage = maty({
  interceptorDir: `${__dirname}/interceptors`,
  routerDir: `${__dirname}/routers`,
  viewDir: `${__dirname}/views`,
  handleAPI(apiUrl, ctx) {
    if (apiUrl.startsWith('/')) {
      return `${ctx.origin}${apiUrl}`;
    }

    return apiUrl;
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

stage.engine('jade', (filePath, data, callback) => {
  const fn = jade.compileFile(filePath, {
    cache: false
  });
  const html = fn(data);
  callback(null, html);
});

stage.filter('response', async (ctx, next) => {
  await next();

  const apiInfo = ctx.apiInfo;

  Object.keys(apiInfo).map(name => {
    const info = apiInfo[name];
    log.info(info.method, info.api, info.consumeTime, 'ms');
  });
});

stage.mount(stage.app);

module.exports = { stage, app: stage.app };
