//如何对catch进行统一处理

function reqFileData(path) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (err) {
      reject(err)
    };
    xhr.open('GET', path);
    xhr.responseType = 'json';
    xhr.send();
  })
}

let path = './student.json';
let path2 = './teacher.json';
let btn = document.getElementById('btn');
btn.onclick = function () {
  //发起请求
  reqFileData(path)
      .then(data => {
        console.log(data);
        return reqFileData(path2);
      })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
};
