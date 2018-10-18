module.exports = {
  '/router.api/is/function': {
    api() {
      this.view = 'api-is-function';
    }
  },
  '/router.api/is/array': {
    api: ['/api/comments', '/api/names'],
    handle(data) {
      const comments = data.getList('comments.data.list');
      const names = data.getList('names');

      return { comments, names };
    },
    view: 'comments-and-names'
  },
  '/router.api/is/series': {
    api: [{
      api: '/api/names',
      series: true
    }, {
      api: '/api/comments',
      handle(data, ctx) {
        const names = ctx.apiData.getList('names');

        if (names.length) {
          return data;
        } else {
          return {};
        }
      }
    }],
    handle(data) {
      const comments = data.getList('comments.data.list');
      const names = data.getList('names');

      return { comments, names };
    },
    view: 'comments-and-names'
  },
  '/router.view/is/function': {
    view() {
      return 'view-is-function';
    }
  },
  '/router.view/is/config': {
    view: 'view-is-string'
  },
  '/view-is-default-as-path': {
    api: '/api/comments',
    handle(data) {
      const commentsCount = data.getList('comments.data.list').length;
      return { commentsCount }
    }
  },
  '/router.cache/expires': {
    api: '/api/date',
    cache: 500,
    handle(data, ctx) {
      ctx.body = data.date;
    }
  },
  '/router.cache/expires/:time': {
    api: '/api/date',
    cache(ctx) {
      return +ctx.param.time;
    },
    handle(data, ctx) {
      ctx.body = data.date;
    }
  },
  '/router.api/use/ctx.forward': {
    api(ctx) {
      ctx.forward('/hello/world')
    }
  },
  '/router.handle/use/ctx.forward': {
    handle(data, ctx) {
      ctx.forward('/hello/world')
    }
  },
  '/router.timeout': {
    api: 'http://www.baidu.com',
    name: 'baidu',
    timeout: 1,
    handle(data, ctx) {
      ctx.status = data.baidu.code;
      ctx.body = data.baidu.message;
    }
  },
  '/router.proxy/string': {
    proxy: '/comment/list'
  },
  '/router.proxy/function': {
    proxy() {
      return '/api/comments';
    }
  },
  '/router.proxy/image': {
    proxy: '/assets/avatar.jpg'
  },
  '/router.defaultParam/:name/:age?': {
    defaultParam: {
      age: 20
    },
    handle(data, ctx) {
      ctx.body = `${ctx.param.name} is ${ctx.param.age} years old`;
    }
  }
}