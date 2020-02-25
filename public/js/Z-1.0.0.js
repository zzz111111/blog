/*
*      Create time 2018/5/13
*       类jQ的插件
*       author Z
* */

(function () {
    var Z = function (param) {
        var typePa = (typeof param).toLowerCase();
        if(typePa === 'function'){
            window.onload = param;
        }else if(typePa === 'string' || typePa === 'object'){
            return new Init(param);
        }
    };

    //jQ对象拓展
    Z.fn = {};
    Z.fn.extend = function (json) {
        for(var key in json){
            Init.prototype[key] = json[key];
        }
    };

    //jQ对象
    function Init(param) {
        this.length = this.init(param);
    };

    Init.prototype = {
        //init 方法 获取对应的JS对象
        init:function (param) {
            var typePara = (typeof param).toLowerCase();
            var arr = [];
            var paramLength = param.length;
            if( typePara === 'object'){
                if(param === window || param.nodeType){  //param 是单一对象
                    arr[0] = param;
                }else{ //param 是类数组
                    for(var i=0;i<paramLength;i++){
                        arr[i] = param[i];
                    }
                }
            }else if(typePara === 'string'){
                var paraArr = param.split(' ');
                var paraArrLength = paraArr.length;
                var index = 0;

                arr = search(paraArr[0],[document]);
                
                function search(str,parentArr) {
                    var arr = [];
                    var parentArrLength = parentArr.length;
                    for(var i=0;i<parentArrLength;i++){
                        arr = arr.concat(getElements(str,parentArr[i]));
                    }
                    return (index === paraArrLength-1)?arr:search(paraArr[++index],arr);
                }
                
                function getElements(param,parent) {
                    var endArr = [];
                    if(/\#/.test(param)){ //id方法
                        var reg = /#/;
                        endArr[0] = document.getElementById(param.replace(reg,''));
                    }else if(/\./.test(param)){

                        var classN = param.replace(/./,'');
                        if(parent.getElementsByClassName){  //class方法
                            var aClassEle = parent.getElementsByClassName(classN);
                            var aClassEleLength = aClassEle.length;
                            for(var i=0;i<aClassEleLength;i++){
                                endArr[i] = aClassEle[i];
                            }
                        }else{
                            var allEle = parent.getElementsByTagName('*');  //兼容ie的class
                            var allEleLength = allEle.length;
                            var classReg = new RegExp('(^|\\s)'+classN+'(\\s|$)');
                            for(var i=0;i<allEleLength;i++){
                                if(classReg.test(allEle[i].className)){
                                    endArr.push(allEle[i]);
                                }
                            }
                        }
                    }else{ //tag方法

                        var a = parent.getElementsByTagName(param);
                        var aLength = a.length;
                        for(var i=0;i<aLength;i++){
                            endArr[i] = a[i];
                        }
                    }
                    return endArr;
                }
            }

            var arrLength = arr.length;
            for(var j=0;j<arrLength;j++){
                this[j] = arr[j];
            }
            return arr.length;
        },

        //遍历
        each:function (param) {
            var length = this.length;
            for(var i=0;i<length;i++){
                param.call(this[i],i);
            }
        },

        //返回对应的js对象
        get:function (param) {
            return this[param];
        },

        //返回对应的js对象个数
        size:function () {
            return this.length;
        },

        //序列号
        index:function (param) {
            var typePa = (typeof param).toLowerCase();
            if(typePa === 'undefined'){
                var siblings = this[0].parentNode.children;
                var siblingsLength = siblings.length;
                for(var i=0;i<siblingsLength;i++){
                    if(siblings[i] === this[0]){
                        return i;
                    }
                }
            }else if(typePa === 'string'){
                var parent = this[0].parentNode;
                var allE = parent.getElementsByTagName(param);

                var allELength = allE.length;
                for(var i=0;i<allELength;i++){
                    if(allE[i] === this[0]){
                        return i;
                    }
                }
            }
        },

        //eq返回对应的jQ对象
        eq:function (para) {
            return new Init(this[para]);
        },

        //看有没有class名(传的class名不带.)
        hasClass:function (param) {
            var has = false;
            var reg = new RegExp('(^|\\s)'+param+('\\s|$'));
            this.each(function () {
                if(reg.test(this.className)){
                    has = true;
                }
            });
            return has;
        },

        //children 返回满足条件的子元素
        children:function (param) {
            var arr = [];
            if(param){ //有参数
                var f = param[0];
                var reg = /[#\.]/g;
                param = param.replace(reg,'');
                var str = '';
                if(f === '#'){
                    str = 'id'
                }else if(f === '.'){
                    str = 'className';
                }else{
                    str = 'nodeName'
                };
                this.each(function () {
                    var child = this.children;
                    var childLength = child.length;
                    var reg1 = new RegExp('(^|\\s)'+param+'(\\s|$)');
                    for(var i=0;i<childLength;i++){
                        if(str === 'className'){
                            if(reg1.test(child[i].className)){
                                arr.push(child[i]);
                            }
                        }else if(str === 'id'){
                            arr.push(document.getElementById(param));
                        }else if(str === 'nodeName'){
                            for(var i=0;i<childLength;i++){
                                if(child[i].nodeName.toLowerCase() === param){
                                    arr.push(child[i]);
                                }
                            }
                        }
                    }
                })
            }else{  //没有参数
                this.each(function () {
                    var child = this.children;
                    var childLength = child.length;
                    for(var i=0;i<childLength;i++){
                        arr.push(child[i]);
                    }
                })
            }
            return new Init(arr);
        },

        //寻找后代满足条件的元素
        find:function (para) {
            var arr = [];
            var paraArr = para.split(' ');
            var paraArrLength = paraArr.length;
            var index = 0;

            arr = search(paraArr[0],this);

            return new Init(arr);

            function search(str,parentArr) {
                var arr = [];
                var parentArrLength = parentArr.length;
                for(var i=0;i<parentArrLength;i++){
                    arr = arr.concat(getElements(str,parentArr[i]));
                }
                return (index === paraArrLength-1)?arr:search(paraArr[++index],arr);
            }

            function getElements(param,parent) {
                var endArr = [];
                if(/\#/.test(param)){ //id方法
                    var reg = /#/;
                    endArr[0] = document.getElementById(param.replace(reg,''));
                }else if(/\./.test(param)){

                    var classN = param.replace(/./,'');
                    if(parent.getElementsByClassName){  //class方法
                        var aClassEle = parent.getElementsByClassName(classN);
                        var aClassEleLength = aClassEle.length;
                        for(var i=0;i<aClassEleLength;i++){
                            endArr[i] = aClassEle[i];
                        }
                    }else{
                        var allEle = parent.getElementsByTagName('*');  //兼容ie的class
                        var allEleLength = allEle.length;
                        var classReg = new RegExp('(^|\\s)'+classN+'(\\s|$)');
                        for(var i=0;i<allEleLength;i++){
                            if(classReg.test(allEle[i].className)){
                                endArr.push(allEle[i]);
                            }
                        }
                    }
                }else{ //tag方法
                    var a = parent.getElementsByTagName(param);
                    var aLength = a.length;
                    for(var i=0;i<aLength;i++){
                        endArr[i] = a[i];
                    }
                }
                return endArr;
            }

        },

        // 父级元素
        parent:function () {
            var arr = [];
            this.each(function () {
                arr.push( this.parentNode );
            });
            return new Init(arr);
        },

        // 返回所有的父元素 最好写一个
        parents:function () {
            var arr = [];
            var html = document.documentElement;
            this.each(function () {
                var parent = this;
                for(;parent!==html;){
                    parent = parent.parentNode;
                    arr.push(parent);
                }
            });
            return new Init(arr);
        },

        //
        siblings:function (para) {
            var arr = [];
            if(para){
                
                var f = para[0];
                var reg = /[#\.]/g;
                para = para.replace(reg,'');
                
                if(f === '#'){
                    this.each(function () {
                        var sib = this.parentNode.children;
                        var sibLength = sib.length;
                        
                        for(var i=0;i<sibLength;i++){
                            if(sib[i] !== this && sib[i].id === para){
                                arr.push(sib[i]);
                            }
                        }
                    })
                }else if(f === '.'){  //class
                    this.each(function () {
                        var sib = this.parentNode.children;
                        var sibLength = sib.length;
                        var reg = new RegExp('(\\s|^)'+para+'(\\s|$)');
                        for(var i=0;i<sibLength;i++){
                            if(sib[i] !== this && reg.test(sib[i].className)){
                                arr.push(sib[i]);
                            }
                        }
                    })
                }else{  //nodeName
                    this.each(function () {
                        var sib = this.parentNode.children;
                        var sibLength = sib.length;
                        for(var i=0;i<sibLength;i++){
                            if(sib[i] !== this && sib[i].nodeName.toLowerCase() === para){
                                arr.push(sib[i]);
                            }
                        }
                    })
                }


            }else{
                this.each(function () {
                    var sib = this.parentNode.children;
                    var sibLength = sib.length;
                    for(var i=0;i<sibLength;i++){
                        if(sib[i] !== this){
                            arr.push(sib[i]);
                        }
                    }
                })
            }
            return new Init(arr);
        },

        //事件
        click:function (para) {
            this.each(function () {
                this.onclick = para;

            })
        },

        //添加事件
        on:function(type,eFn){
            this.each(function () {
                if(!-[1,]){
                    this.attachEvent('on'+type,eFn);
                }else{
                    this.addEventListener(type,eFn);
                }
            })
        },
        off:function(type,eFn){
              this.each(function () {
                  if(!-[1,]){
                      this.detachEvent('on'+type,fn);
                  }else{
                      this.removeEventListener(type,fn);
                  }
              })
        },

        //hover
        hover:function () {
            var argu = arguments;
            var arguLength = arguments.length;
            if(arguLength === 1){
                this.each(function () {
                    this.onmouseenter = argu[0];
                })
            }else if(arguLength === 2){
                this.each(function () {
                    this.onmouseenter = argu[0];
                    this.onmouseleave = argu[1];
                })
            }
            return this;
        },

        //css
        css:function () {
            var argu = arguments;
            var typeArgu = (typeof argu[0]).toLowerCase();
            if(argu.length === 2){
                this.each(function () {
                    this.style[argu[0]] = argu[1];
                })
            }else if(typeArgu === 'string'){
                return this[0].currentStyle?this[0].currentStyle[argu[0]]:getComputedStyle(this[0])[argu[0]];
            }else if(typeArgu === 'object'){
                this.each(function () {
                    for(var key in argu[0]){
                        this.style[key] = argu[0][key];
                    }
                })
            }
            return this;
        },

        //对象到文档top  left距离
        offset:function () {
            var obj = {
                top:0,
                left:0
            };
            var oDomObj = this[0];
            while(oDomObj !== document.body){
                obj.top += oDomObj.offsetTop;
                obj.left += oDomObj.offsetLeft;
                oDomObj = oDomObj.parentNode;
            }
            return obj;
        },

        //对象到定位父级 top left距离
        position:function () {
            var obj = {
                top:this[0].offsetTop,
                left:this[0].offsetLeft
            };
            return obj;
        },

        //元素滚动高度 top
        scrollTop:function (para) {
            if(para){
                this.each(function () {
                    if(this === document){
                        document.documentElement.scrollTop = para;
                        document.body.scrollTop = para;
                    }else{
                        this.scrollTop = para;
                    }
                })
            }else{
                if(this[0] === document){
                    return document.documentElement.scrollTop || document.body.scrollTop;
                }else{
                    return this[0].scrollTop;
                }
            }
        },

        //元素滚动距离左边
        scrollLeft:function (para) {
            if(para){
                this.each(function () {
                    if(this === document){
                        document.documentElement.scrollLeft = para;
                        document.body.scrollLeft = para;
                    }else{
                        this.scrollTop = para;
                    }
                })
            }else{
                if(this[0] === document){
                    return document.documentElement.scrollLeft || document.body.scrollLeft;
                }else{
                    return this[0].scrollLeft;
                }
            }
        },

        //计算宽高度
        width:function (para) {
            if(para){
                if(parseInt(para) === para){
                    para += 'px';
                }
                this.each(function () {
                    this.css('width',para);
                })
            }else{
                return parseInt(this.css('width'));
            }
        },

        height:function (para) {
            if(para){
                if(parseInt(para) === para){
                    para += 'px';
                }
                this.each(function () {
                    this.css('height',para);
                })
            }else{
                return parseInt(this.css('height'));
            }
        },

        //padding + 计算宽高
        innerWidth:function () {
            return this[0].clientWidth;
        },

        innerHeight:function () {
            return this[0].clientHeight;
        },

        //padding + border + width/height
        outerWidth:function () {
            return this[0].offsetWidth;
        },

        outerHeight:function () {
            return this[0].offsetHeight;
        },

        //添加/获取html代码
        html:function (para) {
            if(para){
                this.each(function () {
                    this.innerHTML = para;
                })
            }else{
                return this[0].innerHTML;
            }
        },

        //添加 获取 text代码
        text:function (para) {
            if(para){
                this.each(function () {
                    this.innerText = para;
                })
            }else{
                return this[0].innerText;
            }
        },

        //添加类名
        addClass:function (para) {
            var paraArr = para.split(' ');
            var paraLength = paraArr.length;
            this.each(function () {
                for(var i=0;i<paraLength;i++){
                    var thisCName = this.className;
                    var reg = new RegExp('\\b'+paraArr[i]+'\\b');
                    var a = '';
                    if(!reg.test(thisCName)){
                        this.className?this.className +=' '+paraArr[i]:this.className += paraArr[i];
                        if(i === paraLength-1){
                            var reg1 = /^\s+/;
                            var reg2 = /\s{2,}/g;
                            var reg3 = /\s+$/;
                            this.className = this.className.replace(reg1,'').replace(reg2,' ').replace(reg3,'');
                        }
                    }
                }
            });
            return this;
        },

        //移除类名
        removeClass:function (para) {
            var paraArr = para.split(' ');
            var paraArrLength = para.length;
            this.each(function () {
                for(var i=0;i<paraArrLength;i++){
                    var thisCName = this.className;
                    var reg = new RegExp('\\b'+paraArr[i]+'\\b');
                    var a = thisCName.replace(reg,'');
                    var reg1 = /^\s+/;
                    var reg2 = /\s{2,}/g;
                    var reg3 = /\s+$/;
                    this.className = a.replace(reg1,'').replace(reg2,' ').replace(reg3,'');
                }
            });
            return this;
        },

        //切换类名
        toggleClass:function (para) {
            var paraArr = para.split(' ');
            var paraArrLength = paraArr.length;
            this.each(function () {
                for(var i=0;i<paraArrLength;i++){
                    var thisCName = this.className;
                    var reg = new RegExp('\\b'+paraArr[i]+'\\b');
                    if(reg.test(thisCName)){
                        //有类名的话
                        var a = this.className.replace(reg,'');
                        var reg1 = /^\s/;
                        var reg2 = /\s{2,}/g;
                        var reg3 = /\s$/;
                        this.className = a.replace(reg1,'').replace(reg2,' ').replace(reg3,'');
                    }else{
                        //没有类名
                        this.className?this.className+= ' '+paraArr[i]:this.className = para[i];
                    }
                }
            });
            return this;
        },

        //attr 获取/设置属性
        attr:function () {
            var argu = arguments;
            var typeArgu = (typeof argu[0]).toLowerCase();
            if(argu.length === 2){
                this.each(function () {
                    this.setAttribute(argu[0],argu[1]);
                });
            }else if(typeArgu === 'string'){
                return this[0].getAttribute(argu[0]);
            }else if(typeArgu === 'object'){
                this.each(function () {
                    for(var key in argu[0]){
                        this.setAttribute(key,argu[0][key]);
                    }
                });
            }
            return this;
        },

        //删除标签属性
        removeAttr:function (para) {
            this.each(function () {
                this.removeAttribute(para)
            });
            return this;
        },

        //获取值 val
        val:function (para) {
            if(para !== undefined){
                this.each(function () {
                    this.value = para;
                });
                return this;
            }else{
                return this[0].value;
            }
        },

        //显示 隐藏
        show:function () {
            var argu = arguments;
            var arguLength = argu.length;
            if(arguLength){
                var time,
                    callback;
                for(var i=0;i<arguLength;i++){
                    if((typeof argu[i]).toLowerCase() === 'number'){
                        time = argu[i];
                    }else if((typeof argu[i]).toLowerCase() === 'string'){
                        switch (arg[i]){
                            case 'slow' :
                                time = 800;
                                break;
                            case 'normal' :
                                time = 600;
                                break;
                            case 'fast' :
                                time = 400;
                                break;
                        }
                    }else if((typeof argu[i]).toLowerCase() === 'function'){
                        callback = argu[i];
                    }
                };
                time = time || 400;
                this.each(function () {
                    var disp = Z(this).css('display');
                    if(disp === 'none'){
                        var endWidth = Z(this).width();
                        var endHeight = Z(this).height();
                        var endOpacity = 1;
                        var that = this;
                        
                        var startWidth = 0,
                            startHeight = 0,
                            startOpacity = 0,
                            startTime = new Date();
                        this.style.display = 'block';
                        this.style.width = '0px';
                        this.style.height = '0px';
                        this.style.opacity = 0;
                        this.style.filter = 'alpha(opacity = 0)';

                        var timer = setInterval(function () {
                            a.call(that)
                        },13);
                        function a() {
                            var nowTime = new Date();
                            var bili = (nowTime - startTime)/time;
                            if(bili>=1){
                                bili = 1;
                                clearInterval(timer);
                                callback && callback();
                                this.style.overflow = '';
                            }
                            this.style.width = endWidth*bili + 'px';
                            this.style.height = endHeight*bili + 'px';
                            this.style.opacity = endOpacity*bili;
                            this.style.filter = 'alpha(opacity='+100*endOpacity*bili+')';
                        }

                    }
                })
            }else{
                this.each(function () {
                    this.style.diaplay = 'block';
                })
            };
            return this;
        },
        
        //隐藏 
        hide:function () {
            var argu = arguments;
            var arguLength = argu.length;
            if(arguLength){
                var time,
                    callback;
                for(var i=0;i<arguLength;i++){
                    if((typeof argu[i]).toLowerCase() === 'number'){
                        time = argu[i];
                    }else if((typeof argu[i]).toLowerCase() === 'function'){
                        callback = argu[i];
                    }
                };
                time = time || 400;
                this.each(function () {
                    var disp = Z(this).css('display');
                    if(disp === 'block'){
                        var startWidth = Z(this).width();
                        var startHeight = Z(this).height();
                        var startOpacity = Z(this).css('opacity');
                        var that = this;
                        var endWidth = 0,
                            endHeight = 0,
                            endOpacity = 0,
                            startTime = new Date();
                        startOpacity = startOpacity || 1;
                        this.style.width = startWidth + 'px';
                        this.style.height = startHeight + 'px';
                        this.style.opacity = startOpacity;
                        this.style.filter = 'alpha(opacity='+startOpacity*100+')';
                        var timer = setInterval(function () {
                            a.call(that)
                        },13);
                        function a() {
                            var nowTime = new Date();
                            var bili = 1 - (nowTime - startTime)/time;
                            if(bili < 0){
                                bili = 0;
                                clearInterval(timer);
                                callback && callback();
                                this.style.display = 'none';
                            }
                            this.style.width = startWidth*bili + 'px';
                            this.style.height = startHeight*bili + 'px';
                            this.style.opacity = startOpacity*bili;
                            this.style.filter = 'alpha(opacity='+100*startOpacity*bili+')';
                        }
                    }
                })
            }else{
                this.each(function () {
                    this.style.diaplay = 'none';
                })
            };
            return this;
        },

        toggle:function () {
            var argu = arguments;
            var arguLength = argu.length;
            if(arguLength){
                var time,
                    callback;
                for(var i=0;i<arguLength;i++){
                    if((typeof argu[i]).toLowerCase() === 'number'){
                        time = argu[i];
                    }else if((typeof argu[i]).toLowerCase() === 'function'){
                        callback = argu[i];
                    }
                };
                time = time || 400;
                var disp = Z(this).css('display');
                if(disp === 'none'){
                    Z(this).show(time,callback)
                }else{
                    Z(this).hide(time,callback);
                }
            }else{
                this.each(function () {
                    var disp = Z(this).css('display');
                    this.style.display = disp==='none'?'block':'none';
                })
            }
            return this;
        },
        
        //淡入
        fadeIn:function () {
            var argu = arguments;
            var time,
                callback;
            //参数的几种情况
            //只有数字 只有那个形容词 只有函数 数字/形容词和那个回调函数
            for(var i=0;i<argu.length;i++){
                var t = (typeof argu[i]);
                switch(t){
                    case "number":
                        time = argu[i];
                        break;
                    case "function":
                        callback = argu[i];
                        break;
                    case "string":
                        switch(argu[0]){
                            case "slow":
                                time = 800;
                                break;
                            case "normal":
                                time = 600;
                                break;
                            case "fast":
                                time = 400;
                                break;
                        }
                        break;

                }
            }
            time = time || 400;
            this.each(function () {
                var endVal = getStyle(this,'opacity');
                if(endVal === undefined){
                    endVal = getStyle(this,'filter').replace(/\D+/g,'')/100;
                }
                var startVal = 0;
                var startTime = new Date();
                var that = this;

                this.style.display = 'block';

                var timer = setInterval(function () {
                    a.call(that);
                },13);

                function a() {
                    var nowTime = new Date();
                    var bili = (nowTime - startTime)/time;

                    if(bili>=1){
                        bili = 1;
                        clearInterval(timer);
                        callback && callback();
                    }
                    that.style.opacity = (bili * endVal);
                    that.style.filter = 'alpha(opacity='+(bili * endVal)*100+')';
                }
            });
            function getStyle(obj,attr) {
                return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
            }
            return this;
        },

        //淡出
        fadeOut : function () {
            var argu = arguments;
            var time, callback;
            for(var i=0;i<argu.length;i++){
                var t = (typeof argu[i]);
                switch(t){
                    case 'number':
                        time = argu[i];
                        break;
                    case 'function':
                        callback = argu[i];
                        break;
                    case 'string':
                        switch(argu[0]){
                            case 'slow':
                                time = 800;
                                break;
                            case 'normal':
                                time = 600;
                                break;
                            case 'fast':
                                time = 400;
                                break;
                        }
                        break;
                }
            }
            time = time || 400;
            this.each(function () {
                var startVal = getStyle(this,'opacity');
                if(startVal === undefined){
                    startVal = getStyle(this,'filter').replace(/\D+/g,'')/100;
                }
                var endVal = 0;
                var startTime = new Date();
                var that = this;

                this.style.display = 'block';

                var timer = setInterval(function () {
                    a.call(that);
                },13);

                function a() {
                    var nowTime = new Date();
                    var bili = (nowTime - startTime)/time;

                    if(bili>=1){
                        bili = 1;
                        clearInterval(timer);
                        callback && callback();
                    }
                    that.style.opacity = ((1-bili) * startVal);
                    that.style.filter = 'alpha(opacity='+((1-bili) * startVal)*100+')';
                }
            });
            function getStyle(obj,attr) {
                return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
            }
            return this;
        },

        //fadeToggle   淡入淡出切换
        fadeToggle : function () {
            var arg = arguments;
            var argLength = arg.length;
            var time,
                callback;

            for(var i=0;i<argLength;i++){
                var typeArg = (typeof arg[i]).toLowerCase();
                if(typeArg=== 'number'){
                    time = arg[i];
                }else if(typeArg === 'string'){
                    switch (arg[i]){
                        case 'slow' :
                            time = 800;
                            break;
                        case 'normal' :
                            time = 600;
                            break;
                        case 'fast' :
                            time = 400;
                            break;
                    }
                }else if(typeArg === 'function'){
                    callback = arg[i];
                }
            }
            time = time || 400;

            this.each(function () {
                var startVal = Number(getStyle(this,'opacity'));
                if(startVal === undefined){
                    startVal = getStyle(this,'filter').replace(/\D+/g,'') / 100;
                }
                var disp = getStyle(this,'display');
                var endVal;
                if(startVal === 0 || disp === 'none'){
                    Z(this).fadeIn(time,callback);
                }else{
                    Z(this).fadeOut(time,callback);
                }
            });
            function getStyle(obj,attr) {
                return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
            }
            return this;

        },

        //slideDown 高度隐藏
        slideDown:function () {
            var argu = arguments;
            var arguLength = argu.length;
            var time,
                callback;
            for(var i=0;i<arguLength;i++){
                var typeArgu = (typeof argu[i]).toLowerCase();
                switch(typeArgu){
                    case "number":
                        time = argu[i];
                        break;
                    case "function":
                        callback = argu[i];
                        break;
                }
            }
            time = time || 400;
            this.each(function () {
                var startTime = new Date();
                var startHeight = parseInt(Z(this).css('height'));
                this.style.display = 'block';
                var that = this;
                var timer = setInterval(function () {
                    var nowTime = new Date();
                    var bili = (nowTime - startTime)/time;

                    if(bili > 1){
                        bili = 1;
                        clearInterval(timer);
                        callback && callback();
                    }
                    that.style.height = bili*startHeight + 'px';
                },13)
            })
        },

        //高度隐藏
        slideUp:function () {
            var argu = arguments;
            var arguLength = argu.length;
            var time,
                callback;
            for(var i=0;i<arguLength;i++){
                var typeArgu = (typeof argu[i]).toLowerCase();
                switch(typeArgu){
                    case "number":
                        time = argu[i];
                        break;
                    case "function":
                        callback = argu[i];
                        break;
                }
            }
            time = time || 400;
            this.each(function () {
                var startTime = new Date();
                var startHeight = parseInt(Z(this).css('height'));
                this.style.display = 'block';
                var that = this;
                var timer = setInterval(function () {
                    var nowTime = new Date();
                    var bili = (nowTime - startTime)/time;

                    if(bili > 1){
                        bili = 1;
                        clearInterval(timer);
                        callback && callback();
                    }
                    that.style.height = (1-bili)*startHeight + 'px';
                },13)
            })
        },

        //slideToggle
        slideToggle:function(){
            var arg = arguments;
            var time, callback;
            var argLength = arg.length;
            for(var i=0;i<argLength;i++){
                var typeArg = (typeof arg[i]).toLowerCase();
                switch(typeArg){
                    case 'number':
                        time = arg[i];
                        break;
                    case 'function':
                        callback = arg[i];
                        break;
                }
            }
            time = time || 400;
            if(arg.length){
                this.each(function () {
                    var disp = Z(this).css('display');
                    if(disp === 'none'){
                        Z(this).slideDown(time,callback);
                    }else{
                        Z(this).slideUp(time,callback);
                    }
                })
            }else{
                this.each(function () {
                    var disp = Z(this).css('display');
                    if(disp === 'none'){
                        Z(this).slideDown(time,callback);

                    }else{
                        Z(this).slideUp(time,callback);
                    }
                })
            }
        },

        //animation 动画
        animation:function () {
            var argu = arguments;
            var arguLength = argu.length;
            var json = argu[0];
            var time,
                callback,
                easing;
            this.each(function () {
                for(var i=1;i<arguLength;i++){
                    var typeArgu = (typeof argu[i]).toLowerCase();
                    switch(typeArgu){
                        case "string":
                            easing = argu[i];
                            break;
                        case "number":
                            time = argu[i];
                            break;
                        case "function":
                            callback = argu[i];
                            break;
                    }
                }
                time = time || 300;
                var startVal = {},
                    endVal = {};
                var that = this;
                for(var key in json){
                    endVal[key] = parseFloat(json[key]);
                    startVal[key] = parseFloat(getStyle(this,key));
                }
                var startTime = new Date();
                var timer = setInterval(function () {
                    var nowTime = new Date();
                    var bili = (nowTime - startTime)/time;
                    if(bili > 1){
                        bili = 1;
                        clearInterval(timer);
                        callback && callback();
                    }
                    for(var key in json){
                        if(key.toLowerCase() === 'opacity'){
                            that.style[key] = startVal[key] + (endVal[key] - startVal[key])*bili;
                            that.style.filter = 'alpha(opacity='+(startVal[key] + (endVal[key]-startVal[key])*bili)*100+');'
                        }
                        that.style[key] = startVal[key] + (endVal[key] - startVal[key])*bili + 'px';
                    }
                },13);
            });


            function getStyle(obj,attr) {
                return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
            }
        }



    };



    //Z对象上的方法
    //为js对象添加事件
    //对象 事件(不带on) 事件函数
    Z.addEvent = function(obj,type,fn) {
        if(!-[1,]){
            obj.attachEvent('on'+type,fn);
        }else{
            obj.addEventListener(type,fn);
        }
    };
    //为js对象解绑事件
    Z.removeEvent = function (obj,type,fn) {
        if(!-[1,]){
            obj.detachEvent('on'+type,fn);
        }else{
            obj.removeEventListener(type,fn);
        }
    };

    //cookie的封装
    /*
        封装cookie
        setCookie(属性名，值，过期时间); //过期时间以年为单位
        getCookie(属性名)
        removeCookie(属性名)
    */
    Z.cookie = {
        setCookie:function (json,time) {
            var timer = new Date(Date.now() + time*365*24*60*60*1000).toUTCString();
            for(var key in json){
                document.cookie = key+'='+json[key]+';expires='+timer;
            }
        },
        getCookie:function (attr) {
            var arr = document.cookie.match( new RegExp('\\b'+attr+'=([^;]+)(;|$)') );
            return arr?arr[1]:"";
        },
        removeCookie:function (attr) {
            var json = {};
            json[attr] = '';
            Z.cookie.setCookie(json,-1);
        }
    };

    //滚轮事件
        /*
        *   eFn     第一个参数  滚动方向
        *           第二个     事件对象
        *           阻止默认行为：在eFn里return false即可!
        * */
    Z.mousewheel = function(obj,eFn){
        //这才是真正的事件函数
        function fn1(e) {
            e = e || window.event;
            var dir = e.wheelDelta / 120 || -e.detail / 30;  //滚动方向  向上滚1  向下滚-1
            if (eFn.call(this, e, dir) === false) {//this-->obj
                if (!-[1,]) {
                    e.returnValue = false;
                } else {
                    e.preventDefault();
                }
            }
        }
        if (obj.onmousewheel === null) {
            var type = 'mousewheel';
        } else {
            type = 'DOMMouseScroll';
        }

        if (!-[1,]) {
            obj.attachEvent('on' + type, fn1)
        } else {
            obj.addEventListener(type, fn1);
        }
    };


    //ajax
    /*
    *   参数：
    *       type ： string类型   请求的方式     默认get
    *       url ： string类型    接口           必填
    *       aysn： boolean类型   是否异步       默认异步
    *       data： json          发送的数据     可选
    *       success:  function   成功回调函数     可选
    *       error：   function   失败回调函数    可选
    * */

    Z.ajax = function (obj) {
        var type = obj.type||"GET",
            url = obj.url,
            aysn = obj.aysn!==false,
            data = obj.data,
            success = obj.success,
            error = obj.error;
        //确实是否有数据，有就处理，没有则过
        if(data){
            data = (function () {
                var str = "";
                for (var key in data){
                    str += key + "=" + data[key] + "&"
                }
                return str;
            })()
        }
        //解决缓存问题   // "get"
        if(/get/i.test(type)){
            url+= "?"+ (data||"") + "t_="+ Date.now(); // ?t_=12315646597
        }

        var xhr = new XMLHttpRequest();
        xhr.open(type,url,aysn);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(data||null);
        xhr.onreadystatechange=function () {
            if(xhr.readyState===4){
                if(xhr.status>=200&&xhr.status<300||xhr.status===304){
                    success && success(xhr.responseText)
                }else{
                    error && error(xhr.status)
                }
            }
        }
    };

    /**
     * 2019-9-4加入弹出层效果
     */
    // Z.message = {};
    // Z.message.success = function(msg){
    //     console.log('成功弹出层');
    //     console.log(msg);
    //     var oDom = document.getElementById('#success');
    //     console.log(oDom)
    //     // 如果dom不存在创建一个dom元素
    //     if(!oDom){
    //         var oDiv = document.createElement('div');
    //         oDiv.id = 'success';
    //         console.log(oDiv);
    //     }
    // };

    // Z.message.error = function(){
    //     console.log('失败弹出层');

    // };

    // Z.message.wran = function(){
    //     console.log('警告弹出层');
    // };

    window.Z = Z;

})();