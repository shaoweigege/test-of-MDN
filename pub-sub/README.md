## 消息订阅和发布机制的理解

### 运行机制：发布者和订阅者并不直接产生联系 而是通过中介产生联系
>1.发布者发布一个信息 中介将该信息储存起来
>2.订阅者向中介去订阅一个信息 中介将受到的关于该信息的数据传递给订阅者
>优点：**这样可以降低发布者和订阅者之间的耦合度**

### 具体实现：
>1.发布者发布一个事件后 将该事件存储到一个事件队列中 然后事件队列这个中介负责通知订阅者
```js
/**
* 最终的使用模式：
* 发布事件：PubSub.pub('事件名',携带的数据);
* 订阅事件：PubSub.sub('事件名',function(携带的数据){
*   // do something ...
* });
* 退订事件：PubSub.unsub('事件名');
* */
let PubSub = {};
let queue = {};
//发布消息
//event:事件名 data:携带的数据
PubSub.sub = function(event,data) {
  if(!queue[event]){
    queue[event] = [];
  }
  queue[event].push({event,data});
}

//订阅消息
PubSub.sub = function(event,callback) {
  //找到queue对象中保存的与之匹配的事件和数据
  if(!queue[event]) return;
  //可能绑定了多个同名事件
  queue[event].forEach(item=>{
    callback(item.event,item.data);
  })
}

//退订消息
PubSub.unsub = function(event) {
  //直接置空存储该事件名的数组
  queue[event] = [];  
}
```

```js
//事件队列中保存的是订阅者的订阅事件名以及对应的事件处理函数 
//如果发布方发布的事件名在事件队列中 那么就去执行该事件名对应的事件处理函数
let PubSub = {};
let queue = {};
//订阅
PubSub.subscribe = function(eventName,callback) {
  //判断队列中是否已经存在该事件名
  if(!queue[eventName]){
    queue[eventName] = [];
  }
  queue[eventName].push(callback);
};

//退订(要根据回调函数来进行精确的退订)
PubSub.unSubscribe = function(eventName,callback) {
  //查找事件队列中是否有匹配的事件名和事件处理函数
  if(queue[eventName]&&queue[eventName].indexOf(callback)>-1){
    let index = queue[eventName].indexOf(callback);
    //删除该处理函数
    queue[eventName].splice(index,1);
  }
};

//发布
PubSub.publish = function(eventName) {
  //找到存储在事件队列中的对应事件名的处理函数
  if(queue[eventName]){
    queue[eventName].forEach(callback=>{
      callback();
    })
  }
};
```
