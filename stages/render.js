const minimatch = require('minimatch');
const log = require('t-log');

async function render(ctx, next) {
  const { stage, viewFile } = ctx;

  if (!viewFile) {
    if (Object.keys(ctx.apiData).length) {
      return ctx.body = ctx.apiData;
    }

    return next();
  }

  const excludes = stage.get('viewExclude')
    .filter(exclude => minimatch(viewFile, exclude));

  // 匹配到需排除渲染的路径
  if (excludes.length) {
    log.warn(`viewPath: ${ctx.viewPath} is excluded!`);

    return next();
  }

  const engine = stage.engines[ctx.viewExt];

  if (!engine) {
    return ctx.throw(`File type '${ctx.viewExt}' has no template engine`);
  }

  const data = Object.assign({ ctx }, ctx.state, ctx.apiData);

  try {
    ctx.body = await engine(viewFile, data);
  } catch (e) {
    ctx.throw(e);
  }
}

module.exports = render;
