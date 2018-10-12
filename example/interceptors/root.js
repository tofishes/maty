module.exports = {
  '/ajax/(.*)': {
    handle(data, ctx) {
      ctx.forward(ctx.path.replace('/ajax', ''));
    }
  }
};
