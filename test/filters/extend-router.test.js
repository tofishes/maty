const request = require('supertest');
const { app } = require('../../example');

test('filter extend router.defaultParam', done => {
  request(app.callback())
    .get('/router.defaultParam/halen/18')
    .expect(200, 'halen is 18 years old', done)
});

test('filter extend router.defaultParam', done => {
  request(app.callback())
    .get('/router.defaultParam/halen')
    .expect(200, 'halen is 20 years old', done)
});
