const express = require('express');
const fs = require('fs');
const path = require('path');
const app = new express();
const jwt = require("./token").token;
const mysql = require('../mysql/mysql').sql;
const mock = require('mockjs');
const category = require('./category').category;
const head = require('./head').headPic;
const movie = require('./movie').movie;
const recommand = require('./recommand').recommand;

app.use('/static', express.static(path.resolve(__dirname, '../img')));

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "authorization");
    next();
});

app.post('/login/check', (req, res) => {
    let token = req.headers['authorization'];
    let result = false;
    try {
        result = jwt.isOut(token);
        if (result) res.send(JSON.stringify({ code: 401 }));
        else res.send(JSON.stringify({ code: 200 }));
    } catch (error) {
        res.send(JSON.stringify({ code: 401 }));
    }
});

app.post('/login/login', (req, res) => {
    let user = req.query.user;
    user = JSON.parse(user);
    mysql.operate('select*from user where username=? and password=?', [user.username, user.password])
        .then(result => {
            if (!result.length) res.send(JSON.stringify({ code: 404 }));
            else res.send(JSON.stringify({
                code: 200,
                token: jwt.sign({ username: result[0].username, uid: result[0].uid })
            }));
        });
});

app.post('/login/regist', (req, res) => {
    let user = req.query.user;
    user = JSON.parse(user);
    console.log(user);
    let uid = mock.Random.guid();
    mysql.operate('insert into user(uid,username,password) values(?,?,?)', [uid, user.username, user.password])
        .then(() => {
            user.birth = user.birth.split('/').join('-');
            let age = new Date().getFullYear() - parseInt(user.birth.split('-')[0]);
            return mysql.operate('insert into userinfo(uid,age,gender,birth,signature) values(?,?,?,?,?)', [uid, age, user.gender, user.birth, user.signature]);
        }).then(() => {
            return mysql.operate('insert into dirty(uid,dirty) values(?,?)', [uid, 0]);
        })
        .then(result => {
            res.send(JSON.stringify({
                code: 200,
                token: jwt.sign({ username: user.username, uid: uid })
            }));
        });
});

app.get('/home/popular/all', (req, res) => {
    // mysql.operate('select t1.mid mid,t1.title title,count(t2.mid) count from movie t1 left join subscribe t2 on t1.mid group by t1.mid order by count desc limit 10').then(result => {
    //     res.send(JSON.stringify({code:200,list:result}));
    // });
    let result = fs.readFileSync(path.resolve(__dirname, '../year-popular.json'));
    result = JSON.parse(result);
    res.send(JSON.stringify({ code: 200, list: result }));
});

app.get('/home/popular/month', (req, res) => {
    let date = new Date(Date.now() - 24 * 3600 * 30 * 1000);
    date = date.toLocaleDateString().split('/').join('-');
    mysql.operate('select t1.mid mid,t1.title title,t2.count count from movie t1,subscribemonthcount t2 where t1.mid=t2.mid order by count desc limit 10', [date]).then(result => {
        res.send(JSON.stringify({ code: 200, list: result }));
    });
});

app.get('/home/head', (req, res) => {
    let result = [];
    head.reset();
    head.getHtml().then(res => {
        head.getLinks(res);
    }).then(() => {
        return head.getImg()
    }).then(() => {
        result = head.getRes();
        res.send(JSON.stringify({ code: 200, list: result }));
    })
});

app.get('/movie/info', (req, res) => {
    let movie = req.query.mid;
    mysql.operate('select*from movie where mid=?', [movie]).then(result => {
        res.send(JSON.stringify({ code: 200, list: result }));
    });
});

app.get('/movie/recommand', (req, res) => {
    let mid = req.query.mid;
    console.log(req.query);
    recommand.getMoviesByItemCF(mid).then(result => {
        res.send(JSON.stringify({ code: 200, list: result }));
    })
});

app.get('/movie/subscribe/count', (req, res) => {
    let mid = req.query.mid;
    mysql.operate('select count from subscribecount where mid=?', [mid]).then(result => {
        res.send(JSON.stringify({ code: 200, count: result[0]}));
    })
});

app.get('/category/type', (req, res) => {
    mysql.operate('select*from tag').then(result => {
        res.send(JSON.stringify({ code: 200, list: result }));
    });
});

app.get('/category/list', (req, res) => {
    let options = req.query.options;
    options = JSON.parse(options);
    let queryOptions = category.getQueryOptions(options);
    console.log(queryOptions.sql, queryOptions.params);

    mysql.operate(queryOptions.sql, queryOptions.params).then(result => {
        let count = result.length;
        result = result.slice((options.page - 1) * options.pageSize, options.page * options.pageSize);
        res.send(JSON.stringify({ code: 200, list: result, count: count }));
    }, error => console.log(error));
});

app.get('/personal/detail', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        mysql.operate('select userinfo.*, user.username username from user,userinfo where user.uid=userinfo.uid and user.uid=?', [uid]).then(result => {
            res.send(JSON.stringify({ code: 200, list: result }));
        });
    }
});

app.get('/personal/subscribe/list', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        token = jwt.verify(token);
        let options = req.query.options;
        options = JSON.parse(options)
        let count = 0;
        mysql.operate('select t1.* from movie t1,(select subscribe.mid mid, user.uid uid from subscribe,user where subscribe.uid=user.uid) t2 where t1.mid=t2.mid and t2.uid=?', [token.uid]).then(result => {
            count = result.length;
            result = result.slice(options.pageSize * (options.page - 1), options.pageSize * options.page);
            return movie.getTags(result);
        }).then(result => {
            res.send(JSON.stringify({ code: 200, list: result, count: count }));
        })
    }
});

app.post('/personal/subscribe/enter', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        let mid = req.query.mid;
        let date = new Date().toLocaleDateString().split('/').join('-');
        mysql.operate('insert into subscribe(uid,mid,date) values(?,?,?) ', [uid, mid, date]).then(() => {
            return mysql.operate('update subscribecount set count=count+1 where mid=?', [mid]);
        }).then(() => {
            return mysql.operate('update subscribemonthcount set count=count+1 where mid=?', [mid]);
        }).then(() => {
            return mysql.operate('update dirty set dirty=1 where uid=?', [uid]);
        }).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.post('/personal/subscribe/cancel', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        uid = jwt.verify(token).uid;
        mid = req.query.mid;
        mysql.operate('delete from subscribe where uid=? and mid=?', [uid, mid]).then(() => {
            return mysql.operate('update subscribecount set count=count-1 where mid=?', [mid]);
        }).then(() => {
            return mysql.operate('update subscribemonthcount set count=count-1 where mid=?', [mid]);
        }).then(() => {
            return mysql.operate('update dirty set dirty=1 where uid=?', [uid]);
        }).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.get('/personal/subscribe/status', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        let mid = req.query.mid;
        mysql.operate('select * from subscribe where uid=? and mid=?', [uid, mid]).then(result => {
            let status = result.length ? true : false;
            res.send(JSON.stringify({ code: 200, status: status }));
        });
    }
});

app.get('/personal/tag', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        mysql.operate('select tag.* from tag, usertag where tag.tid=usertag.tid and usertag.uid=?', [uid]).then(result => {
            res.send(JSON.stringify({ code: 200, list: result }));
        });
    }
});

app.post('/personal/tag/enter', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        let tid = req.query.tid;
        mysql.operate('insert into usertag(uid,tid) values(?,?) ', [uid, tid]).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.post('/personal/tag/cancel', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        let tid = req.query.tid;
        mysql.operate('delete from usertag where uid=? and tid=? ', [uid, tid]).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.get('/recommand/list', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        recommand.getMoviesByUserCF(uid).then(result => {
            if (result === 404) res.send(JSON.stringify({ code: 404 }));
            else res.send(JSON.stringify({ code: 200, list: result }));
        });
    }
})

app.get('/comment/list', (req, res) => {
    let token = req.headers['authorization'];
    let uid = null;
    let option = JSON.parse(req.query.option);
    if (!jwt.isOut(token)) uid = jwt.verify(token).uid;
    mysql.operate('select comment.*, user.username username, user.uid uid from comment, user where user.uid=comment.uid and comment.mid=? order by comment.date', [option.mid]).then(
        async result => {
            for (let i = 0; i < result.length; i++) {
                let status = false;
                if (uid) {
                    let tmp = await mysql.operate('select*from commentthumb where uid=? and cid=?', [uid, result[i].cid]);
                    if (tmp.length) status = true;
                }
                result[i].status = status;
            }
            return result;
        }
    ).then(result => {
        console.log(option.num);
        res.send(JSON.stringify({ code: 200, list: result.slice(0, option.num), count: result.length }));
    });
})

app.get('/comment/count', (req, res) => {
    let mid = req.query.mid;
    mysql.operate('select count(mid) count from comment where mid=?', [mid]).then(result => {
        res.send(JSON.stringify({ code: 200, count: result[0]}));
    })
});

app.post('/comment/add', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        let option = JSON.parse(req.query.option);
        let date = new Date().toLocaleDateString().split('/').join('-');
        let time = new Date().toTimeString().split(' ')[0];
        mysql.operate('insert into comment(uid,mid,content,date,thumb) values(?,?,?,?,0)', [uid, option.mid, option.content, date + ' ' + time]).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.post('/comment/thumb/add', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        let option = JSON.parse(req.query.option);
        let date = new Date().toLocaleDateString().split('/').join('-');
        let time = new Date().toTimeString().split(' ')[0];
        mysql.operate('insert into commentthumb(uid,cid,date) values(?,?,?)', [uid, option.cid, date + ' ' + time]).then(() => {
            return mysql.operate('update comment set thumb=thumb+1 where cid=?', [option.cid]);
        }).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.post('/comment/thumb/cancel', (req, res) => {
    let token = req.headers['authorization'];
    if (jwt.isOut(token)) res.send(JSON.stringify({ code: 401 }));
    else {
        let uid = jwt.verify(token).uid;
        mysql.operate('delete from commentthumb where uid=? and cid=?', [uid, req.query.cid]).then(() => {
            return mysql.operate('update comment set thumb=thumb-1 where cid=?', [parseInt(req.query.cid)]);
        }).then(() => {
            res.send(JSON.stringify({ code: 200 }));
        })
    }
});

app.get('/search/list', (req, res) => {
    let option = JSON.parse(req.query.option);
    console.log(option);
    let count = 0;
    mysql.operate('select*from movie where title like ?', ['%' + option.keyword + '%']).then(result => {
        count = result.length;
        result = result.slice(option.pageSize * (option.page - 1), option.pageSize * option.page);
        return movie.getTags(result);
    }).then(result => {
        res.send(JSON.stringify({ code: 200, list: result, count: count }));
    });
})

app.listen(9000, () => {
    console.log('服务已启动···');
});