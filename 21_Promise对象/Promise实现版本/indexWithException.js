/*自己实现Promise 处理异常*/
(function (window) {
  function Promise(executor) {
    const self = this
    self.status = 'pending'
    self.data = undefined
    self.callbacks = []

    const resolve = value => {
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        setTimeout(() => {
          self.callbacks.forEach(callbackObj => {
            callbackObj.onResolve(value)
          })
        }, 0)
      }
    }

    const reject = reason => {
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        setTimeout(() => {
          self.callbacks.forEach(callbackObj => {
            callbackObj.onReject(reason)
          })
        }, 0)
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      //如果发生异常 直接返回失败状态的实例
      reject(e)
    }
  }

  Promise.prototype.then = (onResolve, onReject) => {
    //要防止传入的不是函数对象
    onResolve = typeof onResolve === 'function' ? onResolve : value => value
    onReject = typeof onReject === 'function' ? onReject : reason => {
      throw reason
    }
    const self = this
    return new Promise((resolve, reject) => {
      if (self.status === 'pending') {
        self.callbacks.push({
          onResolve(value) {
            try {
              const result = onResolve(value)
              if (result instanceof Promise) {
                result.then(resolve, reject)
              } else {
                resolve(result)
              }
            } catch (e) {
              reject(e)
            }
          },
          onReject(reason) {
            try {
              const result = onReject(reason)
              if (result instanceof Promise) {
                result.then(resolve, reject)
              } else {
                reject(result)
              }
            } catch (e) {
              reject(e)
            }
          }
        })
      } else if (self.status === 'resolved') {
        self.callbacks.forEach(callbackObj => {
          try {
            const result = callbackObj.onResolve(self.data)
            if (result instanceof Promise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (e) {
            reject(e)
          }
        })
      } else if (self.status === 'rejected') {
        self.callbacks.forEach(callbackObj => {
          try {
            const result = callbackObj.onReject(self.data)
            if (result instanceof Promise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (e) {
            reject(e)
          }
        })
      }
    })
  }

  Promise.prototype.catch = onReject => {
    onReject = typeof onReject === 'function' ? onReject : reason => {
      throw reason
    }
    this.onResolve(undefined, onReject)
  }

  Promise.resolve = value => {
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
      if (reason instanceof Promise) {
        reason.then(reject, reject)
      } else {
        reject(reason)
      }
    })
  }

  Promise.all = promises => {
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
      promises.forEach(promise => {
        Promise.resolve(promise).then(resolve, reject)
      })
    })
  }

  window.Promise = Promise
})(window)
