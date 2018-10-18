# maty.js

maty是一个基于koa的使用简单且友好的页面渲染服务框架。

maty使用双洋葱圈模型，使用者配置好路由信息（接口地址及数据处理方法等），即可方便的搭建一个项目服务。

### Installation 安装

`$ npm install maty`

### Features 功能
* Router config file 简单配置即可实现接口数据的获取及页面渲染，甚至接口代理等
* Filters request/response过滤器，可以自定义请求的处理和响应等
* Interceptors request拦截器，可用作公共请求处理等
* ctx.forward 服务器端跳转
* default template engine 默认使用nunjucks模板引擎，支持多引擎同时使用

### Quick Start 开始使用
app.js

```
const maty = require('../index');

const app = new maty();
const port = 8080;

app.listen(port, () => {
 const startInfo = `server run at http:\/\/localhost:${port}`;

 console.log(startInfo);
});
```

```
node app.js
```
### 默认目录结构

```
maty-project
├── interceptors
│   └── index.js
├── routers
│   ├── home.js
├── views
│   ├── home.njk
├── app.js
├── package.json
```

interceptors、routers、views目录可以在new maty()时自定义，filters可以自行管理

### Docs 文档

[maty doument](https://tofishes.gitbooks.io/maty/content/)

### Examples 例子

```
$ git clone https://github.com/tofishes/maty.git
$ cd maty/example
```

### License

[Apache-2.0](https://github.com/tofishes/maty/blob/master/LICENSE)
