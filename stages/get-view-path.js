const path = require('path');
const fs = require('fs');
const typeOf = require('../utils/typeof');

async function getViewPath(ctx, next) {
  const { stage, router = {} } = ctx;

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
  const defaultEngine = stage.get('view engine');
  let ext = path.extname(view);

  if (!ext) {
    ext = defaultEngine.startsWith('.') ? defaultEngine : `.${defaultEngine}`;
    view += ext;
  }

  ctx.viewPath = view;
  ctx.viewExt = ext;

  const filePath = path.join(stage.get('views'), view);

  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    ctx.viewFile = filePath;
  } catch (e) {
    const indexFile = filePath.replace(ext, `/index${ext}`);

    fs.access(indexFile, error => {
      if (!error) {
        ctx.viewFile = indexFile;
      }
    });
  }

  return next();
}

module.exports = getViewPath;
