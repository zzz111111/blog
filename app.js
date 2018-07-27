var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//处理那个大小413的状态码
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));



app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname+'/public'));
app.use(session({
    resave:false,       //添加 resave 选项
    saveUninitialized:true,////添加 saveUninitialized 选项
    secret:'node',   //密钥
}));

//保存登录状态
app.use(function (req,res,next) {
    if(req.cookies['login']){
        res.locals.username = req.cookies['login'].name;
        res.locals.userimg = req.cookies['login'].userimg;
    }
    next();
});

app.use('/ueditor/ue',require('./ue'));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
