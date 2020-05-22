(function (window) {
  function PubSub() {
    //订阅事件队列 成员：{name:'',callback:function}
    this.queue = []

  }

  //订阅事件的静态方法
  PubSub.subscribe = function (name, callback) {
    //查找this.queue数组中是否已经有此事件的订阅 如果有则移除旧的订阅 更新为此时此刻的订阅处理
    const index = this.queue.findIndex(eventObj => eventObj.name === name)
    if (index > -1) {
      //替换掉旧的数组元素 Array.prototype.splice(startIndex,replaceCount,replaceValue)
      this.queue.splice(index, 1, {name, callback})
    } else {
      //将此事件对应的处理添加进this.queue
      this.queue.push({name, callback})
    }
  }

  //解除订阅的静态方法
  PubSub.unSubscribe = function (name) {
    //查找this.queue中是否有同名的事件
    const index = this.queue.findIndex(eventObj => eventObj.name === name)
    //如果找到则移除该订阅
    if (index > -1) {
      this.queue.splice(index, 1)
    }
  }

  //发布事件的静态方法
  PubSub.publish = function (name, data) {
    //循环遍历执行this.queue中订阅的同名事件对应的回调函数
    this.queue.forEach(eventObj => {
      if (eventObj.name === name) {
        eventObj.callback(data)
      }
    })
  }
})(window);
