(function () {
    var date1 = new Date("2018,5,1");

    var ofooterTime = document.getElementById('footer-time');
    setInterval(getTime,1000);

    function getTime() {
        var date = new Date();
        var time = date - date1;
        var day = Math.floor(time/1000/60/60/24),
            hours = format(Math.floor((time/1000/60/60)%24)),
            minutes = format(Math.floor((time/1000/60)%60)),
            seconds = format(Math.floor((time/1000)%60));
        ofooterTime.innerHTML = '' + day+'天'+ hours+'时'+minutes+'分'+seconds+'秒';
    }
    function format(n) {
        return n<10?'0'+n:n;
    }

})();