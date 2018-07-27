var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');


router.get('/',(req,res)=>{
  res.render('index');
});


//用户的所有路由
router.use('/admin',require('./admin'));
//文章的路由
router.use('/article',require('./article'));

//处理不存在的页面
router.get('*',(req,res)=>{
  res.render('404');
});

module.exports = router;
