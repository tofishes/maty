module.exports = {
  '/interceptor/user/list': {
    handle(data, ctx) {
      const names = data.names; // from interceptor
      ctx.body = names.map(item => item.name).join(',');
    }
  },
  '/interceptor/user/comments': {
    api(ctx) {
      const names = ctx.apiData.names; // from interceptor

      if (names.length) {
        return '/api/comments'
      }
    },
    handle(data, ctx) {
      const comments = data.getList('comments.data.list');

      ctx.body = comments.length;
    }
  }
}