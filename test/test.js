let axios = require('axios');
let fs = require('fs');

let data = fs.readFileSync('追番.json', 'utf-8');
data = JSON.parse(data);

let animations = [];

for (uid in data) {
    if (uid === 'totalUser' || uid === 'totalPage') {
        continue;
    }
    else {
        data[uid].forEach(item => {
            animations.push(item.id);
        });
    }
}

// let rule = new RegExp('(?<=<a href=")(.*)(?=" target="_blank" class="news-title-font_1xS-F")', 'g');

// async function getPic() {
//     // for (let i = 0; i < animations.length; i++) {

//     // }
//     let res = await axios.get('https://www.bilibili.com/bangumi/media/md28236221', {
//         headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29'
//         }
//     });
//     console.log(res.data);
// }

// function findTarget(rule) {
//     while ((result = increase.exec(data)) != null) {
//         result = Array.from(new Set(result));
//         incnum = incnum.concat(result);
//     }
// }

// getPic();

// axios.get('https://i0.hdslb.com/bfs/feed-admin/09e10f6852a1a26375c7349777f09ed57c4f7aa4.jpg@880w_388h.webp', {
//     headers:{
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29'
//     },
//     responseType: 'arraybuffer'
// }).then(res => {
//     fs.writeFileSync('pic.png',res.data);
//     // console.log(res.data);
// });