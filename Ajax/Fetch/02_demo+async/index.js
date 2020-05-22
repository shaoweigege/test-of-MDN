//如何对catch进行统一处理

function reqFileData(path) {
  return new Promise((resolve, reject) => {
    fetch(path, {
      method: 'GET'
    })
        .then(res => {
          return res.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
  })
}

let path = './student.json';
let btn = document.getElementById('btn');
btn.onclick = function () {
  //发请求
  reqFileData(path)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
};
