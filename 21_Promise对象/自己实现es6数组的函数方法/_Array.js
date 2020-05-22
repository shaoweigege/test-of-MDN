//自己实现Array.prototype.forEach()方法
Array.prototype._forEach = function (callback) {
  //callback函数接受三个参数：item,index,数组本身
  const self = this;
  for (let i = 0; i < self.length; i++) {
    callback(self[i], i, self)
  }
};

//自己实现Array.prototype.map()方法
Array.prototype._map = function (callback) {
  const self = this;
  //返回一个新的数组
  let array = [];
  for (let i = 0; i < self.length; i++) {
    const result = callback(self[i], i, self);
    //判断result是否是false的值
    if (result) {
      array.push(result)
    }
  }
  return array
};

//自己实现Array.prototype.filter()方法
Array.prototype._filter = function (callback) {
  const self = this;
  //返回一个新的数组
  let array = [];
  for (let i = 0; i < self.length; i++) {
    const flag = callback(self[i], i, self);
    //判断flag是否是true
    if (flag) {
      array.push(self[i])
    }
  }
  return array
};

//自己实现Array.prototype.some()方法
Array.prototype._some = function (callback) {
  //返回的是一个布尔值
  const self = this;
  let flag = false;
  for (let i = 0; i < self.length; i++) {
    flag = callback(self[i], i, self);
    if (flag) break
  }
  return flag
};

//自己实现Array.prototype.every()方法
Array.prototype._every = function (callback) {
  //返回一个布尔值
  const self = this;
  let flag = true;
  for (let i = 0; i < self.length; i++) {
    flag = callback(self[i], i, self);
    if (!flag) break
  }
  return flag
};

//自己实现Array.prototype.find()方法
Array.prototype._find = function (callback) {
  //如果站到了匹配的值就返回该值 否则返回false
  const self = this;
  let value;
  for (let i = 0; i < self.length; i++) {
    const flag = callback(self[i], i, self);
    if (flag) {
      value = self[i];
      break
    }
  }
  return value
};

//自己实现Array.prototype.findIndex()方法
Array.prototype._findIndex = function (callback) {
  //如果站到了匹配的值就返回该值 否则返回false
  const self = this;
  let index = -1;
  for (let i = 0; i < self.length; i++) {
    const flag = callback(self[i], i, self);
    if (flag) {
      index = i;
      break
    }
  }
  return index
};

//自己实现Array.prototype.reduce()方法
Array.prototype._reduce = function (callback, initValue) {
  //最终返回值是initValue(变化后的值)
  const self = this;
  for (let i = 0; i < self.length; i++) {
    initValue = callback(initValue, self[i])
  }
  return initValue
};

/**************************************/
Array.prototype.__forEach = function (callback) {
  const self = this
  for (let i = 0; i < self.length; i++) {
    callback(self[i], i, self)
  }
}

Array.prototype.__filter = function (callback) {
  //返回一个新的数组
  const arr = []
  const self = this
  for (let i = 0; i < self.length; i++) {
    if (callback(self[i], i, self)) {
      arr.push(self[i])
    }
  }
  return arr
}
