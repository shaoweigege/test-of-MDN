// 实现对一个对象的值的getter和setter的深度监听
function deepObserveObject(obj) {
  // 判断是否有参数并且参数是否为object类型
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach(key => {
    // 判断key属性对应的值是普通类型还是对象类型
    if (typeof obj[key] === 'object') {
      // obj[key]是对象类型 递归调用函数本身
      deepObserveObject(obj[key])
    } else {
      // obj[key]是普通类型
      // 先定义变量保存obj[key]的值(在定义getter和setter监听前保存该值是不会触发getter和setter监听的--->非常重要)
      let value = obj[key];
      Object.defineProperty(obj, key, {
        get() {
          console.log('获取' + key + '属性');
          return value
        },
        set(newValue) {
          console.log(key + '属性发生变化');
          value = newValue
        }
      })
    }
  })
}
