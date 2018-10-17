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
      handle(data) {
        if (data.getList('names').length) {
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
    'get': {
      api: '/api/date',
      cache: 500,
      handle(data) {
        ctx.body = data.date;
      }
    }
  },
  '/router.cache/expires/:time': {
    'get': {
      api: '/api/date',
      cache(ctx) {
        return +ctx.param.time;
      },
      handle(data) {
        ctx.body = data.date;
      }
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
  '/router.view/use/ctx.forward': {
    view(ctx) {
      ctx.forward('/hello/world')
    }
  },
  '/router.timeout': {
    api: 'http://www.baidu.com',
    name: 'baidu',
    timeout: 1,
    handle(data, ctx) {
      ctx.status = data.baidu.code;
      ctx.body = 'timeout';
    }
  },
  '/router/proxy/string': {
    proxy: '/comment/list'
  },
  '/router/proxy/function': {
    proxy() {
      return '/api/comments';
    }
  }
}