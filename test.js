const koa = require('koa');

const app = new koa();

Reflect.defineProperty(app.context, 'isEnd', {
  get() {
    console.log(this.body, '**')
    return this.body !== undefined;
  }
});

app.use((ctx, next) => {
  console.log(ctx.isEnd, '--', ctx.path);

  ctx.body = 'ok';

  console.log(ctx.isEnd, '==');
});

app.listen(9999)
