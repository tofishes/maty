module.exports = {
  '/hello/*': {
    'get': {
      handle(data, req, res) {
        res.send(req.pathname);
      }
    }
  },
  '/comments': {
    'get': {
      api: 'http://localhost:8080/api/comment/list',
      handle(data) {
        console.log(data, '++++')
        return data;
      },
      view: 'b-plan/comments'
    }
  }
};
