// class Stage
const qs = require('qs');
const minimatch = require('minimatch');
const Koa = require('koa');
const bodyParser = require('koa-body');

// request stages
const pageInfo = require('../stages/page-info');
const initHttpRequest = require('../stages/init-http-request');
const match = require('../stages/match');
// response stages
const handler = require('../stages/handler');
const forward = require('../stages/forward');
const getView = require('../stages/get-view-path');
const render = require('../stages/render');

const urlInfo = require('../utils/url-info');

const concat = Array.prototype.concat;
const defaultLimit = 1000 * 1024 * 1024; // 1000M

class Stage {
  constructor() {
    this.filterMap = {
      request: [pageInfo, initHttpRequest, match],
      response: [handler, forward, getView, render]
    };
    this.stages = Object.keys(this.filterMap);
    this.filters = [];
    this.props = {};
    this.engines = {};

    this.app = new Koa();
  }

  merge() {
    // 合并所有的filters
    this.stages.map(name => {
      this.filters = this.filters.concat(this.filterMap[name]);
    });
  }
  // 添加filter
  on(stageName, action) {
    const filters = this.filterMap[stageName]; // this.filterMap[stagesName];

    if (!filters) {
      throw new Error(`Stage ${name} is not supported!`);
    }

    const actions = Array.isArray(action) ? action : [action];

    filters.push.apply(filters, actions);

    return this;
  }

  set(name, value) {
    this.props[name] = value;
    return this;
  }

  get(name) {
    return this.props[name];
  }

  engine(extName, render) {
    this.engines[`.${extName}`] = render;
    return this;
  }

  convert(stage, mountPath) {
    return async (ctx, next) => {
      // todo remove
      // if (stage.name) {
      //   console.log(stage.name, '----')
      // } else {
      //   console.log(stage.toString(), '---')
      // }
      if (!mountPath) {
        return await stage(ctx, next);
      }

      if (typeof ctx.isMatchMount !== 'boolean') {
        ctx.isMatchMount = minimatch(ctx.path, mountPath);
      }

      if (ctx.isMatchMount) {
        return await stage(ctx, next);
      }

      return await next();
    }
  }

  mount(app, path) {
    this.merge();

    app.use(bodyParser({
      jsonLimit: defaultLimit,
      formLimit: defaultLimit,
      textLimit: defaultLimit,
      multipart: true,
      formidable: {
        keepExtensions: true,
        maxFieldsSize: defaultLimit,
        uploadDir: this.get('uploadDir')
      }
    }));

    // 扩展context
    Reflect.defineProperty(app.context, 'isEnd', {
      get() {
        return this.body !== undefined;
      }
    });
    app.context.stage = this;

    this.filters.map(filter => {
      app.use(this.convert(filter, path));
    });
  }

  listen(...args) {
    this.mount(this.app);

    this.app.listen.apply(this.app, args);
  }
}

module.exports = Stage;
