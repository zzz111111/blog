(function () {
    //验证的正则表达式
    var reg = {
        "user": /^.{1,8}$/,
        "email": /^[1-9A-Za-z]\w{5,19}@[1-9a-z]{2,7}\.[a-z]{2,5}$/,
        "password": /^[\w!@#$%^&*()_+\-=/{}\[\]:";',.\/]{6,20}$/
    };

    var oReg = document.getElementById('reg'),
        aInput = oReg.getElementsByTagName('input'),
        aInputLength = aInput.length,
        aErrorInfo = oReg.getElementsByClassName('err-info'),
        passwordInput = document.getElementById('password1'),
        oRegBtn = document.getElementById('reg-btn'),
        errCount = document.getElementsByClassName('show'),
        oSameuser = Z('.sameuser')[0],
        isSameUser;


    for (var i = 0; i < aInputLength; i++) {
        aInput[i].index = i;
        Z.addEvent(aInput[i], 'input', function () {
            var type = this.name;
            if (type === 'password2') {
                //第二次输入密码
                if (passwordInput.value === this.value) {
                    //两次密码一致
                    aErrorInfo[this.index].className = 'reg-details err-info hide';
                } else {
                    //两次密码不一致
                    aErrorInfo[this.index].className = 'reg-details err-info show';
                }
            } else {
                //其他的表单验证
                if (reg[type].test(this.value)) {
                    //成立
                    aErrorInfo[this.index].className = 'reg-details err-info hide';
                } else {
                    //不成立
                    aErrorInfo[this.index].className = 'reg-details err-info show';
                }
            }
            if (this.value === '') {
                aErrorInfo[this.index].className = 'reg-details err-info hide';
            }
        });
    }
    //检查是否有相同的用户名
    Z.addEvent(aInput[1], 'blur', function () {
        if (reg.email.test(this.value)) {
            //符合条件吗
            Z.ajax({
                url: "/admin/checksameuser",
                data: {
                    email: this.value
                },
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.status === 200) {
                        isSameUser = false;
                        Z(oSameuser).removeClass('show').addClass('hide');
                    } else if (data.status === 400) {
                        isSameUser = true;
                        Z(oSameuser).removeClass('hide').addClass('show');
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        } else {
            //不符合条件
            console.log('不符合条件');
        }
    });


    Z.addEvent(oRegBtn, 'click', function () {
        for (var i = 0; i < aInputLength; i++) {
            if (aInput[i].value === '') {
                alert('部分内容没有填写，请把信息填写完成再注册');
                return;
            }
        }
        if (isSameUser === true) {
            alert('用户名已经存在，请修改');
            return;
        }
        if (errCount.length === 0) {
            var data = {};
            data.username = aInput[0].value;
            data.email = aInput[1].value;
            data.password = aInput[2].value;
            Z.ajax({
                type: "post",
                url: "/admin/reguser",
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.status === 200) {
                        alert('注册成功');
                        // 这里返回上一页吧
                        window.history.go(-1);
                    } else if (data.status === 400) {
                        alert('邮箱已被注册');
                    } else if (data.status === 500) {
                        alert('服务繁忙，请稍后再试');
                    } else {
                        alert('注册失败，错误码: ' + data.status);
                    }
                },
                error: function (err) {
                    console.log(err);
                    alert('服务繁忙，请稍后再试');
                }
            })
        } else {
            alert('有信息框还不满足条件，请继续填写')
        }
    })
})();
