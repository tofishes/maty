// class Stage
const qs = require('qs');
const minimatch = require('minimatch');
const bodyParser = require('koa-body');

const urlInfo = require('../utils/url-info');
const concat = Array.prototype.concat;
const defaultLimit = 1000 * 1024 * 1024; // 1000M

class Stage {
  constructor() {
    const filterMap = {};

    this.stages = ['request', 'response'];
    this.stages.map(name => {
      filterMap[name] = [];
    });

    this.filters = [];
    this.filterMap = filterMap;
    this.props = {};
    this.engines = {};
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

    action.isFilter = true;
    action.role = `filter-${stageName}`;

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

  convert(stage, mountPath) {
    return (ctx, next) => {
      if (!ctx.isEnd) {
        return ctx.body;
      }

      if (!mountPath) {
        return stage(ctx, next);
      }

      if (typeof ctx.isMatchMount !== 'boolean') {
        ctx.isMatchMount = minimatch(ctx.path, mountPath);
      }

      if (ctx.isMatchMount) {
        return stage(ctx, next);
      }

      return next();
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
    const app = new Koa();

    this.mount(app);

    app.listen.apply(app, args);
  }
}

module.exports = Stage;
