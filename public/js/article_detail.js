(function () {
    //文章的评论功能
    (function () {
        var oButton = Z('.btn-fw')[0];
        var oTextarea = document.getElementById('textarea');
        Z.addEvent(oButton,'click',function () {
            var pinglun = {};
            var content = oTextarea.value;
            //评论不能全部都是空格 而且也不能不登录
            var isLogin = Z.cookie.getCookie('login');
            if(isLogin){
                if(/\S/.test(content)){ //非空格 有内容
                    pinglun.content = content;
                    pinglun.articleid = oButton.dataset['articleid'];
                    Z.ajax({
                        type:"post",
                        url:"/article/pinglun",
                        data:pinglun,
                        success:function (data) {
                            console.log(data);
                            if(data == '评论成功'){
                                alert('评论成功 刷新页面即可看到评论内容');
                            }
                        }
                    })
                }else{
                    alert('文本框中没有内容');
                }
            }else{
                alert('请先登录后再评论');
            }

        });


    })();

    //点赞
    (function () {
        var oZanBox = Z('.action-like')[0];
        var oZan = document.getElementById('zan');
        var oZanCount = document.getElementById('zanCount');
        Z.addEvent(oZan,'click',updateZan);
        
        function updateZan() {
            var id = this.dataset.articleid;
            Z.ajax({
                url:'/article/zan',
                data:{id:id},
                success:function (data) {
                    data = JSON.parse(data)[0];
                    oZanCount.innerHTML = data['zan'];
                    //将点击事件取消 然后改变背景颜色吧
                    oZanBox.style.opacity = 1;
                    oZanBox.style.color = '#fff';
                    Z.removeEvent(oZan,'click',updateZan);
                }
            })
        }

    })();

    //运行了多少天
    (function () {
        var date1 = new Date("2018,5,1");
        var articleRightDay = document.getElementById('article-right_day');
        getTime();
        function getTime() {
            var date = new Date();
            var time = date - date1;
            var day = Math.floor(time/1000/60/60/24);
            articleRightDay.innerHTML = day;
        }
    })();


})();
