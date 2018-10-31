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
  '/api/article/detail': {
    handle(data, ctx) {
      return {
        title: 'article title',
        viewCount: 500,
        content: 'article content'
      };
    }
  },
  '/api/author/info': {
    handle(data, ctx) {
      return {
        name: 'tom',
        age: 28
      };
    }
  },
  '/api/user/info': {
    handle(data, ctx) {
      return {
        id: 'xxxxx',
        username: 'newUser'
      }
    }
  },
  '/api/relation-articles': {
    handle(data, ctx) {
      ctx.body = [{
        title: 'article title1',
        viewCount: 100,
        content: 'article content1'
      }, {
        title: 'article title2',
        viewCount: 200,
        content: 'article content2'
      }];
    }
  }
}