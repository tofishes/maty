const records = {};

function set(key) {
  const time = Date.now();
  records[key] = { time };

  return records[key];
}

function get(key) {
  let data = records[key];

  if (!data) {
    data = set(key);
  }

  data.bucket = Date.now() - data.time;

  return data;
}

function isExpired(key, expires) {
  return get(key).bucket >= expires;
}
/**
 * 缓存时间记录
 */
module.exports = { set, get, isExpired };
