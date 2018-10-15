const urlInfo = require('../../utils/url-info');

it('should get exactly moduleName and pathes', () => {
  const url1 = '/news/abc';
  const url2 = 'news';
  const url3 = '/news';
  const url4 = '/';
  const url5 = '';

  expect(urlInfo(url1).moduleName).toBe('news');
  expect(urlInfo(url2).moduleName).toBe('news');
  expect(urlInfo(url3).moduleName).toBe('news');
  expect(urlInfo(url4).moduleName).toBe('home');
  expect(urlInfo(url5).moduleName).toBe('home');
});
