## 行内元素和块元素和行内块元素

### 1.行内元素 <a> <b> <i> <del> <span>....
> 1.display:inline

> 2.行内元素手动设置宽高是无效的 宽高是由内容的宽和高决定的

> 3.行内元素设置padding-top padding-bottom margin-top margin-bottom也是无效的

> 4.行内元素设置padding-left padding-right margin-left margin-right是有效的


### 2.块级元素 <div> <section> <header> <h1> <h2>...
> 1.display:block

> 2.块级元素默认占满一行 而且块级元素的宽高内边距外边距都是可以进行手动控制的

### 3.行内块元素 <img> <input>...
> 1.display:inline-block

> 2.行内块元素不会占满整行 但是宽高也可以进行手动控制


### 4.img元素的默认下边距问题
> 1.图片默认的垂直对齐方式的基线对齐 而基线对齐又取决于字体的大小 所以图片底部的间隙会随着父容器中字体的大小而变化

> 2.解决办法:设置vertical-align:top/middle/bottom即可消除图片底部的间隙(会对相邻的行内元素的垂直对齐方式产生影响)
            或者设置图片display:block也可以消除图片底部的间隙
