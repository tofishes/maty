# maty.js
一个使用简单且友好的页面渲染服务框架

#### 默认cache使用lru-cache[https://github.com/isaacs/node-lru-cache]

### todos
* task run 模式修订，在api请求完成后一次handle并组合结果，使用原生方法处理并行or串行

### note
* marko template engine可接入，但无法通过jest测试，jest会对marko require template-file的语法做内容处理，而内容处理这一步会报错，查看jest源码，发现无法绕过
