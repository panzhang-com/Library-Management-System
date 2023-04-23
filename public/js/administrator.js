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
let InitAccountContentThat;
class InitAccountContent {
    constructor() {
        this.search = document.querySelector('.search');
        this.pages = document.querySelector('.pages').querySelector('ul');

        this.sendRequest = new SendRequest();

        InitAccountContentThat = this;
        this.init();
    }

    init() {
        // 打开页面时向服务器请求第一页数据和账户总数
        // 并创建分页，将信息显示在页面上
        this.sendRequest.sendGETRequest('/administrator/', {
            page: 1,
            pageSize: 6,
            searchKey: this.search.value
        }, this.responseHandle);
    }

    responseHandle(data) {
        changeShowPageContent(data);

        InitAccountContentThat.pages.children[0].className = 'page current';
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
        this.pages = document.querySelector('.pages').querySelector('ul');
        this.currentPage;

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
            // 获取当前页码
            if (AddNewAccountThat.pages.children.length !== 0) {
                AddNewAccountThat.pages.children.forEach(page => {
                    if (page.className === 'page current') {
                        AddNewAccountThat.currentPage = parseInt(page.innerHTML);
                    }
                });
            }

            let _name = AddNewAccountThat.dataItems[0].value;
            let _username = AddNewAccountThat.dataItems[1].value;
            let _passowrd = AddNewAccountThat.dataItems[2].value;
            let _userType = AddNewAccountThat.dataItems[3].value;

            AddNewAccountThat.sendRequest.sendPOSTRequest('/administrator/addNewAccount', {
                name: _name,
                username: _username,
                password: _passowrd,
                userType: _userType,
                page: AddNewAccountThat.currentPage,
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

        AddNewAccountThat.pages.children[AddNewAccountThat.currentPage - 1].className = 'page current';
    }
}

// 4. 封装删除账户功能 (事件委托)
let DeleteAccountThat;
class DeleteAccount {
    constructor() {
        this.deleteButton = document.querySelector('.deleteButton');
        this.infoFrames = document.querySelectorAll('.frame');
        this.search = document.querySelector('.search');
        this.infoFrames = document.querySelectorAll('.frame');
        this.pages = document.querySelector('.pages').querySelector('ul');
        this.currentPage;

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
            // 获取当前页码
            DeleteAccountThat.pages.children.forEach(page => {
                if (page.className === 'page current') {
                    if (page.innerHTML === '1') {
                        DeleteAccountThat.currentPage = parseInt(page.innerHTML);
                    } else {
                        if (DeleteAccountThat.infoFrames[1].children.length === 0) {
                            DeleteAccountThat.currentPage = parseInt(page.innerHTML) - 1;
                        } else {
                            DeleteAccountThat.currentPage = parseInt(page.innerHTML);
                        }
                    }
                }
            });


            DeleteAccountThat.sendRequest.sendGETRequest('/administrator/deleteAccount', {
                id: this.children[0].getAttribute('data-id'),
                page: DeleteAccountThat.currentPage,
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

        DeleteAccountThat.pages.children[DeleteAccountThat.currentPage - 1].className = 'page current';
    }
}

// 5. 查看详细信息功能 (事件委托)




// 6. 搜索功能
let SearchThat;
class Search {
    constructor() {
        this.search = document.querySelector('.search');
        this.pages = document.querySelector('.pages').querySelector('ul');

        this.sendRequest = new SendRequest();

        SearchThat = this;
        this.init();
    }

    init() {
        this.search.addEventListener('keyup', this.sendSearchRequest);
    }

    sendSearchRequest(e) {
        if (e.key === 'Enter') {
            //  发送请求









        }
    }
}

// 7. 切换分页功能
let SwitchPageThat;
class SwitchPage {
    constructor() {
        this.pages = document.querySelector('.pages').querySelector('ul');
        this.search = document.querySelector('.search');
        this.currentPage;

        this.sendRequest = new SendRequest();

        SwitchPageThat = this;
        this.init();
    }

    init() {
        this.pages.addEventListener('click', this.switchPage);
    }

    switchPage(e) {
        if (e.target !== SwitchPageThat.pages) {
            SwitchPageThat.currentPage = parseInt(e.target.innerHTML);
    
            SwitchPageThat.sendRequest.sendGETRequest('/administrator/switchPage', {
                page: SwitchPageThat.currentPage,
                pageSize: 6,
                searchKey: SwitchPageThat.search.value
            }, SwitchPageThat.responseHandle);
        }
    }

    responseHandle(data) {
        changeShowPageContent(data);

        SwitchPageThat.pages.children[SwitchPageThat.currentPage - 1].className = 'page current';
    }
}

window.addEventListener('load', () => {
    new ExitAccount(); // 退出账号

    new InitAccountContent(); // 初始化账户显示页面

    new AddNewAccount(); // 添加账户功能

    new DeleteAccount(); // 删除账户功能

    new SwitchPage(); // 切换分页功能

    new Search(); // 搜索功能
});