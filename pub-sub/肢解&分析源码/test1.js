console.log(typeof window === 'object' && window);
//在node环境中 打印的是 false  因为在node环境中typeof window === 'object'是false
//在浏览器环境中 打印的是window对象 在浏览器环境中typeof window === 'object'是true
