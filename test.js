const koa = require('koa');
const LRU = require("lru-cache")

const app = new koa();

const cache = LRU();

cache.set('a', 'a', 2000);
cache.set('b', 'b');
cache.set('c', 'c');

console.log(cache.get('a'));
console.log(cache.get('b'));
console.log(cache.get('c'));

setTimeout(() => {
  console.log(cache.get('a'));
}, 2500)

// Reflect.defineProperty(app.context, 'isEnd', {
//   get() {
//     console.log(this.body, '**')
//     return this.body !== undefined;
//   }
// });

// app.use((ctx, next) => {
//   console.log(ctx.isEnd, '--', ctx.path);

//   ctx.body = 'ok';

//   console.log(ctx.isEnd, '==');
// });

// app.listen(9999)
