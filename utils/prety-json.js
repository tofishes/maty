// 格式化输出json
module.exports = function pretyJSON(json) {
  return JSON.stringify(json, null, 2);
};
