const exec = require('child_process').exec;
const request = require('supertest');
const { app } = require('../example');

test('ctx.param', done => {
  request(app.callback())
    .get('/ctx-extend/param/123')
    .expect(200, /123/, done)
});

test('ctx.query', done => {
  request(app.callback())
    .get('/ctx-extend/query/123')
    .expect(200, /123/, done)
});

test('ctx.reqBody', done => {
  request(app.callback())
    .post('/ctx-extend/reqbody/123')
    .send({ name: 'hi' })
    .expect(200, '123: hi', done)
});

test('ctx.request.files', done => {
  request(app.callback())
    .post('/ctx-extend/files')
    .field('type', 'upload')
    .attach('avatar', `${__dirname}/avatar.jpg`)
    .expect(res => {
      const body = JSON.parse(res.text);
      const avatar = body.avatar;

      expect(avatar.name).toBe('avatar.jpg');
      expect(avatar.path).toMatch(/\.jpg/i);

      // clean
      exec(`rm -rf ${app.get('uploadDir')}`);
    })
    .end(done);
});

test('ctx.ua', done => {
  const chrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36';

  request(app.callback())
    .get('/ctx-extend/ua')
    .set('User-Agent', chrome)
    .expect(200, 'os-Mac OS|browser-Chrome', done)
});

test('ctx.moduleName', done => {
  request(app.callback())
    .get('/ctx-extend/module/sub')
    .expect(200, 'ctx-extend', done)
});

test('ctx.pathes', done => {
  request(app.callback())
    .get('/ctx-extend/second/three')
    .expect(200, 'ctx-extend,second,three', done)
});

test('ctx.xhr', done => {
  request(app.callback())
    .get('/ctx-extend/xhr')
    .set('X-Requested-With', 'XMLHttpRequest')
    .expect(200, 'true', done)
});
