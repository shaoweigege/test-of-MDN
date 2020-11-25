/*自己实现Promise*/
(function (window) {
  function Promise(executor) {
    /*
    * Promise实例上有三个属性
    * 1.status状态  pending、resolved、rejected
    * 2.data成功的值value或者失败的原因 reason
    * 3.callbacks数组 对应的成功或者失败的回调函数数组
    * */
    this.status = 'pending'
    this.data = undefined
    this.callbacks = []

    /*
    * 实现resolve方法
    * 1.接受一个value作为参数 表示成功的值
    * 2.只在实例还是pending状态时才进行处理
    * 3.执行该方法立刻将实例的状态改为resolved(成功)
    * 4.异步执行callbacks数组中的所有成功的回调函数
    * */
    function resolve(value) {
      //只有pending状态的实例才进行处理
      if (this.status === 'pending') {
        //将状态改为resolved成功状态
        this.status = 'resolved'
        setTimeout(() => {
          this.callbacks.forEach(callbackObj => {
            callbackObj.onResolve(value)
          })
        }, 0)
      }
    }

    /*
      * 实现reject方法
      * 1.接受一个reason作为参数 表示失败的原因
      * 2.只在实例还是pending状态时才进行处理
      * 3.执行该方法立刻将实例的状态改为rejected(失败)
      * 4.异步执行callbacks数组中的所有失败的回调函数
      * */
    function reject(reason) {
      //只有pending状态的实例才进行处理
      if (this.status === 'pending') {
        //将状态改为resolved成功状态
        this.status = 'rejected'
        setTimeout(() => {
          this.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason)
          })
        }, 0)
      }
    }

    //立即同步执行executor函数
    executor(resolve, reject)
  }

  /*
  * Promise.prototype.then()方法接受两个参数 而且返回一个新的Promise实例
  * 1.onResolve成功的回调函数
  * 2.onReject失败的回调函数
  * */
  Promise.prototype.then = function (onResolve, onReject) {
    const self = this
    return new Promise((resolve, reject) => {
      /*
      * 判断此时此刻Promise实例的状态
      * 1.pending状态
      * 2.resolved状态
      * 3.rejected状态
      * */
      if (self.status === 'pending') {
        //立刻将onResolved和onRejected回调函数添加到self.callbacks数组中
        self.callbacks.push({
          onResolve(value) {
            const result = onResolve(value)
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
          },
          onReject(reason) {
            const result = onReject(reason)
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
          }
        })
      } else if (self.status === 'resolved') {
        //执行callbacks数组中成功的回调
        self.callbacks.forEach(callbackObj => {
          //要对回调函数的返回值做判断
          const result = callbackObj.onResolve(self.data)
          /*
          * result的可能情况
          * 1.返回值是undefined
          * 2.返回值是Promise类型的对象
          * 3.返回值是普通基本数据类型的对象
          * */
          if (result instanceof Promise) {
            /*
            * 还需要判断该实例是成功还是失败状态
            * */
            result.then(
                data => {
                  resolve(data)
                },
                reason => {
                  reject(reason)
                })
          } else {
            resolve(result)
          }
        })
      } else if (self.status === 'rejected') {
        //执行callbacks数组中失败的回调
        self.callbacks.forEach(callbackObj => {
          //要对回调函数的返回值做判断
          const result = callbackObj.onReject(self.data)
          /*
          * result的可能情况
          * 1.返回值是undefined
          * 2.返回值是Promise类型的对象
          * 3.返回值是普通基本数据类型的对象
          * */
          if (result instanceof Promise) {
            /*
            * 还需要判断该实例是成功还是失败状态
            * */
            result.then(
                data => {
                  resolve(data)
                },
                reason => {
                  reject(reason)
                }
            )
          } else {
            resolve(result)
          }
        })
      }
    })
  }

  //Promise.prototype.catch()方法
  Promise.prototype.catch = function (onReject) {
    this.then(undefined, onReject)
  }

  /*
  * Promise.all()方法
  * 接受一个由Promise实例组成的数组
  * 1.只有在所有Promise实例的状态都是resolved时才返回成功状态的Promise实例
  * 2.只要有一个Promise实例的状态变为rejected就返回失败状态的Promise实例
  * */
  Promise.all = function (promises) {
    //返回一个新的Promise实例
    return new Promise((resolve, reject) => {
      //创建数组用来记录每个promise的值或者某个promise失败的原因
      let values = []
      //遍历promises参数
      promises.forEach(promise => {
        promise.then(
            //进入成功的回调
            value => {
              //将成功的值放进values数组
              values.push(value)
              //判断数组的长度是否等于promises数组的长度
              if (values.length === promises.length) {
                //说明promises数组中全部都是成功状态的promise实例->就可以改变返回值的promise实例的状态了
                resolve(values)
              }
            },
            //进入失败的回调->立刻改变promise的状态为rejected
            reason => {
              reject(reason)
            }
        )
      })
    })
  }

  /*
  * Promise.race()方法
  * 1.接受一个由Promise实例组成的数组
  * 2.只处理第一个状态发生改变的Promise实例 并将返回的新的Promise实例的状态和对应的值与之相对应
  * */
  Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
            value => {
              resolve(value)
            },
            reason => {
              reject(reason)
            }
        )
      })
    })
  }

  /*
  * Promise.raceSuccess()
  * 1.接受由Promise实例组成的数组
  * 2.如果数组中有成功状态的promise 则认定第一个成功状态的实例为返回值
  * 3.如果全部为失败状态的promise 则返回失败状态的实例 失败的原因是所有promise实例失败原因组成的数组
  * */
  Promise.raceSuccess = function (promises) {
    return new Promise((resolve, reject) => {
      let reasons = []
      promises.forEach(promise => {
        promise.then(
            value => {
              resolve(value)
            },
            reason => {
              reasons.push(reason)
              if (reasons.length === promises.length) {
                reject(reasons)
              }
            }
        )
      })
    })
  }

  /*
  * Promise.allSettled()
  * 1.接受由Promise实例组成的数组
  * 2.在所有实例状态都改变后 返回一个对象元素的数组 对象用来表示每个promise实例的状态和值
  * */
  Promise.allSettled = function (promises) {
    let results = []
    promises.forEach(promise => {
      promise.then(
          value => {
            results.push({value, status: 'resolved'})
          },
          reason => {
            results.push({reason, status: 'rejected'})
          }
      )
    })
    return results
  }

  window.Promise = Promise
})
(window)
