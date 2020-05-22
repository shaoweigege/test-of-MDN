/*
* 默认向外暴露 createStore方法
* */

export function createStore(reducer) {
  /*
  * returns the `store` object
  *   1.store.dispatch(action)
  *   2.store.getState()
  *   3.store.subscribe(listener)
  * */

  let state = {}
  let listeners = []

  const dispatch = action => {
    state = reducer(action)
    //when state changes exec the listeners orderly
    listeners.forEach(listener => listener())
  }

  //returns the current(update) state
  const getState = () => {
    return state
  }

  //returns a function that is used to cancel the exact listener
  const subscribe = listener => {
    listeners.push(listener)
    let length = listeners.length
    return () => {
      //delete the exact listener
      listeners.splice(length, 1)
    }
  }

  return {dispatch, getState, subscribe}
}
