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
let btn = document.getElementById('btn');
btn.onclick =async function () {
  //发起请求
  let data = await reqFileData(path);
  console.log(data);
};
