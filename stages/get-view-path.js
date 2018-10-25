const path = require('path');
const fs = require('fs');
const typeOf = require('../utils/typeof');

function access(filePath) {
  return new Promise(resolve => {
    fs.access(filePath, error => {
      resolve(error ? null : filePath);
    });
  });
}

async function getViewPath(ctx, next) {
  const { app, router = {} } = ctx;

  let view = router.view || ctx.path;

  if (typeOf(view).isFunc) {
    view = view.call(router, ctx);

    if (!view) {
      return next();
    }
  }

  // view配置可以不以/开头
  if (!view.startsWith('/')) {
    view = `/${view}`;
  }

  // 已设置默认引擎
  const defaultEngine = app.get('view engine');
  let ext = path.extname(view);

  if (!ext) {
    ext = defaultEngine.startsWith('.') ? defaultEngine : `.${defaultEngine}`;
    view += ext;
  }

  ctx.viewPath = view;
  ctx.viewExt = ext;

  const filePath = path.join(app.get('views'), view);
  let viewFile = await access(filePath);

  if (!viewFile) {
    const indexFile = filePath.replace(ext, `/index${ext}`);
    viewFile = await access(indexFile);
  }

  ctx.viewFile = viewFile;

  return next();
}

module.exports = getViewPath;
