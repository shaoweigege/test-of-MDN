/*
* 防抖:防止抖动,频繁触发的事件,只在最后一次触发并且过了指定的时间后才去处理
* */
function debounce(fn, delay) {
  // 创建变量用来保存延时器的id
  let timer = null
  return function (...args) {
    // 进入函数后首先清除上一次创建的延时器id
    clearTimeout(timer)
    // 创建延时器
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
