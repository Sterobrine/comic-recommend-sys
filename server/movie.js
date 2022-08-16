const mysql = require('../mysql/mysql').sql;

exports.movie = {
    getTags: async function(list){
        for(let i=0;i<list.length;i++){
            let tags = await mysql.operate('select tag.tagname tagname from tag, movietag where tag.tid=movietag.tid and mid=?',[list[i].mid]);
            tags = tags.map(item => item.tagname).join('/');
            list[i].tags = tags;
        }
        return list;
    }
}