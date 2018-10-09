module.exports = {
  '/comments': {
    api: '/api/comments',
    handle(data, ctx) {
      const commentList = data.getList('comments.data.list');

      return { commentList };
    }
  }
}