const comments = require('../data/comment-list.json');
const names = require('../data/name-list.json');

module.exports = {
  '/api/comments': {
    method: 'get, post',
    handle() {
      return comments;
    }
  },
  '/api/names': {
    handle() {
      return names;
    }
  },
  '/api/date': {
    handle(data, ctx) {
      ctx.body = Date.now();
    }
  },
}