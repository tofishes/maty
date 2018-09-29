module.exports = {
  '/upload': {
    post(req, res) {
      return res.json(req.body);
    },
    'get': {
      view: 'upload'
    }
  }
};
