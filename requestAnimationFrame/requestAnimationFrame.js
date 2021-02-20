/*
* 兼容浏览器的函数:如果浏览器不支持requestAnimationFrame则使用setTimeout做兼容处理
* */
let requestAnimationFrame = window.requestAnimationFrame || (callback => {
  return setTimeout(callback, 16)
})
