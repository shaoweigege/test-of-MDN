//权威版本
(function (window) {
  //Promise构造函数
  function Promise(executor) {
    const self = this;
    //定义实例的属性
    self.status = 'pending';
    self.data = undefined;
    self.callbacks = [];

    //实现resolve和reject函数
    function resolve(value) {
      //判断当前的Promise实例状态是否已经发生过变化
      if (self.status !== 'pending') return;
      //改变此时Promise实例的状态和值
      self.status = 'resolved';
      self.data = value;
      //立即异步调用self.callbacks数组中所有的成功的回调
      setTimeout(() => {
        self.callbacks.forEach(callbackObj => {
          callbackObj.onResolve(value)
        })
      }, 0)
    }

    function reject(reason) {
      //判断当前的Promise实例状态是否已经发生过变化
      if (self.status !== 'pending') return;
      //改变此时Promise实例的状态和值
      self.status = 'rejected';
      self.data = reason;
      //立即异步调用self.callbacks数组中所有的失败的回调
      setTimeout(() => {
        self.callbacks.forEach(callbackObj => {
          callbackObj.onReject(reason)
        })
      }, 0)
    }

    //立即执行构造器中的执行器函数
    try {
      executor(resolve, reject)
    } catch (e) {
      //如果执行器函数抛出异常 那么直接将Promise的状态变为失败状态
      reject(e)
    }
  }

  //Promise.prototype.then()方法
  Promise.prototype.then = function (onResolve, onReject) {
    //防止传入的参数不符合规范
    onResolve = typeof onResolve === 'function' ? onResolve : value => value;
    onReject = typeof onReject === 'function' ? onReject : reason => {
      throw reason
    };
    const self = this;
    //返回一个新的Promise实例对象
    return new Promise((resolve, reject) => {
      /*
      * 此时Promise实例的状态可能有三种情况
      * 1.pending状态 将onResolve,onReject添加到self.callbacks数组中
      * 2.resolved状态 立即同步执行onResolve函数
      * 3.rejected状态 立即同步执行onReject函数
      *
      * onResolve&onReject函数执行也有三种情况
      * 1.抛出异常 那么then()方法的返回值Promise对象就是失败状态 失败的原因就是onResolve&onReject函数执行抛出的异常
      * 2.返回值是Promise类型的对象 那么then()方法的返回值Promise对象的状态和值就取决于onResolve&onReject函数执行的返回值的状态和值
      * 3.返回值是普通类型的值 那么 那么then()方法的返回值Promise对象就是成功的状态 成功的值就是onResolve&onReject函数执行的返回值
      * */
      if (self.status === 'pending') {
        //将对应的成功和失败的回调函数添加到self.callbacks数组中(同步执行)
        self.callbacks.push({
          onResolve() {
            try {
              const result = onResolve(self.data);
              if (result instanceof Promise) {
                result.then(
                    value => {
                      resolve(value)
                    },
                    reason => {
                      reject(reason)
                    }
                )
              } else {
                resolve(result)
              }
            } catch (e) {
              reject(e)
            }
          },
          onReject() {
            try {
              const result = onReject(self.data);
              if (result instanceof Promise) {
                result.then(
                    value => {
                      resolve(value)
                    },
                    reason => {
                      reject(reason)
                    }
                )
              } else {
                resolve(result)
              }
            } catch (e) {
              reject(e)
            }
          },
        })
      } else if (self.status === 'resolved') {
        try {
          const result = onResolve(self.data);
          if (result instanceof Promise) {
            result.then(
                value => {
                  resolve(value)
                },
                reason => {
                  reject(reason)
                }
            )
          } else {
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      } else if (self.status === 'rejected') {
        try {
          const result = onReject(self.data);
          if (result instanceof Promise) {
            result.then(
                value => {
                  resolve(value)
                },
                reason => {
                  reject(reason)
                }
            )
          } else {
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      }
    })
  };

  //Promise.prototype.catch()方法
  Promise.prototype.catch = function (onReject) {
    this.then(undefined, onReject)
  };

  //Promise.resolve()方法
  Promise.resolve = function (value) {
    /*
    * value的值可能有两种情况
    * 1.value是Promise类型的值 那么Promise.resolve()
    * */
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
            value => {
              resolve(value)
            },
            reason => {
              reject(reason)
            }
        )
      } else {
        resolve(value)
      }
    })
  };

  //Promise.reject()方法
  Promise.reject = function (reason) {
    //直接返回一个失败状态的Promise对象 不管reason传递的是普通类型的值还是Promise类型的值
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  };

  //Promise.all()方法
  Promise.all = function (promises) {
    //返回一个Promise类型的对象
    return new Promise((resolve, reject) => {
      //定义保存成功的值的数组
      const values = new Array(promises.length);
      //定义计数器
      let i = 0;
      //遍历promises数组
      promises.forEach((promise, index) => {
        Promise.then(promise).then(
            value => {
              values[index] = value;
              i++;
              if (i === promises.length) {
                //此时说明promises数组中全是成功的promise对象
                resolve(values)
              }
            },
            reason => {
              //只要有一个是失败状态的Promise对象 那么返回的值就是失败状态 并且失败的原因就是这个Promise对象失败的原因
              reject(reason)
            }
        )
      })
    })
  };

  //Promise.race()方法
  Promise.race = function (promises) {
    //返回Promise类型的对象
    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        Promise.then(promise).then(
            value => {
              //只处理第一个发生状态变化的promise对象
              resolve(value)
            },
            reason => {
              reject(reason)
            }
        )
      })
    })
  };

  //将Promise构造函数挂载到window对象上
  window.Promise = Promise;
})(window);
