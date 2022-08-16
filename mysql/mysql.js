let mysql = require('mysql');

exports.sql = {
    getConn: function(){
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Xie@123',
            database: 'recommand_system'
        });
    },
    operate:function(sql, params){
        let conn = this.getConn();
        return new Promise((resolve, reject) => {
            conn.query(sql, params, function(error, res){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resolve(res);
                }
                conn.end();
            });
        });
    }
}

