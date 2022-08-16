const mysql = require('../mysql/mysql').sql;
const fs = require('fs');
const path = require('path');

let u_s = null, u_u = null, user_columns = null, item_columns = null, updatedData = null, indexList = null, i_i = null;

exports.recommand = {
    init : function () {
        u_s = fs.readFileSync(path.resolve(__dirname, '../User-Score.csv'), { encoding: 'utf-8' }).split('\n');
        u_u = fs.readFileSync(path.resolve(__dirname, '../User-User.csv'), { encoding: 'utf-8' }).split('\n');
        // u_s = fs.readFileSync(path.resolve(__dirname, '../用户-评分.csv'), { encoding: 'utf-8' }).split('\n');
        // u_u = fs.readFileSync(path.resolve(__dirname, '../用户-相似.csv'), { encoding: 'utf-8' }).split('\n');
        for (let i = 0; i < u_s.length; i++) {
            u_s[i] = u_s[i].split(',').map(item => {
                if (item === '0') return 0;
                if (item === '1') return 1;
                return item;
            });
            u_u[i] = u_u[i].split(',');
        }
        user_columns = u_u[0];
        item_columns = u_s[0];
        indexList = [];
    }, 
    getUpdatedData : async function () {
        updatedData = await mysql.operate('select subscribe.* from subscribe, dirty where dirty.uid=subscribe.uid and dirty.dirty=1 order by subscribe.uid');
        await mysql.operate('update dirty set dirty=0 where dirty=1');
    },
    updateUserScore : async function () {
        for (let i = 0; i < updatedData.length; i++) {
            let index = user_columns.indexOf(updatedData[i].uid);
            let tmp = null;
            if (index === -1) {
                tmp = new Array(item_columns.length).fill(0);
                tmp[0] = updatedData[i].uid;
                u_s.push(tmp);
                indexList.push(u_s.length - 1);
            }
            else {
                indexList.push(index);
                tmp = u_s[index];
            }
            let j = i;
            while (updatedData[j] && updatedData[j].uid === tmp[0]) {
                tmp[item_columns.indexOf(updatedData[j].mid)] = 1;
                j++;
            }
            i = j;
        }
    },
    updateUserSimi : function () {
        for (let i = 0; i < indexList.length; i++) {
            let tmp = null;
            let index = indexList[i];
            if (index >= user_columns.length) {
                tmp = new Array(index + 1).fill(0);
                tmp[0] = u_s[index][0];
                user_columns.push(tmp[0]);
                u_u.push(tmp);
            }
            else tmp = u_u[index];
            for (let j = 1; j < u_s.length; j++) {
                if (index === j) {
                    tmp[j] = 0;
                    continue;
                }
                let a = u_s[index], b = u_s[j];
                let s1 = 0, s2 = 0, s3 = 0;
                for (let k = 1; k < item_columns.length; k++) {
                    s1 += a[k] * b[k];
                    s2 += a[k] * a[k];
                    s3 += b[k] * b[k];
                }
                let simi = s1 / Math.sqrt(s2 * s3);
                tmp[j] = simi;
                if (typeof u_u[j][index] === 'undefined') u_u[j].push(simi);
                else u_u[j][index] = simi;
            }
        }
    },
    writeBack : function () {
        for (let i = 0; i < u_s.length; i++) {
            u_s[i] = u_s[i].join(',');
            u_u[i] = u_u[i].join(',');
        }
        u_s = u_s.join('\n');
        u_u = u_u.join('\n');
        fs.writeFileSync(path.resolve(__dirname, '../User-Score.csv'), u_s, 'utf-8');
        fs.writeFileSync(path.resolve(__dirname, '../User-User.csv'), u_u, 'utf-8');
    },
    CF_USER : function (uid, subList) {
        let index = user_columns.indexOf(uid);
        let num = u_u[index].length;
        let list = [];
        for (let i = 1; i < num; i++) {
            list.push({
                simi: u_u[index][i],
                index: i
            });
        }
        list.sort((a, b) => b.simi - a.simi);
        let movies = [];
    
        for(let i=1;i<item_columns.length;i++){
            let score = 0;
            for(let j=0;j<10;j++){
                score += u_s[list[j].index][i] * list[j].simi;
            }
            movies.push({
                mid: item_columns[i],
                score: score
            });
        }
    
        movies.sort((a,b)=>b.score-a.score);

        console.log(movies.slice(0,10));

        for(let i=0;i<movies.length;i++){
            if(!subList.length) break;
            for(let j=0;j<subList.length;j++){
                if(subList[j].mid === movies[i].mid){
                    subList.splice(j, 1);
                    movies.splice(i,1);
                    i--;
                    break;
                }
            }
        }
        movies = movies.slice(0, 10).map(item => item.mid);
        return movies;
    },
    getMoviesByUserCF : async function(uid){
        this.init();
        let subList = null;
        const res = await mysql.operate('select mid from subscribe where uid=?', [uid]);
        if(res.length === 0) return 404;
        subList = res;
        await this.getUpdatedData();
        this.updateUserScore();
        this.updateUserSimi();
        let res_1 = this.CF_USER(uid, subList);
        let recommandList = []
        for(let i=0;i<res_1.length;i++){
            let tmp = await mysql.operate('select * from movie where mid=?', res_1[i]);
            tmp = tmp[0];
            let tags = await mysql.operate('select tag.tagname tagname from tag,movietag where movietag.tid=tag.tid and movietag.mid=?', [res_1[i]]);
            tags = tags.map(item => item.tagname).join('/');
            tmp.tags = tags;
            recommandList.push(tmp);
        }
        if(indexList.length) this.writeBack();
        return recommandList;
    },
    CF_ITEM: function(mid){
        i_i = fs.readFileSync(path.resolve(__dirname, '../Item-Item.csv'), { encoding: 'utf-8' }).split('\n');
        for(let i=0;i<i_i.length;i++){
            i_i[i] = i_i[i].split(',');
        }
        let index = i_i[0].indexOf(mid);
        let num = i_i[index].length;
        let list = [];
        for(let i=1;i<num;i++){
            if(i<index) list.push({
                simi:i_i[i][index],
                mid: i_i[i][0]
            });
            else list.push({
                simi:i_i[index][i],
                mid: i_i[i][0]
            });
        }
        list.sort((a,b) => b.simi-a.simi);
        console.log(list.slice(0,8));
        list = list.slice(0, 8).map(item => item.mid);
        return list;
    },
    getMoviesByItemCF : async function(mid){
        let list = this.CF_ITEM(mid);
        let recommandList = [];
        for(let i=0;i<list.length;i++){
            let tmp = await mysql.operate('select * from movie where mid=?', list[i]);
            tmp = tmp[0];
            let tags = await mysql.operate('select tag.tagname tagname from tag,movietag where movietag.tid=tag.tid and movietag.mid=?', [list[i]]);
            tags = tags.map(item => item.tagname).join('/');
            tmp.tags = tags;
            recommandList.push(tmp);
        }
        return recommandList;
    }
}

// recommand.getMoviesByUserCF('738E2cA4-3864-65Fb-4f63-b9C8c1Bca6eb').then(res => console.log(res));

// recommand.getMoviesByItemCF('28230760').then(res => console.log(res));