window.addEventListener('load', () => {
    const nav = document.querySelector('.nav');
    const functionButtons = document.querySelector('.function').querySelectorAll('li');
    const addNewAccount = document.querySelector('.addNewAccount');
    const accounts = document.querySelector('.content-body').querySelectorAll('li');

    // 退出系统
    nav.querySelector('span').addEventListener('click', function () {
        let addressNet = location.href.substring(0, location.href.substring(0, location.href.lastIndexOf("/")).lastIndexOf("/"));
        console.log(addressNet);
        location.replace(addressNet);
        sessionStorage.removeItem('userType');
    });

    // 打开添加账户页面
    functionButtons[0].addEventListener('click', function () {
        addNewAccount.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 关闭添加账户页面
    addNewAccount.querySelector('span').addEventListener('click', function () {
        addNewAccount.style.transform = 'translate(-50%, -50%) scale(0)';
    });

    // 打开或关闭删除账户按钮
    functionButtons[1].addEventListener('click', function () {

        if (this.innerText === 'Delete Account') {
            accounts.forEach(function (element) {
                element.querySelector('span').style.display = 'block';
            });

            this.innerText = 'OK';
        } else if (this.innerText === 'OK') {
            accounts.forEach(function (element) {
                element.querySelector('span').style.display = 'none';
            });

            this.innerText = 'Delete Account';
        }
    });
    
});