/*
    websocket
        http / https
        ws  / wss
    服务器  <==>  浏览器  双向

    websocket  服务器也有支持和不支持
    iis8以下的 不支持
 */

//当引入socket的时候会在window下添加一个io全局
//websocket
    //第一步 http 连接方式进行连接 并且 告诉服务器要创建一个websocket连接
    //第二步 服务器没问题
    //第三步 正式建立 websocket连接



var oLeftUserimg = document.querySelector('.m-card .userimg');
var oUserName = document.querySelector('.m-card .name');
var oTextarea = document.getElementById('textarea');
var oSubmit = document.getElementById('submit');
var oMMessage = Z('.m-message')[0];
var chatUl = document.querySelector('.m-message ul');

var socket,
    id,
    username,
    userimg,
    userinfo = {};
if(Z.cookie.getCookie('login')){
    Z.ajax({
        url:"/admin/getcookielogin",
        success:function (data) {
            data = JSON.parse(data);
            data.name = encodeURI(data.name);
            userinfo = data;
            oLeftUserimg.src = data.userimg;
            oUserName.innerHTML = decodeURIComponent(data.name);
            init(userinfo);

            //点击发送按钮
            Z.addEvent(oSubmit,'click',function () {
                submit();
                console.log(Z(oMMessage).offsetHeight);
                console.log(Z(chatUl).offsetHeight);
            });
            //按键发送信息
            oTextarea.onfocus = function () {
                onkeydown = function (e) {
                    e = e || window.event;
                    //e.preventDefault();
                    if(e.keyCode === 13){
                        e.preventDefault();
                        e.returnValue = false;
                        submit();
                    }
                    if(e.keyCode){

                    }
                }
            };
        }
    })
}
else{
    //如果用户没有登录
    var name = prompt('请输入你进入聊天室的昵称,您也可以选择注册一个账号,使用会员进入聊天室');
    var encodeName = encodeURIComponent(name);
    userinfo.id = Date.now();
    userinfo.name = encodeName;
    var imgNum = Math.floor(Math.random()*10+1);
    userinfo.userimg = '/images/chat/'+imgNum+'.jpg';
    oLeftUserimg.src = userinfo.userimg;
    oUserName.innerHTML = decodeURIComponent(userinfo.name);
    console.log(userinfo);
    init(userinfo);

    //点击发送按钮
    Z.addEvent(oSubmit,'click',function () {
        submit();
        console.log('111111');
        console.log(Z(oMMessage).offsetHeight);
        console.log(Z(chatUl).offsetHeight);
    });
    //按键发送信息
    oTextarea.onfocus = function () {
        onkeydown = function (e) {
            e = e || window.event;
            //e.preventDefault();
            if(e.keyCode === 13){
                e.preventDefault();
                e.returnValue = false;
                submit();
            }
            if(e.keyCode){

            }
        }
    };
    oTextarea.onblur = function () {
        onkeydown = null;
    };
}


function init(uesrinfo) {
    socket = io.connect('/');
    socket.emit('login',uesrinfo);
    socket.on('login',data=>{

    });
    socket.on('chat',data=>{
        console.log(data);
        if(userinfo.id === data.userid){
            //自己说的话
            var str = '<li>' +
                '<p class="time">' +
                '<span>'+time()+'</span>' +
                '</p>' +
                '<div class="main self">' +
                '<img class="avator" width="30" height="30" src="'+data.userimg+'" />' +
                '<div class="text">' +data.content +'</div>' +
                '</div>' +
                '</li>';
            chatUl.innerHTML += str;
        }else{
            var str = '<li>' +
                '<p class="time">' +
                '<span>'+time()+'</span>' +
                '</p>' +
                '<div class="main">' +
                    '<img class="avator" width="30" height="30" src="'+data.userimg+'" />' +
                    '<p>'+decodeURIComponent(data.username)+'</p>'+
                    '<div class="text">'+data.content +'</div>' +
                '</div>' +
                '</li>';
            chatUl.innerHTML += str;
        }
        if(chatUl.offsetHeight>oMMessage.offsetHeight){
            oMMessage.scrollTop = chatUl.offsetHeight - oMMessage.offsetHeight + 100;
        }

    });
}


function submit() {
    var txt = oTextarea.value;
    if(txt){
        oTextarea.value = '';
        //让光标恢复到最初始的位置
        socket.emit('msg',{content:txt});
    }else{
        alert('发送消息不能为空');
    }
}

function time() {
    var date = new Date();
    var hours = date.getHours(),
        minutes = date.getMinutes();
    return ''+format(hours)+ ':'+format(minutes);
}
function format(n) {
    return n<10?'0'+n:n;
}


var chat = {
    sessionList:[
        {
            date:"2018",
            text:"hello 这是我们的聊天记录",
        },
        {
            date:"2018",
            text:"hello 这是我们的聊天记录",
            self:true
        },
    ],
    user:[
        {
            id:1,
            img:"/images/chat/10.jpg",
            name:"Coffee"
        }
    ],
    userList:[
        {
            id:2,
            name:"示例介绍",
            img:"dist/images/2.png"
        },
        {
            id:3,
            name:"111",
            img:"images/users/3.jpg"
        }
    ]

};







