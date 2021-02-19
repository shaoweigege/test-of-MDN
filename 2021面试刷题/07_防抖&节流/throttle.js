/*
* 节流:频繁触发的事件,下一次事件处理必须间隔上次事件处理一定的时间才行
* */
function throttle(fn, delay) {
  let time = Date.now()
  return function (...args) {
    if (Date.now() - time >= delay) {
      fn.apply(this, args)
      time = Date.now()
    }
  }
}

function throttle1(fn, delay) {
  let flag = true
  return function (...args) {
    if (flag) {
      flag = false
      setTimeout(() => {
        fn.apply(this, args)
        flag = true
      }, delay)
    }
  }
}
