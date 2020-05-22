## Vue的源码学习

#### Vue实现双向数据绑定的方式是：数据劫持结合发布者-订阅者模式的方式

#### Object.defineProperty()函数中设置getter/setter监听 在数据变动时发布消息给订阅者 触发相应的监听回调

#### Vue中三个重要的概念：
>1.Compile(解析指令以及绑定的属性和事件处理函数) 

>2.Observer(监听数据的改变 一旦有数据改变则通知订阅者) 

>3.Watcher(相当于是事件的订阅者 接收到通知然后做出相应的处理(更新界面&事件回调))

#### 1.实现Observer
>注意点：如果对象的属性也是对象 那么该属性对象中的属性也需要添加getter&setter(需要递归的去添加getter&setter)
```js
import PubSub from 'pub-sub';
const VALUE_CHANGE = 'Value_Change';
//要求：给data的所有的属性都添加getter&setter
const data = {
  title:'日程表',
  todoList:[
      {id:1001,name:'吃饭',completed:false},
      {id:1002,name:'睡觉',completed:true},
      {id:1003,name:'打豆豆',completed:false},
      {id:1004,name:'夏威夷',completed:false},
      {id:1005,name:'钓鱼',completed:true},
  ],
  user:{
    name:'林志玲',
    age:34,
    isMarried:false
  }
};

function deepObserveObject(obj) {
  if(!obj||typeof obj !=='object') return;
  Object.keys(obj).forEach(key=>{
    if(typeof obj[key] === 'object'){
      deepObserveObject(obj[key])
    }else{
      // 在添加getter&setter属性监听器之前先获取属性的值
      let value = obj[key];
      Object.defineProperty(obj,key,{
        get(){
          console.log('获取'+key+'属性');
          return value;
        },
        set(newValue){
          console.log(key+'属性发生变化');
          value = newValue
        }
      })
    }
  })
}
```

