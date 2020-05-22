//Vue的插件本质就是一个包含install方法的对象
//install 方法接收两个参数,第一个是Vue对象,第二个是配置对象
export default {
  install(Vue, options) {
    //1.添加实例方法
    Vue.prototype.$myMethod = function () {
      console.log('这是自定义插件的实例方法');
    };

    //2.添加自定义指令
    Vue.directive = function (el, binding) {
      //do something...
    };

    //3.添加全局方法
    Vue.myGlobalMethod = function () {
      console.log('这是自定义插件的全局方法');
    };
  }
}
