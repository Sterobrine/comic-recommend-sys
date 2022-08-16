let mysql = require('./mysql').sql;
let fs = require('fs');
let path = require('path');
let data = fs.readFileSync(path.resolve(__dirname, '../info.json'), 'utf-8');
data = JSON.parse(data).data;

let sql = 'insert into movietag(trid,mid,tid) values(?,?,?)';

let tags = [];

for (let i = 0; i < data.length; i++) {
    tags = tags.concat(data[i].tags);
}

tags = Array.from(new Set(tags));

let count = 0;

async function insertTag() {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].tags.length; j++) {
            count++;
            let params = [];
            params.push(count);
            params.push(data[i].id);
            params.push(tags.indexOf(data[i].tags[j])+1);
            await mysql.operate(sql, params);
        }
        console.log(data[i].title);
    }
}

insertTag();