const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    path = require('path'),
    fs = require('fs');

var searchValue = '';  //这里保存着模糊查询的值

router.get('/',(req,res)=>{
    // console.log('打印一点点欧尼熊');
    console.log(req.session.userinfo);
    sql('SELECT bloguserid,username,userimg,articleid,title,tag,userid,img,time,readcout,zan,introduce FROM article2,bloguser where article2.userid = bloguser.bloguserid order by articleid desc limit 0,7',(err,data)=>{
        if(err) throw err;
        sql('select count(*) AS count from article2',(err1,data1)=>{
            if(err1) throw err1;
            sql('select articleid,title,introduce,username from article2,bloguser where bloguser.bloguserid=article2.userid and articleid = ?',[11],(err2,data2)=>{
                if(err2) throw err2;
                sql('select articleid,title from article2 order by readcout desc limit 10',(err3,data3)=>{
                    if(err3) throw err3;
                    sql('select tag,count(*) as count from article2 group by tag',(err4,data4)=>{
                        res.render("article",{
                            articleData:data,  //倒叙查询的是前7条文章
                                articleCout:data1[0]['count'], //查询的是文章数量
                                titleArticle:data2[0], //查询文章首页置顶的文章
                                articleReadCount:data3,    //阅读量最多的文章排行
                                articleType:data4,    //文章类型 以及个数
                        })
                        // sql('select username,userimg,title,articlepinglun.content,articlepinglun.articleid from article2,articlepinglun,bloguser where articlePinglun.userid = bloguser.bloguserid and articlepinglun.articleid = article2.articleid order by articlepinglun.id desc limit 3',(err5,data5)=>{
                        //     if(err5) throw err5;
                        //     res.send({
                                
                        //         articlePinglun:data5  //查询文章最新三条评论信息
                        //     });
                        // });  
                    });
                    
                });
            });
        });
    });

    // sql('SELECT bloguserid,username,userimg,articleid,title,tag,userid,img,time,readcout,zan,introduce FROM article2,bloguser where article2.userid = bloguser.bloguserid order by articleid desc limit 0,7',(err,data)=>{
    //     if(err) throw err;
    //     sql('select count(*) AS count from article2',(err1,data1)=>{
    //         if(err1) throw err1;
    //         sql('select articleid,title,introduce,username from article2,bloguser where bloguser.bloguserid=article2.userid and articleid = ?',[11],(err2,data2)=>{
    //             if(err2) throw err2;
    //             sql('select articleid,title from article2 order by readcout desc limit 10',(err3,data3)=>{
    //                 if(err3) throw err3;
    //                 sql('select tag,count(*) as count from article2 group by tag',(err4,data4)=>{
    //                     sql('select username,userimg,title,articlepinglun.content,articlepinglun.articleid from article2,articlepinglun,bloguser where articlePinglun.userid = bloguser.bloguserid and articlepinglun.articleid = article2.articleid order by articlepinglun.id desc limit 3',(err5,data5)=>{
    //                         if(err5) throw err5;
    //                         res.render('article',{
    //                             articleData:data,  //倒叙查询的是前7条文章
    //                             articleCout:data1[0]['count'], //查询的是文章数量
    //                             titleArticle:data2[0], //查询文章首页置顶的文章
    //                             articleReadCount:data3,    //阅读量最多的文章排行
    //                             articleType:data4,    //文章类型 以及个数
    //                             articlePinglun:data5  //查询文章最新三条评论信息
    //                         });
    //                     });
    //                 });
    //             });
    //         });

    //     });
    // });
});

//获得第几页文章
router.get('/list-:page.html',(req,res)=>{
    //console.log((req.params['page']-1)*7);
    sql('select * from article2,bloguser where article2.userid = bloguser.bloguserid order by articleid desc limit ?,7',[(req.params['page']-1)*7],(err,data)=>{
        if(err) throw err;
        sql('select articleid from article2',(err1,data1)=>{
            if(err1) throw err1;
            res.send({
                articleData:data,
                articleCout:data1.length
            })
        })
    })
});

//获得要查询的第几页文章  //查询的页数 查询的内容
router.get('/searchlist-:page.html',(req,res)=>{
   //console.log(req.params['page']);
   //console.log(searchValue);
    sql('select * from (select * from article2 where title like ?) A,bloguser where bloguser.bloguserid = A.userid order by articleid desc limit ?,7',[`%${searchValue}%`,(req.params['page']-1)*7],(err,data)=>{
        if(err) throw err;
        //console.log(data);
        sql('select articleid from article2 where title like ?',[`%${searchValue}%`],(err1,data1)=>{
            res.send({
                articleData:data,
                articleCout:data1.length
            });
        });
    })
});


//获得第几篇文章  具体的一篇文章的内容
router.get('/:id.html',(req,res)=>{
    console.log('1111111');
    //console.log(req.params['id']);
    sql('SELECT * FROM article2 ,bloguser WHERE article2.userid = bloguser.bloguserid and articleid = ?',[req.params.id],(err,data)=>{
        if(err) throw err;
        if(data.length === 0){
            res.status(404).render('404');
        }else{
            sql('select * from (SELECT * FROM articlepinglun WHERE articleid = ?) A,bloguser where bloguser.bloguserid = A.userid',[req.params.id],(err1,data1)=>{
                if(err1) throw err1;
                sql('select count(*) As count from (select count(bloguserid) AS count, bloguserid from (SELECT * FROM articlepinglun WHERE articleid = ?) A,bloguser where bloguser.bloguserid = A.userid group by bloguserid) B',[req.params.id],(err2,data2)=>{
                    sql('select articleid,title from article2 order by readcout desc limit 10',(err3,data3)=>{
                        sql('select tag,count(*) as count from article2 group by tag',(err4,data4)=>{
                            sql('select username,userimg,title,articlepinglun.content,articlepinglun.articleid from article2,articlepinglun,bloguser where articlePinglun.userid = bloguser.bloguserid and articlepinglun.articleid = article2.articleid order by articlepinglun.id desc limit 3',(err5,data5)=>{
                                sql('select articleid from article2',(err6,data6)=>{
                                    sql('select time from article2 order by articleid desc limit 0,1',(err7,data7)=>{
                                        sql('UPDATE article2 set readcout = readcout+1 where articleid = ?',[req.params.id],(err8,data8)=>{
                                            sql('select articleid,title FROM article2 WHERE articleid = ? or articleid = ?',[(req.params['id'])-1,(req.params['id'])*1+1],(err9,data9)=>{
                                                console.log(data9);
                                                res.render('article_detail',{
                                                    data:data[0],
                                                    arpinglun:data1,
                                                    pinguserCount:data2,
                                                    articleReadCount:data3,    //阅读量最多的文章排行
                                                    articleType:data4,    //文章类型 以及个数
                                                    articlePinglun:data5,  //查询文章最新三条评论信息
                                                    articleCout:data6.length,
                                                    newarticle:data7[0],
                                                    articlePrevNext:data9
                                                })
                                            });
                                        });
                                    })
                                });
                            })
                        })
                    });

                });
            });
        }

    });
});

//查询文章
router.get('/searchtext',(req,res)=>{
    searchValue = req.query.value;
    sql('select * from (select * from article2 where title like ?) A,bloguser where bloguser.bloguserid = A.userid order by articleid desc limit ?,7',[`%${req.query.value}%`,0],(err,data)=>{
        if(err) throw err;
        sql('select articleid from article2 where title like ?',[`%${req.query.value}%`],(err1,data1)=>{
            //console.log(data);
            res.send({
                articleData:data,
                articleCout:data1.length
            });

        });
    })
});

//响应发表文章的页面
router.get('/ue',(req,res)=>{
    res.render('ue');
});

//提交发表文章
router.post('/submit',(req,res)=>{
    var data = req.body;
    var articleTitle = data.articleTitle,
        articleType = data.articleType,
        articleContent = data.articleContent,
        articleIntroduce = data.introduce;
    var imgData = data.imgData64;
    var data2 = imgData.replace(/^data:image\/\w+;base64,/,""),
        dataBuffer = Buffer.from(data2,"base64"),
        filename = Date.now();
        console.log('文件位置');
        console.log(path.join(__dirname,'..','public/images/article-upload/',filename+'png'));
    fs.writeFile(path.join(__dirname,'..','public/images/article-upload/',filename+'.png'),dataBuffer,(err,data)=>{
        sql('insert into article2 (articleid,title,tag,userid,content,img,time,readcout,zan,introduce) values (0,?,?,?,?,?,?,?,?,?)',
            [articleTitle,articleType,req.cookies['login'].id,articleContent,'/images/article-upload/'+filename+'.png',time(),0,0,articleIntroduce],(err,data)=>{
                if(err) throw err;
                if(data){
                    res.send('发表成功');
                }
            }
        );
    });
});

//评论
router.post('/pinglun',(req,res)=>{
    var reqData = req.body;
    sql('insert into articlepinglun (id,userid,articleid,content,ptime) values (0,?,?,?,?)',[req.cookies['login'].id,reqData['articleid'],reqData['content'],time()],(err,data)=>{
        if(err) throw err;
        res.send('评论成功');
    })
});

//点赞
router.get('/zan',(req,res)=>{
    var id = req.query.id;
    sql('update article2 set zan = zan +1 where articleid = ?',[id],(err,data)=>{
        if(err) throw err;
        sql('select zan from article2 where articleid = ?',[id],(err1,data2)=>{
            res.send(data2);
        })
    })
});





function time() {
    var date = new Date();
    var year = date.getFullYear();
    var month = format(date.getMonth()+1);
    var data = format(date.getDate());
    var hours = format(date.getHours());
    var minutes = format(date.getMinutes());
    return ''+year+'-'+month+'-'+data+'-'+hours+':'+minutes;
}
function format(time) {
    return time<10?'0'+time:time;
}

module.exports = router;