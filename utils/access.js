const fs = require('fs');

function access(filePath) {
  return new Promise(resolve => {
    fs.access(filePath, error => {
      resolve(error ? null : filePath);
    });
  });
}

module.exports = access;
