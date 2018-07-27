/*
*   eFn  第一个参数   事件对象
*        第二个参数   滚动方向
*        阻止默认行为 ： 在eFn里面return false即可
*
*
* */
function mousewheel(obj,eFn) {
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
}