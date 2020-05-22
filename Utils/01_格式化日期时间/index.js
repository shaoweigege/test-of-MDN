let time = new Date();
let y = time.getFullYear();
let m = (time.getMonth() + 1).toString().padStart(2, '0');
let d = (time.getDate()).toString().padStart(2, '0');
let hh = (time.getHours()).toString().padStart(2, '0');
let mm = (time.getMinutes()).toString().padStart(2, '0');
let ss = (time.getSeconds()).toString().padStart(2, '0');
let str = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
console.log(str);
