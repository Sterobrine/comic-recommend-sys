exports.category = {
    getQueryOptions: function (options) {
        // console.log(options);
        let orderby = options.orderType ? 'count' : 'date';
        let seq = options.orderType ? options.arrowStatus.sub : options.arrowStatus.pub;
        let pageSize = options.pageSize;
        let params = [];
        seq = seq ? 'desc' : ''
        let sql = "";
        if (orderby === 'count') {
            sql = 'select t1.mid mid,t1.title title,t2.count from movie t1,subscribecount t2 where t1.mid=t2.mid';
            if (options.type !== '全部') sql = 'select t1.mid mid,t1.title title,t2.count,t4.tagname from movie t1,subscribecount t2,movietag t3,tag t4 where t1.mid=t2.mid and t1.mid=t3.mid and t3.tid=t4.tid';
            if (options.area !== '全部' || options.date !== '全部' || options.type !== '全部') sql += ' and ';
        }
        else {
            sql = 'select mid,title,date from movie';
            if (options.type !== '全部') sql = 'select t1.mid,t1.title,t1.date from movie t1,movietag t2,tag t3 where t1.mid=t2.mid and t2.tid=t3.tid';
            if (options.area !== '全部' || options.date !== '全部' || options.type !== '全部') sql += ' and ';
        }

        let addition = [];
        if (options.area !== '全部') {
            addition.push('area=?');
            params.push(options.area);
        }
        if (options.date !== '全部') {
            if (options.date !== '2014') {
                addition.push('date>=? and date<?');
                params.push(options.date);
                params.push(parseInt(options.date) + 1 + "");
            }
            else {
                addition.push('date<=?');
                params.push(options.date);
            }
        }
        if (options.type !== '全部') {
            addition.push('tagname=?');
            params.push(options.type);
        }
        sql += addition.join(' and ');
        sql += ' order by ' + orderby + ' ' + seq;
        // console.log(sql);
        // params.push((options.page - 1) * options.pageSize);
        // params.push(pageSize);

        return {
            sql,
            params
        };
    }
}

//orderType
//arrowStatus sub pub
//area
//date
//pageSize
//page