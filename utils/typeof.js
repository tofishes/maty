module.exports = function typeOf(obj) {
  const type = Object.prototype.toString.call(obj)
    .toLowerCase()
    .replace('[object ', '')
    .replace(']', '')
    .replace('async', '');

  const r = {
    type,
    'is': typeName => typeName.toLowerCase() === type
  };

  const props = {
    isFunc: 'function',
    isString: 'string'
  };

  Object.keys(props).map(name => {
    Reflect.defineProperty(r, name, {
      get () {
        return this.type === props[name];
      }
    });
  });

  return r;
};
