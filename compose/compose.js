/**
 *
 * @param {...Function} funcs
 * @returns {*|(function(...[*]): *)|(function(*): *)}
 */
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  //a:prevValue累计值,b:item当前值 prevValue也是一个函数
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
