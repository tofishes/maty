module.exports = {
  '/ctx-extend/param/:id': {
    handle(data, ctx) {
      ctx.body = ctx.param.id;
    }
  },
  '/ctx-extend/query/:id': {
    handle(data, ctx) {
      ctx.body = ctx.query.id;
    }
  },
  '/ctx-extend/reqbody/:id': {
    method: 'post',
    handle(data, ctx) {
      ctx.body = `${ctx.reqBody.id}: ${ctx.reqBody.name}`;
    }
  },
  '/ctx-extend/files': {
    method: 'post',
    handle(data, ctx) {
      ctx.body = ctx.request.files;
    }
  },
  '/ctx-extend/ua': {
    view: 'ua'
  },
  '/ctx-extend/module/sub': {
    handle(data, ctx) {
      ctx.body = ctx.moduleName;
    }
  },
  '/ctx-extend/second/three': {
    handle(data, ctx) {
      ctx.body = ctx.pathes.join(',');
    }
  },
  '/ctx-extend/xhr': {
    handle(data, ctx) {
      ctx.body = ctx.xhr;
    }
  },
}