const minimatch = require('minimatch');
const log = require('t-log');

function render(ctx, next) {
  const { response, stage } = ctx;
  const filePath = response.viewFile;

  if (!filePath) {
    return next();
  }

  const excludes = stage.get('viewExclude')
    .filter(exclude => minimatch(filePath, exclude));

  // 匹配到需排除渲染的路径
  if (excludes.length) {
    log.warn(`viewPath: ${response.viewPath} is excluded!`);

    return next();
  }

  const engine = stage.engines[response.viewExt];

  if (!engine) {
    throw new Error(`File type '${response.viewExt}' has no template engine`);
  }

  const data = Object.assign({}, ctx.state, ctx.apiData);

  return new Promise((resolve, reject) => {
    engine(filePath, data, (err, html) => {
      if (err) {
        reject(err);
      } else {
        ctx.body = html;
      }
    });
  });
}

module.exports = render;
