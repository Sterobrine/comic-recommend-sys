let fs = require('fs');

// let data = fs.readFileSync('./test/test.csv', 'utf-8');
let data = '<a href="https://www.bilibili.com/bangumi/play/ep478912?from_spmid=666.4.0.0" target="_blank"><picture><source type="image/webp" srcset="//i0.hdslb.com/bfs/bangumi/image/0dc9bb348817d7172f049e2e6f33a8ed763b5ea0.png@2320w_664h.webp"> <img src="//i0.hdslb.com/bfs/bangumi/image/0dc9bb348817d7172f049e2e6f33a8ed763b5ea0.png@2320w_664h.png" alt="即使是路人角色也要以下克上！"></picture></a>';

// let rule = new RegExp('(?<="styles":)(.*?)(?=,"time_length)', 'g');
// let area = new RegExp('(?<="areas":)(.*?)(?=,"copyright)', 'g');
// let rule = new RegExp('(?<=<div class="media-info-time"><span>)(.*?)(?=开播</span>)', 'g');
// let rule = new RegExp('(?<="evaluate":")(.*?)(?=",")', 'g');
// let rule = new RegExp('(?<="actors":")(.*?)(?=","alias")', 'g');
// let rule = new RegExp('(?<="staff":")(.*?)(?=","stat)', 'g');

let rule = new RegExp('(?<=<img src=")(.*?)(?=" alt)', 'g');


let res = [];

// while (result = rule.exec(data)) {
//     res = res.concat(result);
//     // console.log(res);
// }

// res = Array.from(new Set(res));

result = rule.exec(data);
console.log(result.concat(res));
// console.log(data);





//编号 标题
//地区 时间
//演员
//制作人员
//简介