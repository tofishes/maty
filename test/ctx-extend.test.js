const request = require('supertest');
const { server, stage } = require('../example');

test('param', done => {
  request(server)
    .get('/ctx-extend/param/123')
    .expect(200, /123/, done)
});

test('query', done => {
  request(server)
    .get('/ctx-extend/query/123')
    .expect(200, /123/, done)
});

test('reqBody', done => {
  request(server)
    .post('/ctx-extend/reqbody/123')
    .send({ name: 'hi' })
    .expect(200, '123: hi', done)
});

test('upload files', done => {
  request(app)
    .post('/ctx-extend/files')
    .field('type', 'upload')
    .attach('avatar', `${__dirname}/avatar.jpg`)
    .expect(res => {
      const body = res.body;
      if (body.type !== 'upload' || body.avatar.originalFilename !== 'avatar.jpg'
        || !~body.avatar.path.indexOf('/uploads')
        || !body.avatar.path.endsWith('.jpg')
      ) {
        throw new Error('upload failed');
      }

      // exec(`rm -rf ${process.cwd()}/uploads`);
    })
    .end(done);
});

test('ua', done => {
  const chrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36';

  request(server)
    .get('/ctx-extend/ua')
    .set('User-Agent', chrome)
    .expect(200, 'os-OS X|browser-Chrome', done)
});

test('moduleName', done => {
  request(server)
    .get('/ctx-extend/module/sub')
    .expect(200, 'module', done)
});

test('pathes', done => {
  request(server)
    .get('/ctx-extend/module/sub')
    .expect(200, 'module,sub', done)
});

test('xhr', done => {
  request(server)
    .get('/ctx-extend/xhr')
    .set('X-Requested-With', 'XMLHttpRequest')
    .expect(200, 'true', done)
});
