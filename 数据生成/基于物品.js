const fs = require('fs');
const path = require('path');

let simi=null;
let simiList = [];

let Simi = {
    initTable: function () {
        table = fs.readFileSync(path.resolve(__dirname, '../User-Score.csv'), { encoding: 'utf-8' }).split('\n');
        for (let i = 0; i < table.length; i++) {
            table[i] = table[i].split(',').map(item => {
                if (item === '0') return 0;
                if (item === '1') return 1;
                return item;
            });
        }
    },

    initSimi: function () {
        simi = new Array(table[0].length);
        for (let i = 0; i < simi.length; i++) {
            simi[i] = new Array(table[0].length).fill(0);
            simi[i][0] = table[0][i];
        }
        simi[0] = table[0];
        // return simi;
    },

    getItemSimi: function () {
        for (let k = 1; k < table[0].length; k++) {
            for (let j = k; j < table[0].length; j++) {
                if (j === k) {
                    simi[k][j] = 0;
                    continue;
                }
                let s1 = 0, s2 = 0, s3 = 0;
                for (let i = 1; i < table.length; i++) {
                    s1 += table[i][k] * table[i][j];
                    s2 += table[i][k] * table[i][k];
                    s3 += table[i][j] * table[i][j];
                }
                simi[j][k] = s1 / Math.sqrt(s2 * s3);
                simiList.push(simi[j][k]);
            }
        }
        // return simi;
    },

    createItemSimi: function(){
        // for (let i = 0; i < simi.length; i++) {
        //     simi[i] = simi[i].join(',');
        // }
        // simi = simi.join('\n');
        // fs.writeFileSync(path.resolve(__dirname, '../Item-Item.csv'), simi, 'utf-8');
        let simiObj = {
            simi:simiList,
            items:table[0]
        }
        fs.writeFileSync(path.resolve(__dirname, '../Item-Item.json'), JSON.stringify(simiObj), 'utf-8');
    }
}

// let users = getUsers();
// let simi = initSimi(users);
// simi = getUserSimi(simi);
// users.unshift(' ');
// simi.unshift(users);
// for(let i=0;i<simi.length;i++){
//     simi[i] = simi[i].join(',') + '\n';
// }
// for(let i=0;i<simi.length;i++){
//     fs.writeFileSync('用户-相似.csv', simi[i], {flag:'a'});
// }

Simi.initTable();
Simi.initSimi();
console.log(simi);
Simi.getItemSimi();
Simi.createItemSimi();

