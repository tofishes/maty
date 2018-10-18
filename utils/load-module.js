const glob = require('glob');

module.exports = function loadModule(dir, oneach) {
  const files = glob.sync(`${dir}/**/*.js`);
  files.forEach(file => {
    const mod = require(file); // eslint-disable-line global-require
    oneach(mod);
  });
}
