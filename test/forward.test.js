const request = require('supertest');
const { app } = require('../example');

// todo
test('forward inner page', done => {
  request(app.callback())
    .get('/forward/inner')
    .expect(200, /热门评论/, done);
});
// todo
test('forward outer page', done => {
  request(app.callback())
    .get('/forward/outer')
    .expect(200, /百度一下/, done);
});
// todo
test('forward to self', done => {
  request(app.callback())
    .get('/forward/self')
    .expect(500, /Can’t forward to same request path/, done);
});

test('forward in interceptor', done => {
  request(app.callback())
    .get('/interceptor/forward/comment/list')
    .expect(200, /热门评论/, done);
});

