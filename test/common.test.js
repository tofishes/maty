const request = require('supertest');
const { server, stage } = require('../example');

// todo
test('html render', done => {
  request(server)
    .get('/comment/list')
    .expect('Content-Type', /html/)
    .expect(200)
    .end(function(err, res) {
      console.log(res);
      done();
    });
});

test('json render', done => {
  request(server)
    .get('/api/comments')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      console.log(res);
      done();
    });
});

test('auto render them same file as request path', done => {
  request(server)
    .get('/auto-render')
    .expect(200, 'auto-render by nunjucks', done);
});

test('default dir index page render', done => {
  request(server)
    .get('/render-index')
    .expect(200, 'this is auto render index file', done);
});

test('exclude view dir', done => {
  request(server)
    .get('/include/layout')
    .expect(404, done);
});

test('other render engines, ex. marko', done => {
  request(server)
    .get('/engine/marko')
    .expect(200, 'use marko template engine', done);
});

test('/404', done => {
  request(server)
    .get('/404')
    .expect(404, done);
});

test('/302 redirect', done => {
  request(server)
    .get('/redirect')
    .expect(302, done);
});

