const fs = require('fs');

let data = fs.readFileSync('../追番.json', 'utf-8');
data = JSON.parse(data);

exports.Table = {
    getColumnLabel: function () {
        let columns = [];
        for (uid in data) {
            if (uid === 'totalUser' || uid === 'totalPage') continue;
            else {
                data[uid].forEach(item => {
                    columns.push(item.id);
                });
            }
        }
        columns = Array.from(new Set(columns))
        columns.unshift(" ");
        return columns;
    },
    fillTable: function (columns) {
        let table = [];
        for (uid in data) {
            if (uid === 'totalUser' || uid === 'totalPage') continue;
            let row = new Array(columns.length - 1).fill(0);
            row.unshift(uid);
            data[uid].map(item => row[columns.indexOf(item.id)] = 1);
            table.push(row);
        }
        return table;
    }
}

// let columns = getColumnLabel();
// let table = fillTable(columns);

// for(let i=0;i<table.length;i++){
//     table[i] = table[i].join(',') + '\n';
// }

// table.unshift(columns.join(',') + '\n');


// for(let i=0;i<table.length;i++){
//     fs.writeFileSync('用户-评分.csv', table[i], {flag:'a'});
// }
