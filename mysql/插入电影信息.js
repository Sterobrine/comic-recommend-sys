let mysql = require('./mysql').sql;
let fs = require('fs');
let path = require('path');
let data = fs.readFileSync(path.resolve(__dirname, '../info.json'), 'utf-8');
data = JSON.parse(data).data;

let sql = 'insert into movie(mid,title,area,date,introduce,actor,staff) values(?,?,?,?,?,?,?)'

async function insertMovie(){
    for(let i=0;i<data.length;i++){
        let params = [];
        for(key in data[i]){
            if(key !== 'tags') params.push(data[i][key]);
        }
        await mysql.operate(sql,params);
        console.log(data[i]['title']);
    }
}

insertMovie();
