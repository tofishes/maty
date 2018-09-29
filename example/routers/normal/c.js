const log = require('t-log');
const commentList = require('../../data/comment-list.json');

module.exports = {
  '/hello': {
    'get': (req, res) => {
      log.debug('query:', req.query, req.body, req.param);
      res.send('hello world');
      return false;
    }
  },
  '/marko': {
    'get': {
      view: 'marko.marko'
    }
  },
  '/redirect': {
    'get': {
      handle(data, req, res) {
        res.redirect('www.baidu.com');
      }
    }
  },
  '/proxy': {
    'get': {
      'api': 'http://www.baidu.com',
      'proxy': true
    }
  },
  '/api/comment/list': {
    'get': {
      handle(data, req, res) {
        res.json(commentList);
      }
    }
  },
  '/proxy/api/comment/list': {
    'get': {
      'api': '/api/comment/list',
      'proxy': true
    }
  },
  '/xhr/comment/list': {
    'get': {
      'api': 'http://localhost:8080/api/comment/list'
    }
  },
  '/comment/list': {
    'get': {
      'api': [
        {
          'api': 'get:/api/comment/list',
          'name': 'comments',
          'cache': true,
          query() {
            return {
              'pageSize': 20,
              'sort': 1,
              'isNewDetail': 1,
              'itemId': '1jzbype',
              'type': 1
            };
          },
          handle(data) {
            return data.getList('data.list');
          }
        }
      ],
      'timeout': 1000,
      'pageCache': false,
      handle(data) {
        this.view = 'comments';
        return data;
      }
    }
  },
  '/test/intercept/series/comments': {
    'get': {
      handle(data, req, res) {
        res.send(!!data.getList('comments.data.list').length);
      }
    }
  },
  '/test/intercept/ajax': {
    'get': {
      handle(data, req, res) {
        res.send(data.getMap('xhr.intercept'));
      }
    }
  },
  '/mixed/api-config': {
    'get': {
      api() {
        return ['http://localhost:8080/test/intercept/series/comments',
          {
            api: 'http://localhost:8080/comment/list',
            name: 'commentPage'
          },
          () => ({
            api: 'http://localhost:8080/api/comment/list',
            name: 'commentJson'
          })
        ];
      },
      name: 'real',
      handle(data, req, res) {
        const result = data.real && data.commentJson && data.commentPage;
        res.send(!!result);
      }
    }
  },
  '/api/date': {
    'get': {
      handle(data, req, res) {
        res.status(req.query.statusCode || 200).send(`${Date.now()}`);
      }
    }
  },
  '/test/cache/expires': {
    'get': {
      'api': 'http://localhost:8080/api/date',
      'cache': 300,
      handle(data, req, res) {
        res.send(`${data.date}`);
      }
    }
  },
  '/ext/engine/is/not/register': {
    get: {
      view: 'no-this.engine'
    }
  }
};
