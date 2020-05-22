// 订阅发布机制
//初始化PubSub对象
let PubSub = {};

//初始化事件队列
PubSub.queue = {}; //queue队列保存在哪都可以

//订阅 事件名+回调函数
PubSub.subscribe = function (event, callback) {
  //先判断此时的事件队列中是否有此事件
  if (!PubSub.queue[event]) {
    PubSub.queue[event] = [];
  }
  // 用push()可以达到先订阅先收到消息的作用(先添加的回调函数先执行,后添加的回调函数后执行)
  PubSub.queue[event].push(callback)
};

//发布事件 事件名+传递的数据
PubSub.publish = function (event, data) {
  //触发回调队列中此事件名中所有的回调函数
  PubSub.queue[event].forEach(callback => {
    callback(data)
  })
};

