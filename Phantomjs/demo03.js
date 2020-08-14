const page = require('webpage').create()

const start_time = Date.now()
console.log(Date.now())

page.open('http://www.baidu.com', function (status) {
  console.log(status)
  if (status === 'success') {
    const end_time = Date.now()
    console.log(Date.now())
    console.log(end_time - start_time)
  }
  phantom.exit()
})
