module.exports = {
  '/post': {
    'post': {
      handle(data, req, res) {
        res.send(`post body: ${req.body.age}`);
      }
    }
  },
  '/post/param': {
    'post': {
      'api': 'http://localhost:8080/post/param/helper',
      body(req) {
        return {
          'name': 'bodhi',
          'age': req.body.age
        };
      },
      handle(data, req, res) {
        const helper = data.getValue('helper', {});
        res.send(`name: ${helper.name}, age: ${helper.age}`);
      }
    }
  },
  '/post/param/helper': {
    'post': {
      handle(data, req, res) {
        res.json(req.body);
      }
    }
  },
  '/api/is/array': {
    'get': {
      'api': ['http://localhost:8080/api/is/function', {
        'api': 'http://localhost:8080/config/is/function'
      }, function api() {
        return 'http://localhost:8080/hello';
      }, function apiReturnNull() {
        return null;
      }],
      handle(data, req, res) {
        res.send('api-is-array');
      }
    }
  },
  '/api/is/function': {
    'get': {
      api() {
        this.view = 'api-is-function';
        return null;
      }
    }
  },
  '/config/is/function': {
    get() {
      return {
        api() {
          this.view = 'api-is-function';
          return null;
        }
      };
    }
  },
  '/render-index-view': {
    'get': {
      'view': 'render-index'
    }
  },
  '/render-with-swig': {
    'get': {
      'view': 'other-engine.swig'
    }
  },
  '/conflicted/:name': {
    'get': {
      handle(data, req, res) {
        return res.send(`dynamic ${req.param.name}`);
      }
    }
  },
  '/conflicted/literals': {
    'get': {
      handle(data, req, res) {
        return res.send('fixed literals');
      }
    }
  },
  '/series-apis/get-data-from-prev': {
    'get': {
      api: [
        {
          api: 'http://localhost:8080/backend/names',
          series: true
        },
        {
          api: 'http://localhost:8080/backend/comments',
          query(req, res) {
            req.queryCanGetNames = !!res.apiData.names.length;
          },
          body(req, res) {
            req.bodyCanGetNames = !!res.apiData.names.length;
          }
        }
      ],
      handle(data, req, res) {
        const canGetName = req.queryCanGetNames
            && req.bodyCanGetNames;

        res.send(canGetName);
      }
    }
  },
  '/series-apis/get-data-from-prev2': {
    'get': {
      api: req1 => {
        const series = req1.query.series;

        return [
          {
            api: 'http://localhost:8080/backend/names',
            series
          },
          {
            api: 'http://localhost:8080/backend/comments',
            query(req, res) {
              req.queryCanGetNames = !!res.apiData.getList('names').length;
            },
            body(req, res) {
              req.bodyCanGetNames = !!res.apiData.getList('names').length;
            }
          }
        ];
      },
      handle(data, req, res) {
        const canGetName = req.queryCanGetNames
            || req.bodyCanGetNames;

        res.send(canGetName);
      }
    }
  },
  '/series-apis/get-data-from-prev3': {
    'get': {
      api: req1 => {
        const series = req1.query.series;

        return [
          {
            api: 'http://localhost:8080/backend/names',
            series
          },
          (req2, res2) => {
            if (res2.apiData.getList('names').length) {
              return {
                api: 'http://localhost:8080/backend/comments',
                query(req) {
                  req.queryCanGetNames = true;
                },
                body(req) {
                  req.bodyCanGetNames = true;
                }
              };
            }

            return null;
          }
        ];
      },
      handle(data, req, res) {
        const canGetName = req.queryCanGetNames
            && req.bodyCanGetNames;

        res.send(!!canGetName);
      }
    }
  },
  '/test/will/api-timeout': {
    'get': {
      api: 'http://www.baidu.com',
      name: 'baidu',
      timeout: 1,
      handle(data, req, res) {
        res.status(data.baidu.code).send('timeout');
      }
    }
  },
  '/test/willnot/api-timeout': {
    'get': {
      api: 'http://www.baidu.com',
      name: 'baidu',
      timeout: 100000000,
      handle(data, req, res) {
        res.send(data.baidu);
      }
    }
  }
};
