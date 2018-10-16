module.exports = {
  '/interceptor/forward/(.*)': {
    handle(data, ctx) {
      ctx.forward(ctx.path.replace('/interceptor/forward', ''));
    }
  },
  '/interceptor/hi.jpg': {
    handle(data, ctx) {
      ctx.body = 'yes hi.jpg';
    }
  },
  '/interceptor/user/(.*)': {
    api: '/api/names',
    series: true
  }
};
