const maty = require('../index');

const stage = maty();
const port = 8080;

stage.listen(port, () => {
  const startInfo = `server run at http:\/\/localhost:${port}`;

  console.log(startInfo);
});
// get koa app
const app = stage.app;
