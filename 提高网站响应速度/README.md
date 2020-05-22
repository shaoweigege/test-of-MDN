## 提高网站响应速度的43条军规

### 1.减少HTTP请求数量
    访问一个网页绝大部分时间都花费在下载网站的图片、样式表、脚本以及flash资源上
>1.合并文件：将样式文件合并 将背景图片使用css-sprite技术然后用background-image background-position来使用图片
>2.一些内联的图片可以使用dataURL字符串来引用(体积太大的图片不适合这样)

### 2.使用分布式网络(Content Delivery Network)-> CDN


### 3.给头部添加一个失效期或是Cache-Control(合理利用浏览器缓存 服务器对响应头做配置)
>1.强缓存：Expires Cache-Control
>2.协商缓存：Last-Modified If-Modified-Since Etag...

### 4.服务端开启gzip压缩 
    如果客户端发送的http请求带有Content-Encoding:gzip deflate头 那么服务端的响应就可以使用gzip压缩来提高数据的传输速度

### 5.把样式文件放在最前面
    这样可以使浏览器逐步渲染html中的标签 而不是在解析了全部的html标签后再去绘制样式

### 6.把脚本文件放在最后
    脚本文件大多数都是用来处理与用户的交互行为 但是第一次访问网站时最重要的是快速的将页面呈现出来所以脚本文件并不急着加载

### 7.使用外联的样式和脚本文件
>1.内联样式：<p style="color:red;">这里是段落</p>
>2.外联样式：<link rel="stylesheet" type="text/css" href="./style/index.css"/>
>3.内联脚本：<script>这里是脚本代码</script>
>4.外联脚本：<script src="./index.js" type="text/javascript"></script>
    这两种方式的最重要的区别就是：
        ****外联的样式和脚本会被浏览器缓存**** 这样在缓存有效期内不用再次下载该资源 
        ****而内联的样式和脚本不会被浏览器缓存**** 每次请求页面都会被下载

### 8.缩小样式文件和脚本文件的大小
>1.去除注释、去除空格
>2.js文件进行压缩(去除注释、去除空格、替换变量名)
