// 用es5的方式得到伪数组对应的真数组
const obj = {
  0: 'apple',
  1: 'peach',
  2: 'banana',
  3: 'melon',
  length: 4
};

const objArr = Array.prototype.slice.call(obj);
console.log(objArr);

// 重要结论：方法内部的this只有在调用时才可以确定 其他无论任何时候都无法确定
// Function.prototype.call(对象,args1,args2,...)&Function.prototype.apply(对象,[args1,args2,...]) 调用方法并且改变方法内部的this的指向
// Function.prototype.bind(对象,args1,args2,...) 并不是立即执行该方法而是返回一个新的方法

const fn = {
  f1(x, y, z) {
    console.log('fn.f1():', x, y, z, this)
  },
  f2: {
    f1(x, y, z) {
      console.log('fn.f2.f1():', x, y, z, this)
    }
  }
};
fn.f1(1, 2, 3);
fn.f2.f1(1, 2, 3);

fn.f1.call({}, 1, 2, 3);
fn.f2.f1.call({}, 1, 2, 3);

fn.f1.apply([], [1, 2, 3]);
fn.f2.f1.apply([], [1, 2, 3]);


