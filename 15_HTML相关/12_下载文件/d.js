function download(data, strFileName, strMimeType) {

  var self = window, // this script is only for browsers anyway...
      defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
      mimeType = strMimeType || defaultMime,
      payload = data,  //要保存的数据
      url = !strFileName && !strMimeType && payload,
      //创建a链接
      anchor = document.createElement("a"),
      toString = function (a) {
        return String(a);
      },
      myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
      fileName = strFileName || "download", //文件名
      blob,
      reader;
  myBlob = myBlob.call ? myBlob.bind(self) : Blob;

  //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
  if (String(this) === "true") {
    payload = [payload, mimeType];
    mimeType = payload[0];
    payload = payload[1];
  }

  // if no filename and no mime, assume a url was passed as the only argument
  if (url && url.length < 2048) {
    //自定义文件名
    fileName = url.split("/").pop().split("?")[0];
    //设置a连接的href属性
    anchor.href = url; // assign href prop to temp anchor

    // if the browser determines that it's a potentially valid url path:
    // 检测a链接的href属性有没有设置成功
    if (anchor.href.indexOf(url) !== -1) {
      //a链接的href属性设置成功
      var ajax = new XMLHttpRequest();
      ajax.open("GET", url, true);
      ajax.responseType = 'blob';
      ajax.onload = function (e) {
        download(e.target.response, fileName, defaultMime);
      };
      setTimeout(function () {
        ajax.send();
      }, 0); // allows setting custom ajax headers using the return:
      return ajax;
    }
  }


  //go ahead and download dataURLs right away
  //如果下载的内容是以data:开头的
  if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
    if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
      //利用自定义的函数将dataURL转换成blob数据
      payload = dataUrlToBlob(payload);
      mimeType = payload.type || defaultMime;
    } else {
      // IE10 can't do a[download], only Blobs:
      // everyone else can save dataURLs un-processed
      return navigator.msSaveBlob ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName) : saver(payload);
    }
  }
  blob = payload instanceof myBlob ? payload : new myBlob([payload], {type: mimeType});

  //将dataURL转换成blob数据
  function dataUrlToBlob(strUrl) {
    // parts = ['data', 'image/png', 'base64', 'jxhuaishdahdashdi']
    var parts = strUrl.split(/[:;,]/),
        type = parts[1],
        decoder = parts[2] === "base64" ? atob : decodeURIComponent, //解码处理
        //binData就是对数组的最后一个元素进行decoder处理
        //如果是图片,则binData就是图片的二进制文本数据
        binData = decoder(parts.pop()),
        mx = binData.length,
        i = 0,
        //创建Unit8Array对象
        uiArr = new Uint8Array(mx);
    for (i; i < mx; ++i) {
      uiArr[i] = binData.charCodeAt(i);
    }
    return new myBlob([uiArr], {type: type});
  }

  function saver(url, winMode) {
    if ('download' in anchor) { //html5 A[download]
      anchor.href = url;
      anchor.setAttribute("download", fileName);
      anchor.className = "download-js-link";
      anchor.innerHTML = "downloading...";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      setTimeout(function () {
        anchor.click();
        document.body.removeChild(anchor);
        if (winMode === true) {
          setTimeout(function () {
            //主动释放通过URL.createObjectURL()产生的对象
            self.URL.revokeObjectURL(anchor.href);
          }, 250);
        }
      }, 66);
      return true;
    }

    // handle non-a[download] safari as best we can:
    if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
      url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      if (!window.open(url)) { // popup blocked, offer direct download:
        if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) {
          location.href = url;
        }
      }
      return true;
    }

    //do iframe dataURL download (old ch+FF):
    var f = document.createElement("iframe");
    document.body.appendChild(f);

    if (!winMode) { // force a mime that will download:
      url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
    }
    f.src = url;
    setTimeout(function () {
      document.body.removeChild(f);
    }, 333);

  }//end saver


  if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
    return navigator.msSaveBlob(blob, fileName);
  }

  if (self.URL) { // simple fast and modern way using Blob and URL:
    saver(self.URL.createObjectURL(blob), true);
  } else {
    // handle non-Blob()+non-URL browsers:
    if (typeof blob === "string" || blob.constructor === toString) {
      try {
        return saver("data:" + mimeType + ";base64," + self.btoa(blob));
      } catch (y) {
        return saver("data:" + mimeType + "," + encodeURIComponent(blob));
      }
    }
    // Blob but not URL support:
    reader = new FileReader();
    reader.onload = function (e) {
      saver(this.result);
    };
    reader.readAsDataURL(blob);
  }
  return true;
}
