const maty = require('../index');

const app = maty();
const port = 8080;

app.filter('request', async (ctx, next) => {
  console.log('before request...');

  await next();

  console.log('after request, match router:\n', ctx.router);
});

app.filter('response', async (ctx, next) => {
  console.log('before response...');

  await next();

  console.log('after response, ctx.body:\n', ctx.body);
});

app.listen(port, () => {
  const startInfo = `server run at http:\/\/localhost:${port}`;

  console.log(startInfo);
});
