// 封装发送请求对象
class SendRequest {
    constructor() {
        this.loadlogo = document.querySelector('.loadlogo');
    }

    // 发送get请求
    sendGETRequest(_url, _data, _operation) {
        this.loadlogo.style.opacity = '0.8';

        axios({
            method: 'GET',

            url: _url,

            params: _data,

            timeout: 2000
        }).then(response => {
            this.loadlogo.style.opacity = '0';
            _operation(response.data);
        }).catch(error => {
            this.loadlogo.style.opacity = '0';
            console.log(error);
        });
    }

    // 发送post请求
    sendPOSTRequest(_url, _data, _operation) {
        this.loadlogo.style.opacity = '0.8';

        axios({
            method: 'POST',

            url: _url,

            data: JSON.stringify(_data),

            timeout: 2000
        }).then(response => {
            this.loadlogo.style.opacity = '0';
            _operation(response.data);
        }).catch(error => {
            this.loadlogo.style.opacity = '0';
            console.log(error);
        });
    }
}

// 封装修改展示页面内容和分页的函数
function changeShowPageContent({ accountNumber, accounts }) {
    let infoFrames = document.querySelectorAll('.frame');
    let pages = document.querySelector('.pages').querySelector('ul');

    // 修改展示页面
    infoFrames.forEach(infoFrame => {
        if (infoFrame.children.length !== 0) {
            infoFrame.removeChild(infoFrame.children[0]);
        }
    });

    let i = 0;
    accounts.forEach(_account => {
        let account = document.createElement('div');

        account.className = 'info';
        account.innerHTML = `<div class="id">${_account.id}</div><div class="username">${_account.username}</div><span class="bx bx-x-circle"></span>`;

        account.setAttribute('data-id', _account.id);
        account.setAttribute('data-name', _account.name);
        account.setAttribute('data-username', _account.username);
        account.setAttribute('data-password', _account.password);
        account.setAttribute('data-userType', _account.userType);

        infoFrames[i++].appendChild(account);
    });

    // 更改分页
    while (pages.children.length !== 0) {
        pages.removeChild(pages.children[0]);
    }

    for (let j = 1; j <= accountNumber / 6 + 1; j++) {
        let page = document.createElement('li');

        page.className = 'page';
        page.innerHTML = `${j}`;

        pages.appendChild(page);
    }
}

// 封装功能对象
// 1. 封装退出账号功能对象
class ExitAccount {
    constructor() {
        this.exitButton = document.querySelector('.bx-log-out');

        this.init();
    }

    init() {
        this.exitButton.addEventListener('click', this.exit);
    }

    exit() {
        window.location.replace(`http://${window.location.host}`);
    }
}

// 2. 封装初始化账户内容显示页面对象
class InitAccountContent {
    constructor() {
        this.search = document.querySelector('.search');

        this.sendRequest = new SendRequest();

        this.init();
    }

    init() {
        // 打开页面时向服务器请求第一页数据和账户总数
        // 并创建分页，将信息显示在页面上
        this.sendRequest.sendGETRequest('/administrator/', {
            page: 1,
            pageSize: 6,
            searchKey: this.search.value
        }, changeShowPageContent);
    }
}

// 3. 封装添加账户功能
let AddNewAccountThat;
class AddNewAccount {
    constructor() {
        this.addNewAccountButton = document.querySelector('.addButton');
        this.addPage = document.querySelector('.addNewAccount');
        this.closeAddPageButton = this.addPage.querySelector('.bx-x');
        this.dataItems = this.addPage.querySelectorAll('.dataItem');
        this.submitButton = this.addPage.querySelector('.button').children[1];
        this.search = document.querySelector('.search');

        this.sendRequest = new SendRequest();

        AddNewAccountThat = this;
        this.init();
    }

    init() {
        this.addNewAccountButton.addEventListener('click', this.showAddPage);

        this.closeAddPageButton.addEventListener('click', this.closeAddPage);

        this.submitButton.addEventListener('click', this.submit);
    }

    showAddPage() {
        for (let i = 0; i < AddNewAccountThat.dataItems.length; i++) {
            AddNewAccountThat.dataItems[i].style.border = '0';
            if (i === AddNewAccountThat.dataItems.length - 1) {
                AddNewAccountThat.dataItems[i].children[0].selected = true;
            } else {
                AddNewAccountThat.dataItems[i].value = '';
            }
        }

        AddNewAccountThat.addPage.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    closeAddPage() {
        AddNewAccountThat.addPage.style.transform = 'translate(-50%, -50%) scale(0)';
    }

    submit(e) {
        e.preventDefault();

        let flag = true;
        AddNewAccountThat.dataItems.forEach(dataItem => {
            if (dataItem.value === '' || dataItem.value === 'none') {
                flag = false;
                dataItem.style.border = '2px solid red';
            } else {
                dataItem.style.border = '0';
            }
        });

        if (flag) {
            let _name = AddNewAccountThat.dataItems[0].value;
            let _username = AddNewAccountThat.dataItems[1].value;
            let _passowrd = AddNewAccountThat.dataItems[2].value;
            let _userType = AddNewAccountThat.dataItems[3].value;

            AddNewAccountThat.sendRequest.sendPOSTRequest('/administrator/addNewAccount', {
                name: _name,
                username: _username,
                password: _passowrd,
                userType: _userType,
                page: 1,
                pageSize: 6,
                searchKey: AddNewAccountThat.search.value
            }, AddNewAccountThat.responseHandle);
        }
    }

    responseHandle(data) {
        let { state } = data;

        if (state === 1) {
            AddNewAccountThat.addPage.style.transform = 'translate(-50%, -50%) scale(0)';
            alert('success');
        } else {
            alert('faile');
        }

        changeShowPageContent(data);
    }
}

// 4. 封装删除账户功能 (事件委托)
let DeleteAccountThat;
class DeleteAccount {
    constructor() {
        this.deleteButton = document.querySelector('.deleteButton');
        this.infoFrames = document.querySelectorAll('.frame');
        this.search = document.querySelector('.search');

        this.sendRequest = new SendRequest();

        DeleteAccountThat = this;
        this.init();
    }

    init() {
        this.deleteButton.addEventListener('click', this.showDeleIcon);

        this.infoFrames.forEach(infoFrame => {
            infoFrame.addEventListener('click', DeleteAccountThat.delete);
        });
    }

    showDeleIcon() {
        if (this.innerText === 'Delete Account') {
            this.innerText = 'OK';
            DeleteAccountThat.infoFrames.forEach(infoFrame => {
                if (infoFrame.querySelector('span') !== null) {
                    infoFrame.querySelector('span').style.display = 'block';
                }
            });
        } else {
            this.innerText = 'Delete Account';
            DeleteAccountThat.infoFrames.forEach(infoFrame => {
                if (infoFrame.querySelector('span') !== null) {
                    infoFrame.querySelector('span').style.display = 'none';
                }
            });
        }
    }

    delete(e) {
        if (e.target === this.querySelector('span')) {
            DeleteAccountThat.sendRequest.sendGETRequest('/administrator/deleteAccount', {
                id: this.children[0].getAttribute('data-id'),
                page: 1,
                pageSzie: 6,
                searchKey: DeleteAccountThat.search.value
            }, DeleteAccountThat.responseHandle);
        }
    }

    responseHandle(data) {
        let { state } = data;

        if (state === 1) {
            alert('success');
        } else {
            alert('faile');
        }

        changeShowPageContent(data);

        DeleteAccountThat.infoFrames.forEach(infoFrame => {
            if (infoFrame.querySelector('span') !== null) {
                infoFrame.querySelector('span').style.display = 'block';
            }
        });
    }
}

// 5. 查看详细信息功能 (事件委托)

// 6. 搜索功能


window.addEventListener('load', () => {
    new ExitAccount(); // 退出账号

    new InitAccountContent(); // 初始化账户显示页面

    new AddNewAccount(); // 添加账户功能

    new DeleteAccount(); // 删除账户功能
});