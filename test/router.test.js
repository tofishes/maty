const request = require('supertest');

const { server, stage } = require('../example');
const comments = require('../example/data/comment-list.json');
const names = require('../example/data/name-list.json');

test('router 405 not support method', done => {
  request(server)
    .post('/comment/list')
    .expect(405, done);
});

test('router.api can be function', done => {
  request(server)
    .post('/router.api/is/function')
    .expect(200, /api-is-function/ ,done);
});

test('router.view can be function', done => {
  request(server)
    .post('/router.view/is/function')
    .expect(200, /view-is-function/ ,done);
});

test('router.view config', done => {
  request(server)
    .post('/router.view/is/string')
    .expect(200, /view-is-string/ ,done);
});

test('router.view default to request path', done => {
  request(server)
    .post('/view-is-default-as-path')
    .expect(200, `view-is-default-as-path-${comments.length}` ,done);
});

test('router.cache valid', done => {
  const client = request(app);

  client.get('/router.cache/expires')
    .end((err, res) => {
      const fisrtData = res.text;

      client.get('/router.cache/expires')
        .expect(fisrtData, done);
    });
});

test('router.cache expired', done => {
  const client = request(app);

  client.get('/router.cache/expires')
    .end((err, res) => {
      const fisrtData = res.text;

      setTimeout(() => {
        client.get('/router.cache/expires')
          .expect(res2 => {
            if (res2.text === fisrtData) {
              throw new Error('cache is not expected expires');
            }
          })
          .end(done);
      }, 600);
    });
});

test('router.cache can be function', done => {
  const client = request(app);

  client.get('/router.cache/expires/300')
    .end((err, res) => {
      const fisrtData = res.text;

      client.get('/router.cache/expires/300')
        .expect(fisrtData, done);
    });
});

test('router.handle use ctx.forward', done => {
  request(server)
    .post('/router.handle/use/ctx.forward')
    .expect(200, 'hello world', done);
});

test('router.api use ctx.forward', done => {
  request(server)
    .post('/router.api/use/ctx.forward')
    .expect(200, 'hello world', done);
});

test('router.view use ctx.forward', done => {
  request(server)
    .post('/router.view/use/ctx.forward')
    .expect(200, 'hello world', done);
});

test('router.api is Array', done => {
  request(server)
    .post('/router.api/is/array')
    .expect(200, `comments-size-${comments.length}-and-names-size-${ names.length }` ,done);
});

test('router.api is Array and series', done => {
  request(server)
    .post('/router.api/is/series')
    .expect(200, `comments-size-${comments.length}-and-names-size-${ names.length }` ,done);
});

test('router.timeout', done => {
  request(server)
    .post('/router.timeout')
    .expect(504, 'timeout', done)
});
