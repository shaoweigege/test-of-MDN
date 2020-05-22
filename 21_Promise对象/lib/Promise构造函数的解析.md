### Promise构造函数的一些细节
> 0.Promise构造函数接收一个执行器函数作为参数 这个执行器函数是立即同步执行的 
    然后将执行的结果作为resolve()函数或者reject()函数的参数 resolve(value) 或者reject(reason)
    如果执行器函数内部抛出异常 那么默认Promise实例的状态就是rejected reason就是抛出的异常
    
> 1.Promise实例应该有三个属性 
    ①状态status: pending/resolved/rejected
    ②携带的值(成功或者失败)data 成功：value 失败：reason
    ③对应的回调队列callbacks:[{onResolve(){},onReject(){}}]     

> 2.resolve()和reject()函数执行前必须先判断此时的Promise实例的状态是否已经发生了变化
    如果状态已经发生了变化 那么不做任何处理 只有Promise状态是初始化状态时才去做出相应的处理

> 3.Promise.prototype.then(onResolve,onReject)方法 
    ①如果传入的onResolve不是一个函数类型 那么默认onResolve = value => value
    ②如果传入的onReject不是一个函数类型 那么就默认onReject = reason => { throw reason }

> 4.Promise.prototype.then(onResolve,onReject)方法时 此时Promise实例的状态有三种可能
    4.1 pending状态：此时需要将onResolve,onReject回调函数添加到Promise实例的回调队列中
    4.2 resolved状态：此时需要立即异步执行成功的回调onResolve(value)  
        ???为什么是异步执行呢??? 因为要确保.then()函数后面的所所有同步代码执行完再执行.then()指定的回调函数
    4.3 rejected状态：此时需要立即异步执行失败的回调onReject(reason)  
        ???为什么是异步执行呢??? 因为要确保.catch()函数后面的所所有同步代码执行完再执行.then()指定的回调函数

> 5.Promise.prototype.then(onResolve,onReject)方法时 还需要返回一个新的Promise实例
    这个新的Promise实例的状态就取决于onResolve或者onReject回调函数执行的结果
    5.1 onResolve或者onReject回调函数执行抛出异常 
        那么返回的新的Promise实例就是失败状态 失败的原因reason就是抛出的异常
    5.2 onResolve或者onReject回调函数执行返回值是Promise类型 
        那么返回的新的Promise实例的状态和值就取决于函数的返回值
    5.3 onResolve或者onReject回调函数执行返回值不是Promise类型 
        那么返回的新的Promise实例就是成功状态 成功的值value就是函数的返回值

> 6.Promise实例上的catch()方法 就相当于 Promise.prototype.then(undefined,onReject)

> 7.Promise函数对象上的resolve(值)方法 立即返回一个Promise实例 参数可以是一个普通的值 也可以是一个Promise实例
    7.1 参数是一个普通的值 那么返回的Promise实例就是成功的状态 成功的value就是这个参数的值
    7.2 参数是一个Promise实例 那么返回的Promise实例的状态和值就取决于这个传入的Promise类型的参数的状态和值

> 8.Promise函数对象上的reject(值)方法 立即返回一个失败状态的Promise实例 参数就只能是普通的值(不可以传Promise类型的值)

> 9.Promise函数对象上的all([值1,值2,...])方法 
    参数：数组的元素可以是Promise类型也可以是普通的值 
          1.Promise类型：那么就当做Promise类型来处理
          2.普通的值：那么就默认将其转换为Promise类型来处理 Promise.resolve(值)
    机制：1.只有传入的数组中每个元素都返回成功状态的Promise对象时 
            那么all()方法返回的Promise对象的状态才是成功的 并且成功的值就是数组中每个Promise对象对应的成功的值组成的新的数组
          2.数组中只要有一个元素的状态为失败状态 
            那么all()方法返回的Promise对象的状态就是失败状态 并且失败的值就是第一个失败的Promise对象的失败的值

> 10.Promise.race()方法
    参数：数组的元素可以是Promise类型也可以是普通的值 
          1.Promise类型：那么就当做Promise类型来处理
          2.普通的值：那么就默认将其转换为Promise类型来处理 Promise.resolve(值)
    机制：数组中第一个状态发生改变的Promise对象的状态和值作为race()方法返回的Promise对象的状态和值
