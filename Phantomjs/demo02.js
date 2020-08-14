const page = require('webpage').create()
const system = require('system')

console.log(system.args)

page.open('http://www.baidu.com', function(status) {
  console.log("Status: " + status)
  if(status === "success") {
    page.render('example.png')
  }
  phantom.exit()
})
