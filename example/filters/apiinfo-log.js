const log = require('t-log');

module.exports = (stage) => {
  // extend router.defaultParam
  stage.filter('response', async (ctx, next) => {
    await next();

    const apiInfo = ctx.apiInfo;

    Object.keys(apiInfo).map(name => {
      const info = apiInfo[name];
      log.info(info.method, info.api, info.consumeTime, 'ms');
    });
  });

}
