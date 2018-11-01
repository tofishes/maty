const send = require('koa-send');
const access = require('../../utils/access');

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
  },
  '/assets/(.*)': {
    async api(ctx) {
      const filePath = `/example${ctx.path}`;
      const root = process.cwd();

      console.log('---------------------------')
      console.log(root, filePath, await access(root + filePath), '--------------')

      if (await access(root + filePath)) {
        await send(ctx, filePath);
      }

      return null;
    }
  }
};
