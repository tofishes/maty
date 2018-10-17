const request = require('supertest');
const { app } = require('../example');

test('html render', done => {
  request(app.callback())
    .get('/comment/list')
    .expect('Content-Type', /html/)
    .expect(200, /鞋子非常好，质量棒棒哒/, done);
});

test('json render', done => {
  request(app.callback())
    .get('/api/comments')
    .expect('Content-Type', /json/)
    .expect(200, /鞋子非常好，质量棒棒哒/, done);
});

test('auto render them same file as request path', done => {
  request(app.callback())
    .get('/auto-render')
    .expect(200, 'auto-render by nunjucks', done);
});

test('default dir index page render', done => {
  request(app.callback())
    .get('/render-index')
    .expect(200, /this is auto render index file/, done);
});

test('exclude view dir', done => {
  request(app.callback())
    .get('/include/layout')
    .expect(404, done);
});

test('other render engines, ex. jade', done => {
  request(app.callback())
    .get('/engine/jade')
    .expect(200, /this is jade/i, done);
});

test('/404', done => {
  request(app.callback())
    .get('/404')
    .expect(404, done);
});

test('/302 redirect', done => {
  request(app.callback())
    .get('/redirect')
    .expect(302, done);
});

