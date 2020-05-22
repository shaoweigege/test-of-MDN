css文本
1.文本对齐方式
    text-align:left|right|center(文本居中对齐)|justify(文本两端对齐)

2.文本装饰属性
>text-decoration:underline(下划线)|overline(上划线)|line-through(中划线)|none(无)

3.文本转换
 >text-transform:uppercase(转换成大写字母)|lowercase(转换成小写字母)|capitalize(每个单词的首字母都转换成大写)

4.文本缩进
    text-indent:具体数值(首字缩进)

5.文本间隔(适用于英文 不适用于中文)
>word-spacing:具体的数值(每个英文单词之间的间隔距离)

6.字符间距(适用于中文也适用于英文)
>letter-spacing:具体的数值(每个字符之间的距离)

7.文本方向(**并不是让文字改变方向 而是改变默认的左边**)
>direction:ltr(从左到右)|rtl(从右到左)

8.设置行高
    line-height:具体的数值或者百分数

9.文字阴影
>text-shadow:h-shadow v-shadow blur color;
    h-shadow:水平方向的距离
    v-shadow:数值方向的距离
    blur:阴影的距离
    color:阴影的颜色

10.垂直对齐
>vertical-align:baseline|sub|super|top|text-top|middle|bottom|text-bottom|length|百分比|inherit

11.处理空白
>white-space:
              normal	默认。空白会被浏览器忽略。
              pre	空白会被浏览器保留。其行为方式类似 HTML 中的 <pre> 标签。
              nowrap	文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
              pre-wrap	保留空白符序列，但是正常地进行换行。
              pre-line	合并空白符序列，但是保留换行符。
              inherit	规定应该从父元素继承 white-space 属性的值。
