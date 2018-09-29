const comments = require('../../data/comment-list.json');
const names = require('../../data/name-list.json');

module.exports = {
  '/backend/comments': {
    'get': {
      handle(data, req, res) {
        res.json(comments);
      }
    }
  },
  '/backend/names': {
    'get': {
      handle(data, req, res) {
        res.json(names);
      }
    }
  }
};
