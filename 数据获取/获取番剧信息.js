let axios = require('axios');
let fs = require('fs');

let data = fs.readFileSync('../追番.json', 'utf-8');
data = JSON.parse(data);

let animations = [];

let set = [];

for (uid in data) {
    if (uid === 'totalUser' || uid === 'totalPage') {
        continue;
    }
    else {
        data[uid].forEach(item => {
            if (set.indexOf(item.id) < 0) {
                set.push(item.id);
                animations.push({
                    id: item.id,
                    title: item.title
                });
            }
        });
    }
}

let info = fs.readFileSync('info.json', 'utf-8');
info = JSON.parse(info);

let headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29' };

function wash(tmp, data) {
    let tags = new RegExp('(?<="styles":)(.*?)(?=,"time_length)', 'g');
    let area = new RegExp('(?<="areas":)(.*?)(?=,"copyright)', 'g');
    let date = new RegExp('(?<=<div class="media-info-time"><span>)(.*?)(?=</span>)', 'g');
    let introduce = new RegExp('(?<="evaluate":")(.*?)(?=",")', 'g');
    let actor = new RegExp('(?<="actors":")(.*?)(?=","alias")', 'g');
    let staff = new RegExp('(?<="staff":")(.*?)(?=","stat)', 'g');
    tmp.tags = [];
    JSON.parse(tags.exec(data)[0]).map(item => tmp.tags.push(item.name));
    tmp.area = JSON.parse(area.exec(data)[0]);
    if(tmp.area.length) tmp.area = tmp.area[0].name;
    else tmp.area = '中国大陆';
    tmp.date = date.exec(data)[0];
    tmp.introduce = introduce.exec(data)[0];
    tmp.actor = actor.exec(data)[0];
    tmp.staff = staff.exec(data)[0];
}



async function getInfo() {
    for (let i = info.total; i < animations.length; i++) {
        let url = 'https://www.bilibili.com/bangumi/media/md' + animations[i].id;
        let res = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(axios.get(url, { headers }));
            }, 200);
        });
        let tmp = {};
        tmp.id = animations[i].id;
        tmp.title = animations[i].title;
        wash(tmp, res.data);
        info.data.push(tmp);
        info.total++;
        let writein = JSON.stringify(info);
        fs.writeFileSync('info.json', writein);
        console.log(tmp.title, info.total);
    }
}

getInfo();