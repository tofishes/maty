const request = require('supertest');
const access = require('../utils/access');

const { app } = require('../example');
const comments = require('../example/data/comment-list.json');
const names = require('../example/data/name-list.json');

test('router 405 not support method', done => {
  request(app.callback())
    .post('/comment/list')
    .expect(405, done);
});

test('router.api can be function', done => {
  request(app.callback())
    .get('/router.api/is/function')
    .expect(200, /api-is-function/ ,done);
});

test('router.api can be object', done => {
  request(app.callback())
    .get('/router.api/is/object')
    .expect(200, /newUser/ ,done);
});

test('router.view can be function', done => {
  request(app.callback())
    .get('/router.view/is/function')
    .expect(200, /view-is-function/ ,done);
});

test('router.view config', done => {
  request(app.callback())
    .get('/router.view/is/config')
    .expect(200, /view-is-string/ ,done);
});

test('router.view default to request path', done => {
  request(app.callback())
    .get('/view-is-default-as-path')
    .expect(200, `view-is-default-as-path-${comments.data.list.length}` ,done);
});

test('router.cache valid', done => {
  const client = request(app.callback());

  client.get('/router.cache/expires')
    .end((err, res) => {
      const fisrtData = res.text;

      client.get('/router.cache/expires')
        .expect(fisrtData, done);
    });
});

test('router.cache expired', done => {
  const client = request(app.callback());

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
  const client = request(app.callback());

  client.get('/router.cache/expires/300')
    .end((err, res) => {
      const fisrtData = res.text;

      client.get('/router.cache/expires/300')
        .expect(fisrtData, done);
    });
});

test('router.handle use ctx.forward', done => {
  request(app.callback())
    .get('/router.handle/use/ctx.forward')
    .expect(200, 'hello world', done);
});

test('router.api use ctx.forward', done => {
  request(app.callback())
    .get('/router.api/use/ctx.forward')
    .expect(200, 'hello world', done);
});

test('router.api is Array', done => {
  request(app.callback())
    .get('/router.api/is/array')
    .expect(200, `comments-size-${comments.data.list.length}-and-names-size-${ names.length }` ,done);
});

test('router.api is Array and series', done => {
  request(app.callback())
    .get('/router.api/is/series')
    .expect(200, `comments-size-${comments.data.list.length}-and-names-size-${ names.length }` ,done);
});

test('router.timeout', done => {
  request(app.callback())
    .get('/router.timeout')
    .expect(504, /timeout/i, done)
});

test('router.proxy is string', done => {
  request(app.callback())
    .get('/router.proxy/string')
    .expect(200, /鞋子非常好，质量棒棒哒/, done);

});

test('router.proxy is function', done => {
  request(app.callback())
    .get('/router.proxy/function')
    .expect(200, /鞋子非常好，质量棒棒哒/, done);
});


test('router.proxy image', done => {
  request(app.callback())
    .get('/router.proxy/image')
    .expect(200, done);
});

test('router.api mixed types config', done => {
  request(app.callback())
    .get('/mixed/api/config')
    .expect(200, /^(?!.*undefined)/i, done);
})

test('router.api mixed types config', done => {
  request(app.callback())
    .get('/mixed/api/config?commentShow=1')
    .expect(200, /棒棒哒/, done);
})
