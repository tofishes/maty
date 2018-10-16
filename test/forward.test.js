const request = require('supertest');
const { server, stage } = require('../example');

// todo
test('forward inner page', done => {
  request(server)
    .get('/forward/inner')
    .expect(200, /热门评论/, done);
});
// todo
test('forward outer page', done => {
  request(server)
    .get('/forward/outer')
    .expect(200, /百度一下/, done);
});
// todo
test('forward to self', done => {
  request(server)
    .get('/forward/self')
    .expect(500, done);
});

test('forward in interceptor', done => {
  request(server)
    .get('/interceptor/forward/comment/list')
    .expect(200, /热门评论/, done);
});

test('router.forward is string', done => {
  request(server)
    .get('/router/forward/string')
    .expect(200, /热门评论/, done);

});

test('router.forward is function', done => {
  request(server)
    .get('/router/forward/function')
    .expect(200, /热门评论/, done);
});
