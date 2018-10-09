const path = require('path');
const fs = require('fs');
const typeOf = require('../utils/typeof');

async function getViewPath(ctx, next) {
  const { request, response, stage} = ctx;
  const router = request.router || {};

  let view = router.view || request.path;

  if (typeOf(view).is('function')) {
    view = view.call(router, ctx);

    if (!view) {
      await next();
      return;
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

  response.viewPath = view;
  response.viewExt = ext;

  const filePath = path.join(stage.get('views'), view);

  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    response.viewFile = filePath;
  } catch (e) {
    const indexFile = filePath.replace(ext, `/index${ext}`);

    fs.access(indexFile, error => {
      if (!error) {
        response.viewFile = indexFile;
      }
    });
  }

  await next();
}

module.exports = getViewPath;
