const jade = require('jade');
const log = require('t-log');
const maty = require('../index');
const loadModule = require('../utils/load-module');

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

// other template engine
stage.engine('jade', (filePath, data, callback) => {
  const fn = jade.compileFile(filePath, {
    cache: false
  });
  const html = fn(data);
  callback(null, html);
});

// auto load filters
loadModule(`${__dirname}/filters`, mod => mod(stage));

stage.mount(stage.app);

module.exports = { stage, app: stage.app };
