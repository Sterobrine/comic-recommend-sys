const Table = require('./生成用户-评分表').Table;
const fs = require('fs');

let data = fs.readFileSync('../追番.json', 'utf-8');
data = JSON.parse(data);

const table = Table.fillTable(Table.getColumnLabel());

exports.Simi = {
    getUsers: function () {
        let users = [];
        for (uid in data) {
            if (uid === 'totalUser' || uid === 'totalPage') continue;
            else users.push(uid);
        }
        return users;
    },

    initSimi: function (users) {
        let simi = new Array(users.length);
        for (let i = 0; i < simi.length; i++) {
            simi[i] = new Array(users.length).fill(0);
        }
        return simi;
    },

    getUserSimi: function (simi) {
        for (let k = 0; k < table.length; k++) {
            let a = table[k];
            for (let j = k; j < table.length; j++) {
                if (j === k) {
                    simi[k][j] = 0;
                    continue;
                }
                let b = table[j];
                let s1 = 0, s2 = 0, s3 = 0;
                for (let i = 1; i < table[0].length; i++) {
                    s1 += a[i] * b[i];
                    s2 += a[i] * a[i];
                    s3 += b[i] * b[i];
                }
                simi[k][j] = simi[j][k] = s1 / Math.sqrt(s2 * s3);
            }
            simi[k].unshift(a[0]); //设置首列
        }
        return simi;
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

