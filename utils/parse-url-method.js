const delimiter = ':';
const methods = ['get', 'post', 'put', 'delete'];

// 提取api中配置的方法
// 例如 api: 'post:/api/adress'
function parseURLMethod(api, defaultMethod = 'get') {
  const markIndex = api.indexOf(delimiter);
  let method = defaultMethod;
  let url = api;

  if (~markIndex) {
    method = url.substr(0, markIndex);
    url = url.substr(markIndex + 1);
  }

  method = method.toLowerCase();

  return {
    url, method
  };
}

parseURLMethod.methods = methods;

module.exports = parseURLMethod;
