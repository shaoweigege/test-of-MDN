## 浏览器的缓存策略

### 1.强缓存(Expires&Cache-Control)
    相同点:
        两者都表示强缓存:如果浏览器命中强缓存,那么浏览器直接从磁盘或者内存中读取资源。服务器会返回200的状态码。  
        磁盘缓存(from disk cache):浏览器会将css资源存入磁盘中。
        内存缓存(from memory cache):浏览器会将js、图片资源保存在内存中。
    不同点:
        Expires是Http1.0时期产生的,Cache-Control是Http1.1时期产生的。两者同时出现的话Cache-Control的优先级会更高。
    
### 2.协商缓存(Last-Modified&If-Modified-Since、Etag&If-None-Match)
    相同点:
        如果浏览器命中协商缓存,那么服务器返回304状态码。
    不同点:
        Last-Modified&If-Modified-Sice:第一次请求该资源时,服务器返回的响应头中包含Last-Modified的值,该值表示该资源最近一次的修改时间。
        当浏览器再次请求该资源时,请求头中会包含If-Modified-Since这个头,值就是上一次服务器返回的Last-Modified响应头的值,然后服务器对两个
        值进行比较进而决定是否使用协商缓存策略。
        ETag&If-None-Match:第一次请求该资源时,服务器返回的响应头中包含ETag这个响应头,该值是根据该资源生成的标志,资源如果发生改变,那么该值也会改变。
        当浏览器再次请求该资源时,请求头中会包含If-None-Match这个头,值就是服务器返回的ETag的值,然后服务器比较这两个值进而决定是否使用协商缓存策略。

### 3.协商缓存两种方式的对比
    精确度:
        ETag的精确度要优于Last-Modified:因为Last-Modified的单位是秒,如果一个资源在一秒内改变了很多次,那么Last-Modified并不能识别出来。
        而ETag是根据资源的内容生成的标志,可以很灵敏的感应到资源的变化。
    性能:
        ETag在性能上要略低于Last-Modified:因为Last-Modified只需要存储时间即可,而ETag确需要服务器根据资源的内容去计算出hash值.
    优先级:
        服务器优先考虑ETag。
