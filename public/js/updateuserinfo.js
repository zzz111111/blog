(function () {
    //修改用户名的按钮
    Z('.edit-username-a').on('click',function () {
        var val = Z('.edit-new-name')[0].value;
        var data = {};
        data.value = val;
        if(val){
            Z.ajax({
                url:"/admin/updateusername",
                data:data,
                success:function (data) {
                    if(data === '成功'){
                        console.log('11111');
                        window.history.go(0);
                    }
                }
            })
        }
    });


    //修改个性签名 其他信息
    Z('#edit-submit').on('click',function () {
        var data = {};
        var sign = Z('#edit-sign')[0].value;
        var sex = document.getElementsByName('sex');
        var sexValue;
        data.sign = sign;
        for(var i=0;i<2;i++){
            if(sex[i].checked){
                if(i == 0){
                    data.sexValue = '男'
                }else if(i == 1){
                    data.sexValue = '女';
                }
            }
        }
        console.log(data);
        Z.ajax({
            url:"/admin/updateusersign",
            data:data,
            success:function (data) {
                if(data == '成功'){
                    alert('修改成功');
                    window.history.go(0);
                }
            }
        })

    })
})();




