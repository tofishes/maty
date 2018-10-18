module.exports = (stage) => {
  // extend router.defaultParam
  stage.filter('request', async (ctx, next) => {
    await next();

    const { defaultParam } = ctx.router || {};

    if (defaultParam) {
      ctx.param = Object.assign({}, defaultParam, ctx.param);
      Object.assign(ctx.query, ctx.param);
      Object.assign(ctx.reqBody, ctx.param);
    }
  });
}
