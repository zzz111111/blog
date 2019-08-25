//这里是ue编辑器自带的方法

//实例化编辑器
//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
/*
    getAllHtml()  获得整个html的内容
    getContent()  获得内容
    setContent()  写入内容
    setContent(tr
    //获得纯文本ue)  追加内容
    getContentT
    //获得带格式的纯文本xt()   获得纯文本
    getPlainTx
    判断是否有内容t() 获得带格式的纯文本
    hasContent()  判断是否有内容
    setFocus()    使编辑器获得焦点
    onmousedown="isFocus(event)   编辑器是否获得焦点
    onmousedown="setblur(event)  编辑器失去焦点

 */

(function () {
    var ue = UE.getEditor('editor');
    function isFocus(e) {
        alert(UE.getEditor('editor').isFocus());
        UE.dom.domUtils.preventDefault(e)
    }
    function setblur(e) {
        UE.getEditor('editor').blur();
        UE.dom.domUtils.preventDefault(e)
    }
    function insertHtml() {
        var value = prompt('插入html代码', '');
        UE.getEditor('editor').execCommand('insertHtml', value)
    }
    function createEditor() {
        enableBtn();
        UE.getEditor('editor');
    }
    //获得整个html的内容
    function getAllHtml() {
        return UE.getEditor('editor').getAllHtml();
    }
    //获得内容
    function getContent() {
        var arr = [];
        //arr.push("使用editor.getContent()方法可以获得编辑器的内容");
        //arr.push("内容为：");
        arr.push(UE.getEditor('editor').getContent());
        return arr.join("\n");
    }
    //获得带格式的纯文本
    function getPlainTxt() {
        var arr = [];
        arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
        arr.push("内容为：");
        arr.push(UE.getEditor('editor').getPlainTxt());
        alert(arr.join('\n'))
    }
    //写入内容   参数传true 为追加内容
    function setContent(isAppendTo) {
        var arr = [];
        arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
        UE.getEditor('editor').setContent('欢迎使用ueditor', isAppendTo);
        alert(arr.join("\n"));
    }
    function setDisabled() {
        UE.getEditor('editor').setDisabled('fullscreen');
        disableBtn("enable");
    }
    function setEnabled() {
        UE.getEditor('editor').setEnabled();
        enableBtn();
    }
    function getText() {
        //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
        var range = UE.getEditor('editor').selection.getRange();
        range.select();
        var txt = UE.getEditor('editor').selection.getText();
        alert(txt)
    }
    //获得纯文本
    function getContentTxt() {
        var arr = [];
        //arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
        //arr.push("编辑器的纯文本内容为：");
        arr.push(UE.getEditor('editor').getContentTxt());
        return arr.join("\n");
        //alert(arr.join("\n"));
    }
    //判断是否有内容
    function hasContent() {
        var arr = [];
        arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
        arr.push("判断结果为：");
        arr.push(UE.getEditor('editor').hasContents());
        alert(arr.join("\n"));
    }
    function setFocus() {
        UE.getEditor('editor').focus();
    }
    function deleteEditor() {
        disableBtn();
        UE.getEditor('editor').destroy();
    }
    function disableBtn(str) {
        var div = document.getElementById('btns');
        var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
        for (var i = 0, btn; btn = btns[i++];) {
            if (btn.id == str) {
                UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
            } else {
                btn.setAttribute("disabled", "true");
            }
        }
    }

    function enableBtn() {
        var div = document.getElementById('btns');
        var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
        for (var i = 0, btn; btn = btns[i++];) {
            UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
        }
    }



    //这里才是写的
    var oSubmit = Z('.article-submit-btn')[0],
        oUnSubmit = Z('.article-submit-btn')[1],
        articleTitle = Z('#article-title')[0],
        imgData64,
        data = {};
    var fileInput = document.getElementById('article-img_input');
    var oRight = Z('.show-img')[0];
    var oImgDrop = Z('.img-drop')[0];



    Z.addEvent(oSubmit, 'click', function () {
        data.articleTitle = articleTitle.value;
        var aAudio = document.getElementsByName('article-type');
        for (var i = 0; i < aAudio.length; i++) {
            if (aAudio[i].checked === true) {
                data.articleType = aAudio[i].value;
            }
        }
        data.articleContent = getContent();
        data.introduce = getContentTxt().slice(0, 100);
        console.log(data);

        if (data.articleTitle === '') {
            alert('文章标题不为空');
            return;
        } else if (data.articleType === undefined) {
            alert('请选择发表的文章类别');
            return;
        } else if (data.articleContent.length <= 200) {
            alert('文章的字数要大于200字');
            return;
        } else if (data.imgData64 === undefined) {
            alert('请选择上传图片');
            return;
        }
        console.log('运行到这里了吗');
        $.ajax({
            type: "post",
            url: "/article/submit",
            data: data,
            success: function (data) {
                console.log(data);
                if (data === '发表成功') {
                    alert('发表成功');
                } else {
                    console.log('发表失败');
                }
            },
            error: function (err) {
                console.log(err);
                alert('发表失败');
            }
        })
    });


    Z.addEvent(fileInput, 'change', function () {
        var oFile = this.files[0];
        showImg(oFile);
    });

    //拖拽进入目标
    oImgDrop.ondragenter = function () {
        this.innerHTML = '松开鼠标上传图片';
    };

    //可以让东西放到元素上
    oImgDrop.ondragover = function (e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
    };

    //拖拽移出目标
    oImgDrop.ondragleave = function () {
        this.innerHTML = '点击下方按钮或将图片拖拽至此处上传文章图片';
    };

    //松开鼠标
    oImgDrop.ondrop = function (e) {
        e = e || window.event;
        e.preventDefault();
        e.cancelBubble = true;
        e.stopPropagation();
        this.innerHTML = '上传成功，发表文章以保存';
        var oFile = e.dataTransfer.files[0];
        showImg(oFile);
    };

    //保存data64 并将图片渲染到页面中
    function showImg(oFile) {
        var reader = new FileReader();
        reader.readAsDataURL(oFile);
        reader.onload = function (e) {
            data.imgData64 = this.result;
        };
        var url = window.URL.createObjectURL(oFile);
        var img = new Image();
        img.src = url;
        oRight.innerHTML = '';
        oRight.appendChild(img);
    }
    
})();