const request = require('supertest');
const { app } = require('../../example');

test('only view render', done => {
  request(app.callback())
    .get('/auto-render')
    .expect(200, /auto-render/, done);
});