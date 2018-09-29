const request = require('request').defaults({
  pool: { maxSockets: 5000 }
});

const http = require("http");

const c = 500;
const api = 'http://localhost:8888';

const costs = [];
function doGet(i) {
  const start = Date.now();
  const index = i;
  // request.get(api, () => {
  //   const end = Date.now() - start;
  //   costs.push(`${index}: ${end}ms`);
  //   if (costs.length === c) {
  //       console.log(costs.join("\n"));
  //   }
  // });
  http.get(api, (res) => {
    res.on('end', () => {
      const end = Date.now() - start;
      console.log(`${index}: ${end}ms`);
    });
    res.resume();
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}

for (let i = 0; i < c; i++) {
  doGet(i);
}

// doGet();

