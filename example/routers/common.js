module.exports = {
  '/hello/:name': {
    view: 'hello'
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
  '/engine/jade': {
    view: 'engine/jade.jade'
  },
  '/redirect': {
    handle(data, ctx) {
      ctx.redirect('/api/comments');
    }
  }
}