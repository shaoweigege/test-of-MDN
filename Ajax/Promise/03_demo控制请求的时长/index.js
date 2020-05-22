//如何对catch进行统一处理
//控制请求的时长

function reqFileData(path) {
  return new Promise((resolve, reject) => {
    let timerId;
    let totalTime = 0;
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
      clearInterval(timerId);
    };
    xhr.onerror = function (err) {
      reject(err);
      clearInterval(timerId);
    };
    xhr.open('GET', path);
    xhr.responseType = 'json';
    xhr.send();
    timerId = window.setInterval(() => {
      totalTime++;
      if (totalTime === 3) {
        //终止请求
        xhr.abort();
        reject({
          code: 0,
          msg: '请求超时,请稍后重试~'
        });
        totalTime = 0;
        clearInterval(timerId);
      }
    }, 1000)
  })
}

let path = 'http://localhost:3000';
let btn = document.getElementById('btn');
btn.onclick = function () {
  //发起请求
  reqFileData(path)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
};
