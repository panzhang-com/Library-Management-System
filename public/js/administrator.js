window.addEventListener('load', () => {
    // 导航栏元素
    const nav = document.querySelector('.nav');
    // 功能区按钮元素数组
    const functionButtons = document.querySelector('.function').querySelectorAll('li');
    // 添加新账户的页面元素
    const addNewAccount = document.querySelector('.addNewAccount');
    // 加载logo
    const loadlogo = document.querySelector('.loadlogo');
    // 添加新账户的页面元素里的提交按钮
    const newAccountSubmit = document.querySelector('.button').children[1];
    // 添加新账户的页面元素里的表单元素数组
    const formItems = addNewAccount.querySelectorAll('input');
    // 展示账户信息的框架页面数组
    const infoFrames = document.querySelectorAll('.frame');
    // 分页元素li 的 ul
    const pages = document.querySelector('.pages').querySelector('ul');
    // 详细账户信息界面
    const detailInfo = document.querySelector('.detailInfo');
    // 账户总数
    let accountNumber;
    // 要展示的账户对象数组
    let accountsPerPage;
    let that;


    // 页面打开时默认发送的请求，第一页账户信息和总共的页数
    loadlogo.style.opacity = '0.8';
    axios({
        method: 'GET',

        url: '/administrator/',

        params: {
            pageSize: 6
        },

        timeout: 2000
    }).then(response => {
        loadlogo.style.opacity = '0';

        ({ accountNumber, accounts: accountsPerPage } = response.data);

        // 创建分页
        for (let i = 1; i <= accountNumber / 6 + 1; i++) {
            let page = document.createElement('li');

            if (i === 1) {
                page.innerHTML = `<div class="page current">${i}</div>`;
            } else {
                page.innerHTML = `<div class="page">${i}</div>`;
            }

            pages.appendChild(page);

            page.addEventListener('click', function () {
                loadlogo.style.opacity = '0.8';

                axios({
                    method: 'GET',

                    url: '/administrator/page',

                    params: {
                        page: this.children[0].innerText,
                        pageSize: 6
                    },

                    timeout: 2000
                }).then(response => {
                    loadlogo.style.opacity = '0';

                    ({ accounts: accountsPerPage } = response.data);

                    for (let i = 0; i < accounts.children.length; i++) {
                        accounts.removeChild(accounts.children[i]);
                    }

                    // 将数据展示在页面上
                    

                }).catch(error => {
                    loadlogo.style.opacity = '0';

                    if (error.code === 'ERR_BAD_REQUEST') {
                        alert('404 not found');
                    } else {
                        alert('net error');
                    }
                });
            });
        }

        // 将第一页数据展示在页面上
        let i = 0;
        accountsPerPage.forEach(_account => {
            let account = document.createElement('div');
            account.className = 'info';
            account.setAttribute('data-id', _account.id);
            account.setAttribute('data-name', _account.name);
            account.setAttribute('data-username', _account.username);
            account.setAttribute('data-password', _account.password);
            account.setAttribute('data-userType', _account.userType);
            account.innerHTML = `<div class="id">${_account.id}</div><div class="username">${_account.username}</div><span class="bx bx-x-circle"></span>`;

            infoFrames[i++].appendChild(account);

            setTimeout(() => {
                account.style.marginLeft = '0';
            }, 50 * i);

            account.addEventListener('mousedown', function () {
                this.style.transform = 'rotateX(30deg) scale(0.9)';
                that = this;
            });

            document.documentElement.addEventListener('mouseup', function () {
                that.style.transform = '';

                const infodata = that.dataset;
                const infoblank = detailInfo.querySelectorAll('.info');
                let j = 0;
                for (key in infodata) {
                    infoblank[j++].innerText= infodata[key];
                }

                detailInfo.style.display = 'flex';
            });
        });
    }).catch(error => {
        loadlogo.style.opacity = '0';

        if (error.code === 'ERR_BAD_REQUEST') {
            alert('404 not found');
        } else {
            console.log(error);
            // alert('net error');
        }
    });

    // 退出系统
    nav.querySelector('span').addEventListener('click', function () {
        let addressNet = 'http://' + location.host;
        console.log(addressNet);
        location.replace(addressNet);
        sessionStorage.removeItem('userType');
    });

    // 打开添加账户页面
    functionButtons[0].addEventListener('click', function () {
        addNewAccount.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 添加新账户提交按钮
    newAccountSubmit.addEventListener('click', function (e) {
        e.preventDefault();

        loadlogo.style.opacity = '0.8';

        // 向后端发送请求
        let _name = formItems[0].value;
        let _username = formItems[1].value;
        let _password = formItems[2].value;
        let _userType = addNewAccount.querySelector('select').value;

        let flag = true;

        for (let i = 0; i < 3; i++) {
            if (formItems[i].value === '') {
                formItems[i].style.border = '2px solid red';
                flag = false;
            } else {
                formItems[i].style.border = '0';
            }
        }

        if (_userType === "none") {
            addNewAccount.querySelector('select').style.border = '2px solid red';
            flag = false;
        } else {
            addNewAccount.querySelector('select').style.border = '0';
        }

        if (flag) {
            axios({
                method: 'POST',

                url: '/administrator/addNewAccount',

                data: JSON.stringify({
                    name: _name,
                    username: _username,
                    password: _password,
                    userType: _userType
                }),

                timeout: 2000
            }).then(response => {
                loadlogo.style.opacity = '0';

                if (response.data.state === 1) {
                    alert('sueccess');
                    // 将新账户添加到账户内容中
                    // 
                    // 
                    // 
                    // 
                    // 
                    //
                } else {
                    alert('faile');
                }
            }).catch(error => {
                loadlogo.style.opacity = '0';

                if (error.code === 'ERR_BAD_REQUEST') {
                    alert('404 not found');
                } else {
                    alert('net error');
                }
            });
        } else {
            loadlogo.style.opacity = '0';
        }
    });

    // 关闭添加账户页面
    addNewAccount.querySelector('span').addEventListener('click', function () {
        for (let i = 0; i < 3; i++) {
            formItems[i].value = '';
            formItems[i].style.border = '0';
        }

        addNewAccount.querySelector('select').querySelectorAll('option')[0].selected = true;
        addNewAccount.querySelector('select').style.border = '0';

        addNewAccount.style.transform = 'translate(-50%, -50%) scale(0)';
    });

    // 打开或关闭删除账户按钮
    functionButtons[1].addEventListener('click', function () {
        if (this.innerText === 'Delete Account') {
            for (let i = 0; i < accounts.children.length; i++) {

            }

            this.innerText = 'OK';
        } else if (this.innerText === 'OK') {
            for (let i = 0; i < accounts.children.length; i++) {

            }

            this.innerText = 'Delete Account';
        }
    });

    // 点击账户条目，打开详细信息

});