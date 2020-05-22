/*自己实现Promise 不处理异常*/
(function (window) {
  function Promise(executor) {
    const self = this
    self.status = 'pending'
    self.data = undefined
    self.callbacks = []

    const resolve = (value) => {
      if (self.status === 'pending') {
        self.status = 'resolved'
        setTimeout(() => {
          self.callbacks.forEach(callbackObj => {
            callbackObj.onResolve(value)
          })
        }, 0)
      }
    }

    const reject = (reason) => {
      if (self.status === 'pending') {
        self.status = 'rejected'
        setTimeout(() => {
          self.callbacks.forEach(callbackObj => {
            callbackObj.onReject(reason)
          })
        }, 0)
      }
    }

    executor(resolve, reject)
  }

  Promise.prototype.then = (onResolve, onReject) => {
    const self = this
    return new Promise((resolve, reject) => {
      if (self.status === 'pending') {
        self.callbacks.push({
          onResolve(value) {
            const result = onResolve(value)
            if (result instanceof Promise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          },
          onReject(reason) {
            const result = onReject(reason)
            if (result instanceof Promise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          }
        })
      } else if (self.status === 'resolved') {
        self.callbacks.forEach(callbackObj => {
          const result = callbackObj.onResolve(self.data)
          if (result instanceof Promise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        })
      } else if (self.status === 'rejected') {
        self.callbacks.forEach(callbackObj => {
          const result = callbackObj.onResolve(self.data)
          if (result instanceof Promise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        })
      }
    })
  }

  Promise.prototype.catch = onReject => {
    this.then(undefined, onReject)
  }

  Promise.resolve = value => {
    //value可能是普通的值->返回成功状态的对象 也可能是promise对象->返回对象的状态由他决定
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  Promise.reject = reason => {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  Promise.all = promises => {
    //创建一个一模一样长度的数组
    const values = new Array(promises.length)
    let i = 0
    return new Promise((resolve, reject) => {
      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
            value => {
              values[index] = value
              i++
              if (i === promises.length) {
                resolve(values)
              }
            },
            reason => {
              reject(reason)
            }
        )
      })
    })
  }

  Promise.race = promises => {
    return new Promise((resolve, reject) => {
      Promise.resolve(promises).then(resolve, reject)
    })
  }

  window.Promise = Promise
})(window)
