const mysql = require('../mysql/mysql').sql;

async function insertDirty(){
    let res = await mysql.operate('select uid from user');
    res = res.map(item => item.uid);
    for(let i=0;i<res.length;i++){
        await mysql.operate('insert into dirty(uid,dirty) values(?,?)', [res[i],1]);
    }
}

insertDirty();