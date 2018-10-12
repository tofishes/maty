module.exports = {
  '/comment/list': {
    api: '/api/comments',
    cache: true,
    handle(data, ctx) {
      const commentList = data.getList('comments.data.list');

      return { commentList };
    },
    view: 'comments'
  }
}