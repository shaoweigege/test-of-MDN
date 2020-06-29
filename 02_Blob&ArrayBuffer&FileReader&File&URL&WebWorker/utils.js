/**
 * 将字符串转换为对应的base64编码的字符串
 * @param {String} srcString
 * @returns {Promise}
 */
function str2base64(srcString) {
  return new Promise((resolve, reject) => {
    //0.如果传入的参数不是字符串 直接将参数转换为字符串
    if (typeof srcString !== 'string') {
      srcString = String(srcString)
    }
    //1.将利用字符串得到Blob对象
    let blob = new Blob([srcString])
    //2.创建FileReader对象
    let reader = new FileReader()
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsDataURL(blob)
  })
}

/**
 * 将js对象转换为base64格式的字符串
 * @param {Object} obj
 * @returns {Promise}
 */
function obj2base64(obj) {
  return new Promise((resolve, reject) => {
    //0.将参数转换为字符串
    try {
      let objStr = JSON.stringify(obj)
      //1.将利用字符串得到Blob对象
      let blob = new Blob([objStr])
      //2.创建FileReader对象
      let reader = new FileReader()
      reader.onload = function (e) {
        resolve(e.target.result)
      }
      reader.onerror = function (error) {
        reject(error)
      }
      reader.readAsDataURL(blob)
    } catch (e) {
      reject('参数不符合要求')
    }
  })
}

/**
 * 将base64格式的字符串转换为字符串
 * @param {String} base64
 * @returns {Promise}
 */
function base2str(base64) {
  return new Promise((resolve, reject) => {
    //1.先将base64格式的字符串拆分成数组 baseArray:['data','application/octet-stream','base64','字符串']
    let baseArray = base64.split(/[:;,]/)
    //2.判断参数是否是合法的base64格式
    if (baseArray[0] !== 'data' || baseArray[2] !== 'base64') return reject('传入的参数格式不合法')
    //3.确定mime类型
    let mime = baseArray[1]
    //4.判断base64字符串是不是由字符串编码得到的
    if (mime !== 'application/octet-stream') return reject('该base64字符串不是由字符串编码得到的')
    //5.正常情况
    let baseStr = atob(baseArray[3])
    //创建缓冲对象Uint8Array
    let buffer = new Uint8Array(baseStr.length)
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = baseStr.charCodeAt(i)
    }
    let decoder = new TextDecoder('utf8')
    resolve(decoder.decode(buffer))
  })
}

/**
 * @tests
 */
base2str('data:application/octet-stream;base64,MTEx')
    .then(data => console.log(data))
base2str('data:application/octet-stream;base64,aGVsbG8gd29ybGQgMTIzIOS9oOWlvQ==')
    .then(data => console.log(data))
base2str('data:application/octet-stream;base64,eyJuYW1lIjoi5p6X5b+X546yIiwiYWdlIjo0OX0=')
    .then(data => console.log(data))


obj2base64({name: '林志玲', age: 49})
    .then(data => console.log(data))
