const log = require('t-log');
const express = require('express');
const swig = require('swig'); // eslint-disable-line
const coc = require('../index');
const apiMap = require('./api-map');

const app = express();

app.engine('swig', swig.renderFile);

app.use('/favicon.ico', (req, res) => res.send('ok'));

// 子目录挂载应放在全局的前面
const stageB = coc(app, {
  mount: '/b-plan',
  routerDir: `${__dirname}/routers-b`,
  ajaxCache: false
});

stageB.set('view engine', '.njk'); // can startsWith dot or not dot

const stage = coc(app, {
  interceptorDir: `${__dirname}/interceptors`,
  routerDir: `${__dirname}/routers`,
  viewDir: `${__dirname}/views`,
  handleAPI(apiUrl) {
    const apiDomain = apiMap[apiUrl] || '';

    return apiDomain + apiUrl;
  }
});

require('marko/node-require').install();  // eslint-disable-line
stage.engine('marko', (filePath, data, callback) => {
  const template = require(filePath); // eslint-disable-line

  template.renderToString(data, callback);
});

// 查看阶段列表，每个阶段都可以用before,after处理
log.info(stage.stageNames);

stage.before('pageInfo', function beforePageInfo(req, res, next) {
  req.reqCircle = log.time();
  next();
});
stage.before('initHttpRequest', function beforeInitHttpRequest(req, res, next) {
  let timeout = 5 * 1000;

  if (req.router && req.router.timeout) {
    timeout = req.router.timeout;
  }
  req.httpRequestConfig = { timeout };

  next();
});

// forward has been test
stage.after('requestProxy', function afterRequestProxy(req, res, next) {
  const pathname = req.pathname;
  log.debug('param:', req.param);
  log.debug('path:', pathname);

  if (pathname === '/forward') {
    res.forward('/proxy');
    // res.redirect('http://www.163.com');
    // res.status(200).send('hello 200 ok!');
    // next已经可以正确处理forward情况
    // 类似redirect，res.send等已经响应了服务器的情况
    next();
    return;
  }

  next();
});
stage.before('response', function beforeResponse(req, res, next) {
  const apiInfo = res.apiInfo;

  Object.keys(apiInfo).map(name => {
    const info = apiInfo[name];
    return log.info(info.method, info.api, info.consumeTime, 'ms');
  });
  log.warn('cost time: ', req.reqCircle.end());

  next();
});

app.use((req, res) => {
  res.status(404).send('404 not found!');
});

app.use((error, req, res, next) => { // eslint-disable-line
  res.status(500).send(`<pre>${error.stack}</pre>`);
});

app.listen(8080, () => {
  const startInfo = 'server run at http://localhost:8080';

  log.info(startInfo);
});

module.exports = app;
