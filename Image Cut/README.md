### 将canvas元素转换成图片文件
```js
const canvas = document.getElementById('canvas')
//此时dataURL就是一个base64格式的字符串 可以直接用于img标签的src属性
const dataURL = canvas.toDataURL()

```
