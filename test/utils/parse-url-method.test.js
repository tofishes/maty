const parseURLMethod = require('../../utils/parse-url-method');

describe('util parse-url-method', () => {
  it('should get post method when url is post: prefix', () => {
    const urlMethod = parseURLMethod('post:/api');

    expect(urlMethod.method).toBe('post');
    expect(urlMethod.url).toBe('/api');
  });
  it('should get default post method', () => {
    const urlMethod = parseURLMethod('/api', 'post');
    expect(urlMethod.method).toBe('post');
    expect(urlMethod.url).toBe('/api');
  });
  it('should get default get method', () => {
    const urlMethod = parseURLMethod('/api');
    expect(urlMethod.method).toBe('get');
    expect(urlMethod.url).toBe('/api');
  });
});
