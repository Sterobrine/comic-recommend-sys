let axios = require('axios');
let fs = require('fs');

let data = fs.readFileSync('../追番.json', 'utf-8');
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

animations = Array.from(new Set(animations));

let headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29' };

async function getPic() {
    console.log(data);
    for (let i = 2203; i < animations.length; i++) {
        let url = 'https://api.bilibili.com/pgc/review/user?media_id=' + animations[i];
        let res = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(axios.get(url, { headers }));
            }, 200);
        });
        if (!res.data.result) continue;
        let pic = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(axios.get(res.data.result.media.cover, { headers, responseType: 'arraybuffer' }));
            }, 200);
        });
        fs.writeFileSync('../img/' + animations[i] + '.png', pic.data);
        console.log(animations[i]);
    }
}

getPic();