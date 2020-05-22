const per = {
  name: '林志玲',
  age: 42
}

let arr = []
/*
* arr.push()方法
* 1.如果参数是基本数据类型 则存储的是基本数据类型变量的值 后续修改不会影响到数组中的值
* 2.如果参数是引用数据类型 则存储的是引用数据类型变量的地址值 后续修改会影响到数组中的值
* */
let i = 100
arr.push(per, i)
console.log(arr)

//修改per&i的属性
per.name = '波多野结衣'
i++
console.log(arr)
