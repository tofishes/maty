module.exports = {
  '/forward/inner/page': {
    handle(data, ctx) {
      ctx.forward('/comments');
    }
  },
  '/forward/outer/domain': {
    handle(data, ctx) {
      ctx.forward('http://www.baidu.com');
    }
  },
  '/forward/api/comments': {
    forward: '/api/comments'
  },
  '/forward/api/comments/func': {
    forward() {
      return '/api/comments';
    }
  }
}