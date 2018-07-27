(function () {

    var index = 0;
    var maxpage;
    //点击页面ajax更新第几页
    (function () {
        Z(Z('.page')[index]).addClass('on');
        maxpage = Z('.page').length; //最大页数
        //点击页面中的页面按钮
        Z('.page').on('click',function () {
            Z('.page').removeClass('on');
            Z(this).addClass('on');
            var str = this.dataset.url;
            var reg = /^(\/article\/list-)/;
            var reg1 = /(\.html)$/;
            index = str.replace(reg,'').replace(reg1,'');

            Z.ajax({
                url: this.dataset.url,
                success: function (data) {
                    var ardata = JSON.parse(data);
                    var ul = document.getElementById('left-text');
                    updateAjax(ul, ardata);
                    Z('.page').on('click', function () {
                        Z('.page').removeClass('on');
                        Z(this).addClass('on');
                    });
                }
            })
        })
    })();



    //根据ajax请求的文章来更新左部分的内容
    function updateAjax(parent,data) {
        parent.innerHTML = '';
        var length = data.articleData.length;
        for(var i=0;i<length;i++){
            parent.innerHTML += '<li class="text">' +
                '<div class="img-left">' +
                '<a class="read-more" href="/article/'+data.articleData[i]['articleid']+'.html" target="_blank">' +
                ' <img width="200" height="150" src="'+data.articleData[i]['img']+'" alt="">' +
                '</a>' +
                '</div>' +
                '<div class="text-right">' +
                '<h2>' +
                '<span><a href="">'+data.articleData[i]['tag']+'</a></span>' +
                ' <a href="/article/'+data.articleData[i]['articleid']+'.html" target="_blank">'+data.articleData[i]['title']+'</a>' +
                '</h2>'+
                '<div class="entry-meta">'+
                ' <a href="">个人博客</a> <i class="space">•</i> <a href="">前端开发咨询</a> <i class="space">•</i> '+
                ' <span>'+data.articleData[i]['username']+'</span>'+
                '</div>'+
                '<h3>'+data.articleData[i]['introduce']+'</h3>'+
                '<a href="/article/'+data.articleData[i]['articleid']+'.html" target="_blank" class="readmore">阅读全文<i class="iconfont fav-che"></i></a>'+
                '<p class="ar-bottom">'+
                ' <span><i class="iconfont icon-shijian"></i>&nbsp; '+data.articleData[i]['time']+'</span>'+
                ' <span><i class="iconfont icon-liulan2"></i>&nbsp; '+data.articleData[i]['readcout']+'</span>'+
                ' <span class="comm"> <a href=""><i class="iconfont icon-pinglun"></i> <span class="cy_cmt_count">12</span> 条评论</a></span>'+
                ' <span class="post-like"><a href="javascript:;" class="favorite"><i class="iconfont fa-thumbs-o-up"></i></a></span>'+
                '</p>'+
                '</div>'+
                '</li>'
        }
    };

    /*//更新文章底部的页码
    function updatePage(page,data) {
        page.innerHTML = '';
        page.innerHTML += '<a class="first-page" href="javascript:;">首页</a>'+'<a class="prev-page" href="javascript:;"><</a>';
        var pageNumber = Math.ceil(data.articleCout/7);
        for(var j=0;j<pageNumber;j++){
            page.innerHTML += '<a class="page" href="javascript:;" data-url="/article/searchlist-'+(j+1)+'.html">'+(j+1)+'</a>';
        }
        Z(Z('.page')[0]).addClass('on');
        page.innerHTML += '<a class="next-page" href="javascript:;">></a><a class="last-page" href="javascript:;">尾页</a>';
    };
*/

    //上一页
    Z('.prev-page').on('click',function () {
        index--;
        if(index<1) index=1;
        togglePages();
    });
    //下一页
    Z('.next-page').on('click',function () {
        if(index===0) index=1;
        index++;
        if(index>maxpage) index = maxpage;
        togglePages();
    });
    //首页
    Z('.first-page').on('click',function () {
        index = 1;
        togglePages();
    });
    //尾页
    Z('.last-page').on('click',function () {
        index = maxpage;
        togglePages();
    });
    //上一页下一页切换页面的公共代码
    function togglePages() {
        Z('.page').removeClass('on');
        Z(Z('.page')[index-1]).addClass('on');
        //点击页面中的页面按钮
        var url = '/article/list-'+index+'.html';
        Z.ajax({
            url: url,
            success: function (data) {
                var ardata = JSON.parse(data);
                var ul = document.getElementById('left-text');
                updateAjax(ul, ardata);
                Z('.page').on('click', function () {
                    Z('.page').removeClass('on');
                    Z(this).addClass('on');
                });
            }
        })
    }


})();
