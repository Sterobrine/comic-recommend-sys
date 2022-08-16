const fs = require('fs');
const path = require('path');
const mysql = require('../mysql/mysql').sql;

let data = fs.readFileSync(path.resolve(__dirname, '../追番.json'));
data = JSON.parse(data);
let list = {};
for (uid in data) {
    for (let i = 0; i < data[uid].length; i++) {
        if(list[data[uid][i].id]) list[data[uid][i].id].count++;
        else{
            list[data[uid][i].id] = {
                mid:data[uid][i].id,
                title:data[uid][i].title,
                count:1
            }
        }
    }
}

let count = [];

for(mid in list){
    count.push(list[mid]);
}

count.sort((a,b) => {
    return b.count - a.count;
})

async function insertCount(){
    for(let i=0;i<count.length;i++){
        await mysql.operate('insert into subscribemonthcount(mid,count) values(?,?)', [count[i].mid, 0]);
    }
}

insertCount();

// fs.writeFileSync(path.resolve(__dirname,'../year-popular.json'),JSON.stringify(count),'utf-8');