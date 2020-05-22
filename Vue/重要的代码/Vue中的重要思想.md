### Vue中的重要思想的理解

#### 1.数据代理
>1.用vm对象来代理data对象的读和写
    效果:操作data的属性可以直接用this.xxx而不用this.data.xxx了
```js
function Vue(options) {
  const self = this;
  self._data = options.data && options.data;
  // 给vm实例添加与data对象所有属性对应的属性的getter和setter
  Object.keys(self._data).forEach(key=>{
    Object.defineProperty(self,key,{
      get(){
        return self._data[key];
      },
      set(newValue){
        self._data[key] = newValue;
      }
    })
  })
}
```

#### 2.数据绑定
>1.数据绑定是一种效果:更新了data中的属性的值 那么页面中直接或者间接使用了该属性的地方都会自动更新

#### 3.数据劫持
>1.通过数据劫持来实现数据绑定的效果
    原理:给data中的所有层级的属性添加getter和setter属性监视器 一旦检测到setter那么立即去更新界面的显示

>2.流程:调用this.message = 'new message';
    ①先触发vm.message的setter监听 进行相应的处理:self._data['message'] = 'new message';   
    ②然后又恰好触发了vm.data.message的setter监听 进行相应的处理:保存缓存的值并且更新界面
```js
function Vue(options) {
  const self = this;
  self._data = options.data && options.data;
  // 给vm实例添加与data对象所有属性对应的属性的getter和setter
  Object.keys(self._data).forEach(key=>{
    Object.defineProperty(self,key,{
      get(){
        return self._data[key];
      },
      set(newValue){
        self._data[key] = newValue;
      }
    })
  });
  
  //给data所有层级的属性都添加getter和setter监听器
  //自定义对一个对象的所有层级的属性做深度的监听
  function deepObserveObject(obj) {
    if(!obj||typeof obj!=='object') return;
    Object.keys(obj).forEach(key=>{
      //判断obj[key]是普通类型还是对象类型
      if(typeof obj[key] === 'object'){
        deepObserveObject(obj[key])
      }else{
        //普通类型的值
        //先保存该值
        let value = obj[key];
        Object.defineProperty(obj,key,{
          get(){
            return value;
          },
          set(newValue){
            value = newValue;
            //并且做相应的页面更新...
          }
        })
      }
    })
  }
  deepObserveObject(self._data);
}
```

