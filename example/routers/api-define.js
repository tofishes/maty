const comments = require('../data/comment-list.json');

module.exports = {
  '/api/comments': {
    methods: ['get', 'post'],
    handle() {
      return comments;
    }
  }
}