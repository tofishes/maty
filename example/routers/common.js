module.exports = {
  '/': {
    view: 'home'
  },
  '/hello/:name': {
    view: 'hello'
  },
  '/hello/no-param-first': { // 和/hello/:name路由冲突，以无参数匹配优先访问
    handle(data, ctx) {
      ctx.body = 'conflict router and no-param-first'
    }
  },
  '/comment/list': {
    api: '/api/comments',
    cache: true,
    pageCache: false,
    handle(data, ctx) {
      const commentList = data.getList('comments.data.list');

      return { commentList };
    },
    view: 'comments'
  },
  '/engine/pug': {
    view: 'engine/pug.pug'
  },
  '/redirect': {
    handle(data, ctx) {
      ctx.redirect('/api/comments');
    }
  }
}