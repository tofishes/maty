module.exports = {
  '/forward/inner': {
    handle(data, ctx) {
      ctx.forward('/comment/list');
    }
  },
  '/forward/outer': {
    handle(data, ctx) {
      ctx.forward('http://www.baidu.com');
    }
  },
  '/forward/self': {
    handle(data, ctx) {
      ctx.forward('/forward/self');
    }
  }
}