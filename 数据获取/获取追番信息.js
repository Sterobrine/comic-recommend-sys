const fs = require('fs');
const axios = require('axios');

let data = fs.readFileSync('../追番.json', 'utf-8');

let headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69'
}

data = JSON.parse(data);

async function search() {
    for (let i = 0; i < 2000; i++) {
        let uid = Math.round(Math.random() * 29999000) + 1000;
        if (data[uid]) continue;  // 如果已经存在这个id，跳过
        let temp = [];
        for (let j = 1; j <= 100; j++) {
            let url = 'https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn=' + j + '&ps=15&vmid=' + uid;
            let res = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(axios.get(url, { headers }));
                }, 100);
            }, error => console.log(error));
            res = res.data;
            if (res.code === 53013 || res['data']['list'].length === 0) break;  // 如果没有权限或者翻到了空页，找下一个人
            let keyitems = [];
            res['data']['list'].map(item => {
               keyitems.push({
                id: item.media_id,
                title: item.title
               });
            });
            temp = temp.concat(keyitems);
            
            data.totalPage++;
        }
        if (temp.length === 0) continue;
        data.totalUser++;
        data[uid] = temp;
        let writein = JSON.stringify(data);
        fs.writeFileSync('追番.json', writein);
        console.log(data.totalUser, data.totalPage);
    }
}

search();

// fs.writeFileSync('追番.json', data);