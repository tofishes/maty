const pug = require('pug');
const log = require('t-log');
const maty = require('../index');
const loadModule = require('../utils/load-module');

const app = maty({
  baseDir: `${process.cwd()}/example`,
  handleAPI(apiUrl, ctx) {
    if (apiUrl.startsWith('/')) {
      return `${ctx.origin}${apiUrl}`;
    }

    return apiUrl;
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    ctx.body = 'ok';
    return;
  }

  const timer = log.time();

  await next();

  log.warn(`this request ${ctx.path} cost time ${timer.end()}`)
});

// other template engine
app.engine('pug', (filePath, data) => {
  const fn = pug.compileFile(filePath, {
    cache: true
  });
  const html = fn(data);

  return html;
});

// auto load filters
loadModule(`${__dirname}/filters`, mod => mod(app));

// just for jest test env
const isOnJest = typeof jest !== 'undefined';
if (!isOnJest) {
  const port = 8080;
  app.listen(port, () => {
    const startInfo = `server run at http://localhost:${port}`;

    log.info(startInfo);
  });
}

module.exports = { app };
