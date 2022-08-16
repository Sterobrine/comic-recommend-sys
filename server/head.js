const axios = require('axios');
const fs = require('fs');
const path = require('path');

let headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29' };
let imgLinks = [];
let detailLinks = [];

exports.headPic = {
    reset: function(){
        imgLinks = [];
        detailLinks = [];
    },
    getHtml: function () {
        return new Promise((resolve, reject) => {
            axios.get('https://www.bilibili.com/anime/', { headers }).then(res => {
                resolve(res.data);
            })
        });
    },
    getLinks: function (data) {
        let step1 = new RegExp('(?<=<li class="chief-recom-item">)(.*?)(?=</li>)', 'g');
        let res = [];
        while (result = step1.exec(data)) {
            res = res.concat(result);
        }
        res = Array.from(new Set(res));
        for(let i=0;i<res.length;i++){
            let step2 = new RegExp('(?<=<a href=")(.*?)(?=" target)', 'g');
            detailLinks.push(step2.exec(res[i])[0]);
            let step3 = new RegExp('(?<=<img src=")(.*?)(?=" alt)', 'g');
            imgLinks.push('https:' + step3.exec(res[i])[0]);
        }
    },
    getImg: async function(){
        for(let i=0;i<imgLinks.length;i++){
            let img = await axios.get(imgLinks[i], { headers, responseType: 'arraybuffer' });
            fs.writeFileSync(path.resolve(__dirname,'../img/head/' + i + '.png'), img.data);
        }
    },
    getRes: function(){
        let res = [];
        for(let i=0;i<detailLinks.length;i++){
            res.push({
                index:i,
                link:detailLinks[i]
            })
        }
        return res;
    }
}