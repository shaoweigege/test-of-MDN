//防抖
const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    //清除掉上一次设置的定时器
    clearTimeout(timer)
    //重新创建新的定时器
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

//节流
const throttle = (fn, delay) => {
  let flag = true
  return (...args) => {
    if (flag) {
      flag = false
      setTimeout(() => {
        fn.apply(this, args)
        flag = true
      }, delay)
    }
  }
}

//call
Function.prototype._call = (context = window, ...args) => {
  context.fn = this
  let result = context.fn(args)
  delete context.fn
  return result
}

//apply
Function.prototype._apply = (context = window, args) => {
  context.fn = this
  let result = context.fn(...args)
  delete context.fn
  return result
}

//bind
Function.prototype._bind = (context = window, ...args) => {
  context.fn = this
  return () => {
    let result = context.fn(args)
    delete context.fn
    return result
  }
}



