let mysql = require('../mysql/mysql').sql;
let fs = require('fs');
let path = require('path');

let data = fs.readFileSync(path.resolve(__dirname,'../追番.json'));

data = JSON.parse(data);

async function insertSub(){
    for(uid in data){
        let list = data[uid];
        for(let i=0;i<list.length;i++){
            await mysql.operate('insert into subscribe(uid,mid,date) values(?,?,?)', [uid,list[i].id,'2022-1-1']);
        }
    }
}

insertSub();