## ArrayBuffer对象&Blob对象&File对象&FileList对象&FileReader对象&URL对象

#### 1.ArrayBuffer对象用于操作二进制内存
      let buffer = new ArrayBuffer(length:number);
      接受一个整数作为参数,表示该二进制对象所占内存的大小
      实例对象有slice实例方法,可以用来复制对象的一部分或者全部

#### 2.Blob对象用于操作二进制文件
      let blob = new Blob(arr[,options]);
      第一个参数是一个数组,数组的成员是字符串或者二进制对象
      第二个参数是可选的配置对象,目前只有一个属性type,对应的值是一个字符串,表示对象的MIME类型,默认是空字符串
      let arr = ['chenMM', 'liR'];
      let blob2 = new Blob(arr, {
          type: 'text/plain'
      });
      实例对象有slice实例方法,可以用来复制对象的一部分或者全部
      
#### 3.File对象表示一个文件对象




#### 4.FileList对象是一组File对象(伪数组)  

  
  
  
#### FileReader对象用于读取File对象或者Blob对象的内容
      FileReader对象的几个监听函数
      1.reader.onload  读取成功,通常在该回调函数中获取e.target.result属性(文件的内容)
      2.reader.onerror 读取失败
      3.reader.onabort 读取中止
      4.reader.onloadstart 开始读取
      5.reader.onloadend   读取结束(先load然后loadend)
      6.reader.onprogress  正在进行读取
      let reader = new FileReader();
      reader.onload = function(e){
        console.log(e.target.result);
      };
      //一般用来读取文本文件的信息,得到文本的字符串
      reader.readAsText(Blob对象或者File对象);
      
      //一般用来读取图片的信息,得到base64格式的字符串,可以直接用于img标签的src属性
      reader.readAsDataURL(Blob对象或者File对象);
      
      //读取得到二进制对象
      reader.readAsArrayBuffer(Blob对象或者File对象);
#### URL对象用于将Blob对象或者File对象生成可访问的blob:链接,可以直接用于img标签的src属性
      静态方法:URL.createURLObject(File对象或者Blob对象)
              URL.revokeURLObject(URL实例) 用于手动释放生成的URL实例
              如果生成的URL对象实例很多,使用完该资源后需要手动释放资源
              如果生成的URL对象实例不是很多,可以不用手动释放资源
              

##URL编码与解码
  >原因：网页中的URL只能包含合法的字符,不合法的字符都会被按照一定规则进行转义              
  合法字符包含两类：
  1.URL元字符：   ;  ,  /  ?  :  @  #  =  +  $  &
  2.语义字符：    a-z A-Z 0-9 -  _  .  !  ~  *  '  ()
  js提供四个编码解码的函数
  encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()
  
  
  ###### 1.encodeURI() 只编码url中的特殊字符(中文等)
  
  ###### 2.decodeURI() 是encodeURI()的逆过程
  
  ###### 3.encodeURIComponent() 会将整个url都编码(包括// :之类的网页url合法的字符)
  
  ###### 4.decodeURIComponent() encodeURIComponent()的逆过程
  
                
#### Web Worker
###### 1.为javaScript创造多线程环境 允许主线程创建worker线程 在主线程运行的同时将一些任务分配给worker线程
###### 2.worker线程一旦创建就会一直运行 不会被主线程的操作打断 因此也会比较耗费资源 应该在使用完后立刻关闭
      
    
