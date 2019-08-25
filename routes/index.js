var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');
const path = require('path');

const multer = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'img'));
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
  }
})

var upload = multer({ storage: storage })

// const upload = multer({ storage: storage });


router.get('/', (req, res) => {
  res.render('index');
});

// 
router.post('/uploadImg', upload.single('img'), (req, res) => {
  console.log('请求到的图片接口');
  console.log(req.body);
  console.log(req);
  res.send('请求成功');
});

//用户的所有路由
router.use('/admin', require('./admin'));
//文章的路由
router.use('/article', require('./article'));



//处理不存在的页面
router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;
