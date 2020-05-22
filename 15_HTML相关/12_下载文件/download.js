//download.js v4.2, by dandavis; 2008-2016. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.download = factory();
  }
}(this, function () {

  //返回自定义的函数download() 接受三个参数 1.要下载的数据内容 2.下载的文件名 3.下载的文件的MIME类型
  return function download(data, strFileName, strMimeType) {
    var self = window, // this script is only for browsers anyway...
        defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
        // 如果没有提供第三个参数 那么默认的MIME类型就是 'application/octet-stream'
        mimeType = strMimeType || defaultMime,
        // payload就是要下载的文件的内容
        payload = data,
        // url:如果提供了文件名和MIME类型 那么url就是要下载的文件的内容
        url = !strFileName && !strMimeType && payload,
        // anchor就是创建出来的a标签
        anchor = document.createElement("a"),
        // toString是一个自定义的功能函数 作用是将传入的参数转化成js字符串 并返回该字符串
        toString = function (a) {
          return String(a);
        },
        // myBlob是Blob构造函数 (如果浏览器不支持Blob构造函数 那么myBlob就是上面定义的toString()函数->返回一个字符串)
        // 作用就是用来生成二进制数据对象
        myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
        // 如果没有提供download()函数的第二个参数 那么下载的文件的文件名就默认为'download'
        fileName = strFileName || "download",
        blob,
        reader;
    myBlob = myBlob.call ? myBlob.bind(self) : Blob;

    if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
      // 反转参数 将payload与mimeType的值交换
      payload = [payload, mimeType];
      mimeType = payload[0];
      payload = payload[1];
    }

    if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
      // 这个分支应该是传入一个远程的url地址 然后浏览器下载该远程地址对应的文件
      fileName = url.split("/").pop().split("?")[0];
      anchor.href = url; // assign href prop to temp anchor
      if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
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
      } // end if valid url?
    } // end if url?


    //go ahead and download dataURLs right away
    // 如果传入的第一个参数是data:格式的字符串 那么浏览器可以直接下载
    if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
      if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
        payload = dataUrlToBlob(payload);
        mimeType = payload.type || defaultMime;
      } else {
        return navigator.msSaveBlob ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName) : saver(payload);
      }
    }

    // 如果传入的第一个参数不是二进制对象 那么就将它转换成二进制对象
    blob = payload instanceof myBlob ? payload : new myBlob([payload], {type: mimeType});

    // 自定义功能函数 将dataURL格式的数据转换成Blob二进制对象
    function dataUrlToBlob(strUrl) {
      // 将字符串分割成数组['data','']
      var parts = strUrl.split(/[:;,]/),
          type = parts[1],
          // 如果是base64格式的就需要用atob()来解码 否则就需要用decodeURIComponent()来解码
          decoder = parts[2] === "base64" ? atob : decodeURIComponent,
          //正在需要保存的文件内容是数组的最后一个元素(也需要解码)
          binData = decoder(parts.pop()),
          mx = binData.length,
          i = 0,
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
  }; /* end download() */
}));

