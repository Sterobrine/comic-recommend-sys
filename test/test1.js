const mysql = require('../mysql/mysql').sql;

mysql.operate('select subscribe.* from subscribe, dirty where dirty.uid=subscribe.uid and dirty.dirty=1').then(res => {
    console.log(res);
})