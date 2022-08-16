let mysql = require('./mysql').sql;
let fs = require('fs');
let path = require('path');
let data = fs.readFileSync(path.resolve(__dirname, '../info.json'), 'utf-8');
data = JSON.parse(data).data;

let sql = 'insert into tag(tid,tagname) values(?,?)';

let tags = [];

for(let i=0;i<data.length;i++){
    tags = tags.concat(data[i].tags);
}

tags = Array.from(new Set(tags));

async function insertTag(){
    for(let i=0;i<tags.length;i++){
        let params = [];
        params.push(i+1);
        params.push(tags[i]);
        await mysql.operate(sql,params);
        console.log(tags[i]);
    }
}

insertTag();