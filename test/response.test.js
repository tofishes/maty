const request = require('supertest');
const { app, stage } = require('../example');

test('response page disable cache', done => {
  request(app.callback())
    .get('/comment/list')
    .expect('Cache-Control', 'no-cache, no-store, must-revalidate', done);
});

test('response ajax disable cache', done => {
  stage.set('ajaxCache', false);

  request(app.callback())
    .get('/api/comments')
    .set('X-Requested-With', 'XMLHttpRequest')
    .expect('Cache-Control', 'no-cache, no-store, must-revalidate', done);
});