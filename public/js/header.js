
//登录模块
(function () {
    var ohLoginBtn = document.getElementById('h-login'),
        ohRegBtn = document.getElementById('h-reg'),
        oLogin = document.getElementById('login'),
        oLoginInputUser = document.getElementById('login-input-user'),
        oLoginInputPassword = document.getElementById('login-input-password'),
        oLoginBtn = Z('.login-btn')[0];


    var LoginCookie = Z.cookie.getCookie('login');
    if (!LoginCookie) {
        Z.addEvent(ohLoginBtn, 'click', function (e) {
            e = e || window.event;
            e.cancelBubble = true;
            oLogin.style.display = 'block';
            oLogin.className = 'login-show';
            document.addEventListener('click', hideLogin);
        });

        Z.addEvent(oLogin, 'click', function (e) {
            e = e || window.event;
            e.cancelBubble = true;
        });
        //隐藏登录框
        var hideLogin = function () {
            oLogin.style.display = 'none';
            oLogin.className = '';
        };
        Z.addEvent(oLoginBtn, 'click', function () {
            var data = {};
            data.user = oLoginInputUser.value;
            data.password = oLoginInputPassword.value;

            if(data.user === ""){
               return alert('请输入用户名')
            }else if(data.password === ""){
                return alert('请输入密码');
            }

            Z.ajax({
                url: "/admin/login",
                type: "post",
                data: data,
                success: function (data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.status === 101) {
                        alert('用户名或密码错误');
                    } else if (data.status === 200) {
                        window.history.go(0); // 刷新本页面
                    } else if (data.status === 400) {
                        alert('用户名或密码错误');
                    }
                },
                error: function (err) {
                    alert('服务器繁忙，请稍后再试');
                }
            })
        })
    }
})();

//退出登录
(function () {
    var LoginCookie = Z.cookie.getCookie('login');
    if (LoginCookie) {
        Z('#logo').on('click', function () {
            window.location.href = '/';
        });
        Z('#logout').on('click', function (e) {
            e = e || window.event;
            e.cancelBubble = true;
            Z.ajax({
                url: '/admin/logout',
                success: function (data) {
                    if (data === '成功') {
                        window.location.href = '/';
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
        if (top > 60) {
            Z('.header-fixed')[0].style.background = '#666';
            Z('.header-fixed')[0].style.color = '#ccc';
        } else {
            Z('.header-fixed')[0].style.background = '#F1F1EF';
            Z('.header-fixed')[0].style.color = '#222';

        }
    };

})();











