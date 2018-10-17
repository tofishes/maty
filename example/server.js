const log = require('t-log');
const { app } = require('./index');

const port = 8080;

app.listen(port, () => {
  const startInfo = `server run at http://localhost:${port}`;

  log.info(startInfo);
});

