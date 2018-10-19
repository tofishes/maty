const log = require('t-log');
const Koa = require('koa');
const maty = require('../index');

const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/my-origin-app')) {
    ctx.body = 'this is origin app features';

    return;
  }

  await next();
});

const stage = maty({
  baseDir: `${process.cwd()}/example`
});
stage.mount(app);

const port = 8080;
app.listen(port, () => {
  const startInfo = `server run at http://localhost:${port}`;

  log.info(startInfo);
});

