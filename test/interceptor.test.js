const request = require('supertest');
const { server } = require('../example');
const comments = require('../example/data/comment-list.json');
const names = require('../example/data/name-list.json');

test('interceptor default ingnore ext', done => {
  request(app)
    .get('/interceptor/no.jpg')
    .expect(404, done);
});

test('interceptor static file with ext', done => {
  request(app)
    .get('/interceptor/hi.jpg')
    .expect(200, 'yes hi.jpg', done);
});

test('interceptor to supply common data', done => {
  const result = names.map(item => item.name).join(',');

  request(app)
    .get('/interceptor/user/list')
    .expect(200, result, done);
});

test('interceptor series', done => {
  request(app)
    .get('/interceptor/user/comments')
    .expect(200, `${comments.length}`, done);
});
