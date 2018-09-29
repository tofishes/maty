const methodMark = ':';
const methods = ['get', 'post', 'put', 'delete'];

// 提取api中配置的方法
// 例如 api: 'post:/api/adress'
function parseURLMethod(api, defaultMethod = 'get') {
  const markIndex = api.indexOf(methodMark);
  let method = defaultMethod;
  let url = api;

  if (~markIndex) {
    const prefix = url.substr(0, markIndex);
    // 是支持的方法
    if (~methods.indexOf(prefix)) {
      method = prefix;
      url = url.substr(markIndex + 1);
    }
  }

  method = method.toLowerCase();

  return {
    url, method
  };
}

parseURLMethod.methods = methods;

module.exports = parseURLMethod;
