const express = require('express');
const router = express.Router();
const sql = require('../module/mysql');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

//get post 任何形式的访问都会经过这一条路由
router.use((req, res, next) => {
    console.log('这里会走到吗');
    next();
});

//用户信息
router.get('/', (req, res) => {
    sql('select * from bloguser,(SELECT * FROM article2 where userid = ? order by articleid desc limit 0,7) A where A.userid = bloguser.bloguserid', [req.cookies['login'].id], (err, data) => {
        if (err) throw err;
        //console.log(data);
        sql('select articleid from article2', (err1, data1) => {
            res.render('userinfo', {
                articleData: data,
                articleCout: data1.length
            });
        });
    });
});

// 响应注册页面
router.get('/reg', (req, res) => {
    res.render('reg');
});

router.get('/getcookielogin', (req, res) => {
    res.send(req.cookies['login']);
});

//注册时检查是否有相同的用户名
router.get('/checksameuser', (req, res) => {
    sql('select * from bloguser where useremail = ?', [req.query.email], (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            //没有符合条件的 表示可以注册
            res.send(true);
        } else {
            //已经有了 不可以注册了
            res.send(false);
        }
    });
});

/**
 * 用户注册
 * @param {String} username 用户名
 * @param {String} email 邮箱
 * @param {String} password 密码
 * 
 * 其实在页面中之前已经检查过了有没有被重复注册，在这里检查一次再保险一下
 * 
 * @return 
 *  {status: 200, msg: '注册成功'}
 *  {stasus: 400, msg: '该用户已被注册'}
 *  {status: 500, msg: '服务繁忙，请稍后再试'}
 */

router.post('/reguser', (req, res) => {
    console.log('用户注册');
    var { username, email, password } = req.body;

    var md5 = crypto.createHash('md5'),
        md5Password = md5.update(password).digest('hex');
    sql(`select * from bloguser where useremail = ?`, [email], (err, userArr) => {
        if (err) {
            console.log('查询用户信息失败,错误信息如下：');
            console.log(err);
            return res.send({ status: 500, msg: '服务繁忙，请稍后再试' });
        }
        // console.log('查看查询到的用户信息');
        // console.log(userArr);
        if (userArr.length !== 0) {
            // 此处是被他人注册了
            return res.send({ status: 400, msg: '该账号已被注册' });
        }
        // 走到这里说明没有被注册
        sql('INSERT INTO bloguser (bloguserid,username,useremail,pass,userimg,admin) VALUES (0,?,?,?,?,?)', [username, email, md5Password, '/images/users/p1.jpg', 'no'], (err, data) => {
            if (err) {
                console.log('注册逻辑写入失败,错误信息如下：');
                console.log(err);
                return res.send({ status: 500, msg: '服务繁忙，请稍后再试' });
            };
            if (data) {
                res.send({ status: 200, msg: '注册成功' });

                var nowTime = new Date();
                var regInfo = `user:${email} register in time ${nowTime.getFullYear()}-${nowTime.getMonth() + 1}-${nowTime.getDate()}日${format(nowTime.getHours())}:${format(nowTime.getMinutes())}:${format(nowTime.getSeconds())} \n`;

                fs.appendFile(path.join(__dirname, '..', 'log', 'register.log'), regInfo, (err) => {
                    if (err) {
                        console.log('用户注册成功，注册信息写入log日志失败，失败原因如下：')
                        console.log(err);
                    };
                });
            }
        });
    })
});

/**
 * 用户登录
 * @param {String} user 用户名
 * @param {String} password 密码
 * 
 * @return 
 *  {status: 101, msg: '用户不存在'}
 *  {status: 200, msg: '登录成功'}
 *  {status: 400, msg: '登录失败'}
 */
router.post('/login', (req, res) => {
    var { user, password } = req.body;
    var md5 = crypto.createHash('md5');

    sql('select * from bloguser where useremail = ?', [user], (err, data) => {
        if (err) throw err;
        console.log('查询用户');
        console.log(data);
        if (data.length === 0) {
            res.send({ status: 101, msg: '用户不存在' }); //用户名不存在
            return;
        }
        var sqlData = data[0];
        var newpass = md5.update(password).digest('hex');  //编码格式hex
        var username = sqlData['username'];
        if (sqlData['pass'] === newpass) {
            //登录成功
            // 1. cookie的名称 2.数据 3.过期时间
            res.cookie('login', { name: username, id: sqlData['bloguserid'], userimg: sqlData['userimg'] }, { maxAge: 1000 * 60 * 60 * 24 });
            req.session.userinfo = sqlData;  //将当前登录的所有信息都保存到 req.session.userinfo中
            console.log(req.session);

            res.send({ status: 200, msg: '登录成功' });
            // var nowTime = new Date();
            // var loginInfo = `user:${user} login in time ${nowTime.getFullYear()}-${nowTime.getMonth()+1}-${nowTime.getDate()}日${format(nowTime.getHours())}:${format(nowTime.getMinutes())}:${format(nowTime.getSeconds())} \n`;
            // fs.appendFile('../log/dologin.log',loginInfo,(err)=>{
            //     if(err) throw err;
            // })
        } else {
            res.send({ status: 400, msg: '登录失败' });
        }
    });
});

//查询个人用户的几页文章
router.get('/list-:page.html', (req, res) => {
    sql('select * from article2,bloguser where article2.userid = bloguser.bloguserid order by articleid desc limit ?,7', [(req.params['page'] - 1) * 7], (err, data) => {
        if (err) throw err;
        sql('select articleid from article2 where userid = ?', [req.cookies['id'].id], (err1, data1) => {
            if (err1) throw err1;
            res.render('userinfo', {
                articleData: data,
                articleCout: data1.length
            })
        })
    })
});


//用户注销
router.get('/logout', (req, res) => {
    res.clearCookie('login'); //清除cookie
    req.session.userinfo = '';
    res.send('成功');
});


//修改个人资料
router.get('/updateuserinfo', (req, res) => {
    sql('select * from bloguser where bloguserid = ?', [req.cookies['login']['id']], (err, data) => {
        res.render('updateuserinfo', { userinfo: data[0] });
    });

});

//修改昵称
router.get('/updateusername', (req, res) => {
    var username = req.query.value;
    var loginCookie = req.cookies['login'];
    var id = loginCookie['id'];
    sql('update bloguser set username=? where bloguserid=?', [username, id], (err, data) => {
        if (err) throw err;
        if (data) {
            var userimg = loginCookie['userimg'];
            res.clearCookie('login');
            res.cookie('login', { name: username, id: id, userimg: userimg }, { maxAge: 1000 * 60 * 60 * 24 });
            res.send('成功');
        }
    })

});

//修改其他信息
router.get('/updateusersign', (req, res) => {
    var userinfo = req.query;
    var id = req.cookies['login']['id'];
    sql('update bloguser set sex = ?,signture = ? where bloguserid = ?', [userinfo.sexValue, userinfo.sign, id], (err, data) => {
        if (err) throw err;
        if (data) {
            res.send('成功');
        }
    })
});

//修改用户头像
router.post('/fsuserimg', (req, res) => {
    //console.log(req.body);
    var imgData = req.body.data;
    var data2 = imgData.replace(/^data:image\/\w+;base64,/, "");
    //console.log(data2);
    var dataBuffer = Buffer.from(data2, "base64");
    //文件的名字
    var filename = Date.now();

    fs.writeFile(`../public/images/users/${filename}.png`, dataBuffer, (err1, data1) => {
        if (err1) throw err1;
        sql('update bloguser set userimg = ? where bloguserid = ?', ['/images/users/' + filename + '.png', req.cookies['login']['id']], (err2, data2) => {
            if (err2) throw err2;
            var loginCookie = req.cookies['login'];
            var username = loginCookie['name'];
            var id = loginCookie['id'];

            sql('select userimg from bloguser where bloguserid = ?', [id], (err3, data3) => {
                //console.log(data3);
                res.clearCookie('login');
                res.cookie('login', { name: username, id: id, userimg: data3[0]['userimg'] }, { maxAge: 1000 * 60 * 60 * 24 });
                res.send('成功');
            });
        })
    });
});

function format(n) {
    return n < 0 ? '0' + n : n;
}


module.exports = router;
