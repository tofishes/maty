const mkdirp = require('mkdirp');
const access = require('./access');

module.exports = async (filePath) => {
  const exist = await access(filePath);

  if (!exist) {
    return mkdirp.sync(filePath);
  }

  return exist;
}
