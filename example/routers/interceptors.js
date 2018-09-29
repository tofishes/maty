module.exports = {
  '/intercept/series/api-func-get-data': {
    'get': {
      api(req, res) {
        if (res.apiData.interceptorData) {
          return 'http://localhost:8080/api/test/data2';
        }

        return 'http://localhost:8080/api/test/data1';
      },
      name: 'series',
      handle(data, req, res) {
        return res.status(200).send(data.getValue('series.name', 'wrong'));
      }
    }
  },
  '/api/test/data1': {
    'get': {
      handle(data, req, res) {
        res.json({ name: 'one' });
      }
    }
  },
  '/api/test/data2': {
    'get': {
      handle(data, req, res) {
        res.json({ name: 'two' });
      }
    }
  },
  '/intercept/by-config': {
    'get': {
      handle(data, req, res) {
        res.send('not intercept');
      }
    }
  }
};
