// class Stage
const Koa = require('koa');
const compose = require('koa-compose');
const bodyParser = require('koa-body');
const minimatch = require('minimatch');

// request stages
const ready = require('../stages/ready');
const match = require('../stages/match');
const initHttpRequest = require('../stages/init-http-request');
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
    this.defautStages = {
      request: [ready, match, initHttpRequest],
      response: [handler, forward, getView, render]
    };
    this.stages = Object.keys(this.defautStages);
    this.filterMap = {};
    this.filters = [];
    this.props = {};
    this.engines = {};

    this.stages.map(stageName => {
      this.filterMap[stageName] = [];
    });

    this.app = new Koa();
  }

  // 添加filter
  filter(stageName, action) {
    const filters = this.filterMap[stageName]; // this.filterMap[stagesName];

    if (!filters) {
      throw new Error(`filter to ${stageName} must be one of ${this.stages}!`);
    }

    filters.push(action);

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

  convert(actions) {
    return actions.map(action => {
      return async (ctx, next) => {
        if (action.isStage && ctx.isEnd) {
          return;
        }

        await action(ctx, next);
      }
    });
  }

  mount(path, koaApp) {
    let [app, mountPath] = [koaApp, path];

    if (path instanceof Koa) {
      app = path;
      mountPath = null;
    }

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
    app.context.forward = function forward(url) {
      const ctx = this;
      let forwardUrl = url;

      if (url === ctx.path) {
        ctx.throw(500, 'Can’t forward to same request path');
      }

      if (url.startsWith('/')) {
        forwardUrl = ctx.origin + url;
      }

      ctx.forwardUrl = forwardUrl;
    }

    const starters = this.stages.map(stage => {
      const actions = this.filterMap[stage].concat(this.defautStages[stage].map(action => {
        action.isStage = true;
        return action;
      }));

      return compose(this.convert(actions));
    });

    app.use(async (ctx, next) => {
      const isMatchMount = !mountPath || minimatch(ctx.path, mountPath);

      if (isMatchMount) {
        for (const fn of starters) {
          await fn(ctx);
        }
      }

      await next();
    });
  }

  listen(...args) {
    this.mount(this.app);
    return this.app.listen.apply(this.app, args);
  }
}

module.exports = Stage;
