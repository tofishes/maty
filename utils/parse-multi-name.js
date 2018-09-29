const extend = require('extend');

const noop = () => {};
const separator = ',';
/**
 * 配置对象中key是以逗号间隔的字符串，解析为两个或多个配置，并返回新的配置
 * @param  {[type]} map  [description]
 * @param  {[type]} each [description]
 * @return {[type]}      [description]
 */
module.exports = function parseMultiName(map, each = noop) {
  const keys = Object.keys(map);
  const newMap = {};

  keys.forEach(name => {
    const names = name.split(separator);

    if (names.length > 1) {
      names.forEach(item => {
        // part不能为同一个对象的引用，需深拷贝该对象
        // 如果为同一个对象引用，多路由参数的解析会发生覆盖，也可能造成each方法不可预料的问题
        const part = extend(true, {}, map[name]);
        newMap[item.trim()] = part;
        each(item, part);
      });
    } else {
      newMap[name] = map[name];
      each(name, map[name]);
    }
  });

  return newMap;
};
