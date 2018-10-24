# maty.js

### todos
* task run 模式修订，在api请求完成后一次handle并组合结果，使用原生方法处理并行or串行
handle可以是异步函数，涉及task的改造

* 是否去除handle的data参数，统一由ctx.apiData获取
  No, api返回的数据先一步进入handle方法，返回后赋值给ctx.apiData

### note
* marko template engine可接入，但无法通过jest测试，jest会对marko require template-file的语法做内容处理，而内容处理这一步会报错，查看jest源码，发现无法绕过