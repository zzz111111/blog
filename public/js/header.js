
//登录模块
(function () {
    var ohLoginBtn = document.getElementById('h-login'),
        ohRegBtn = document.getElementById('h-reg'),
        oLogin = document.getElementById('login'),
        oLoginInputUser = document.getElementById('login-input-user'),
        oLoginInputPassword = document.getElementById('login-input-password'),
        oLoginBtn = Z('.login-btn')[0];


    var LoginCookie = Z.cookie.getCookie('login');
    if(!LoginCookie){
        Z.addEvent(ohLoginBtn,'click',function (e) {
            e = e || window.event;
            e.cancelBubble = true;
            oLogin.style.display = 'block';
            oLogin.className = 'login-show';
            document.addEventListener('click',hideLogin);
        });

        Z.addEvent(oLogin,'click',function (e) {
            e = e || window.event;
            e.cancelBubble = true;
        });
        //隐藏登录框
        var hideLogin = function () {
            oLogin.style.display = 'none';
            oLogin.className = '';
        };
        Z.addEvent(oLoginBtn,'click',function () {
            var data = {};
            data.user = oLoginInputUser.value;
            data.password = oLoginInputPassword.value;
            if(data.user === "" || data.password === ""){ //密码为空
                alert('有一项内容为空')
            }else{
                Z.ajax({
                    url:"/admin/login",
                    type:"post",
                    data:data,
                    success:function (data) {
                        console.log(data);
                        if(data === '登录成功'){
                            window.history.go(0); // 刷新本页面
                        }
                    },
                    error:function (err) {

                    }
                })
            }
        })
    }
})();

//退出登录
(function () {
    var LoginCookie = Z.cookie.getCookie('login');
    if(LoginCookie){
        Z('#logo').on('click',function () {
            window.location.href = 'http://www.xiaoye121.com'; 
        });
        Z('#logout').on('click',function (e) {
            e = e || window.event;
            e.cancelBubble = true;
            Z.ajax({
                url:'/admin/logout',
                success:function (data) {
                    if(data === '成功'){
                        window.location.href = 'http://www.xiaoye121.com'; 
                    }
                }
            })
        });
    }

})();


//滚动改变头部颜色
(function () {
    window.onscroll = function () {
        
        var top = document.documentElement.scrollTop;
        if(top>60){
            Z('.header-fixed')[0].style.background = '#666';
            Z('.header-fixed')[0].style.color = '#ccc';
        }else{
            Z('.header-fixed')[0].style.background = '#F1F1EF';
            Z('.header-fixed')[0].style.color = '#222';

        }
    };

})();











