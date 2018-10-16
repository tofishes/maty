const minimatch = require('minimatch');
const log = require('t-log');

function render(ctx, next) {
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

  return new Promise((resolve, reject) => {
    engine(viewFile, data, (err, html) => {
      if (err) {
        reject(err);
      } else {
        ctx.body = html;
        resolve(html);
      }
    });
  });
}

module.exports = render;
