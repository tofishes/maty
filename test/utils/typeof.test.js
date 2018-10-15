const typeOf = require('../../utils/typeof');

test('get right result type', () => {
  expect(typeOf({}).type).toBe('object');
  expect(typeOf(() => {}).type).toBe('function');
  expect(typeOf([]).type).toBe('array');
  expect(typeOf(1).type).toBe('number');
  expect(typeOf(Number(1)).type).toBe('number');
  expect(typeOf('1').type).toBe('string');
  expect(typeOf(true).type).toBe('boolean');
  expect(typeOf('a').isString).toBeTruthy();
  expect(typeOf(() => {}).isFunc).toBeTruthy();

  expect(typeOf('a').is('string')).toBeTruthy();
  expect(typeOf(() => {}).is('function')).toBeTruthy();
});
