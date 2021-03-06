# maty.js

  [![Build Status][build-image]][build-url]
  [![Test coverage][coveralls-image]][coveralls-url]
  [![Dependencies][deps-image]][deps-url]
  [![GitHub license][license-image]][license-url]

maty是一个基于Koa的使用简单且友好的页面渲染服务框架。

maty使用双洋葱圈模型，配置好路由信息（接口地址及数据处理方法等），即可方便的搭建一个项目服务。

### Features 功能

* Router config 简单配置即可实现接口数据的获取及页面渲染，甚至接口代理等
* Filters request/response 过滤器，可以自定义请求的处理和响应，扩展功能
* Interceptors 拦截器，可用作公共请求处理等
* ctx.forward 服务器端跳转，例如同一个路由地址，可以根据不同的参数转到不同的页面
* emplate engine 默认使用nunjucks模板引擎，支持多引擎同时使用
* Auto render 在无路由配置的情况下，自动渲染和请求路径一致的模板文件

### Installation 安装

`$ npm install maty`

Node.js >= v10.0.0 required.

### Quick Start 开始使用

app.js

```
const maty = require('maty');

const app = maty();
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

更详细的使用方法参见文档。

### Docs 文档

[maty doument](https://tofishes.gitbook.io/maty-js/)

### Examples 例子

```
$ git clone https://github.com/tofishes/maty.git
$ cd maty/example
```

### Next Version Experiment API

* app.router(route, config) 运行时添加路由配置
* uploadDir 配置为false时不自动创建文件夹

### License

[Apache-2.0](https://github.com/tofishes/maty/blob/master/LICENSE)

[build-image]: https://travis-ci.org/tofishes/maty.svg?branch=master
[build-url]: http://travis-ci.org/tofishes/maty
[coveralls-image]: https://codecov.io/gh/tofishes/maty/branch/master/graph/badge.svg
[coveralls-url]: https://codecov.io/github/tofishes/maty?branch=master
[deps-image]: https://david-dm.org/tofishes/maty.svg
[deps-url]: https://david-dm.org/tofishes/maty
[license-image]: https://img.shields.io/github/license/tofishes/maty.svg
[license-url]: https://github.com/tofishes/maty/blob/master/LICENSE