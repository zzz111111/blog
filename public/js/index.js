//首页轮播图
(function () {
    var aPages = document.getElementsByClassName('page');
    var orightBtn = document.getElementById('right-btn');
    var oleftBtn = document.getElementById('left-btn');
    var aBottomBtn = Z('.bottom-btn')[0].getElementsByTagName('li');
    var aBottomBtnLength = aBottomBtn.length;
    var pageArr = ['0%','20%','40%','60%','80%','100%'];
    var index = 0;

    //右按钮点击
    Z.addEvent(orightBtn,'click',function () {
        aPages[index].style.display = 'none';
        aBottomBtn[index].className = '';
        index++;
        if(index === 4){
            orightBtn.style.display = 'none';
        }else{
            orightBtn.style.display = 'block';
        }
        aPages[index].style.display = 'block';
        aBottomBtn[index].className = 'on';
        oleftBtn.style.display = index>0?'block':'none';
        document.body.style.backgroundPosition = pageArr[index]+ ' 0';
    });


    //左按钮点击
    Z.addEvent(oleftBtn,'click',function () {
        aPages[index].style.display = 'none';
        aBottomBtn[index].className = '';
        index--;
        if(index === 0){
            oleftBtn.style.display = 'none';
        }else{
            oleftBtn.style.display = 'block';
        }
        aPages[index].style.display = 'block';
        aBottomBtn[index].className = 'on';
        orightBtn.style.display = index===4?'none':'block';
        document.body.style.backgroundPosition = pageArr[index]+ ' 0';
    });


    //点击下面的按钮
    for(var i=0;i<aBottomBtnLength;i++){
        aBottomBtn[i].index = i;
        Z.addEvent(aBottomBtn[i],'click',function () {
            aPages[index].style.display = 'none';
            aBottomBtn[index].className = '';
            index = this.index;
            if(index === 4){
                orightBtn.style.display = 'none';
            }else{
                orightBtn.style.display = 'block';
            }
            aPages[index].style.display = 'block';
            aBottomBtn[index].className = 'on';
            oleftBtn.style.display = index>0?'block':'none';
            document.body.style.backgroundPosition = pageArr[index]+ ' 0';
        });
    }

    // window.onload = function(){
    //     console.log('页面加载结果');
    //     Z.message.success('注册成功');
    //     // Z.message.wran();
    //     // Z.message.error();
    // };


})();









