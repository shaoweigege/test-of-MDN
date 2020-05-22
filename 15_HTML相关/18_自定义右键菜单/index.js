window.onload = function () {
  //先隐藏菜单栏
  let contextMenuContainer = document.getElementById('context-menu-container');
  contextMenuContainer.style.display = 'none';
  //阻止默认的右键菜单事件
  document.body.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
  //给body添加右键菜单事件
  document.body.addEventListener('contextmenu', function (e) {
    //获取此时鼠标的坐标
    let {x, y, pageX, pageY, offsetX, offsetY, screenX, screenY, layerX, layerY, clientX, clientY} = e;
    console.log(pageX, pageY);
    // console.log(offsetX,offsetY); //相对于最近的元素来计算位置
    // console.log(screenX,screenY); //相对于整块电脑屏幕(包括地址栏那块区域(默认是100px))
    // console.log(layerX, layerY);
    // console.log(clientX, clientY);
    // console.log(x, y);
    //用pageX pageY来定位当前鼠标的位置

    //判断鼠标点击的位置距离浏览器顶部的距离是否大于菜单栏的高度
    if (pageY > 300) {
      //将菜单的底部固定在当前鼠标点击的位置
      //显示菜单栏
      contextMenuContainer = document.getElementById('context-menu-container');
      contextMenuContainer.style.display = 'block';
      contextMenuContainer.style.position = 'absolute';
      contextMenuContainer.style.top = pageY - 250 + 'px';
      contextMenuContainer.style.left = pageX + 'px';
    } else {
      //将菜单的顶部固定在当前鼠标点击的位置
      //显示菜单栏
      contextMenuContainer = document.getElementById('context-menu-container');
      contextMenuContainer.style.display = 'block';
      contextMenuContainer.style.position = 'absolute';
      contextMenuContainer.style.top = pageY + 'px';
      contextMenuContainer.style.left = pageX + 'px';
    }
  });

  //给菜单中的按钮添加点击事件
  document.getElementById('close-item').onclick = function () {
    contextMenuContainer.style.display = 'none';
  };
};
