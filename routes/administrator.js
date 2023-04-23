var express = require('express');
var router = express.Router();

router.get('/', function (request, response, next) {
    let data = {
        accountNumber: 20,

        accounts: [
            {
                id: 000001,
                name: 'zhangsan',
                username: 'zhangsan',
                password: '000000',
                userType: 'staff'
            },

            {
                id: 000002,
                name: 'lisi',
                username: 'lisi',
                password: '000000',
                userType: 'patron'
            },

            {
                id: 000003,
                name: 'wangwu',
                username: 'wangwu',
                password: '000000',
                userType: 'patron'
            }
        ]
    }

    setTimeout(() => {
        response.send(JSON.stringify(data));
    }, 0);
});

router.get('/page', function (request, response, next) {
    let data = {
        accounts: [
            {
                id: 000011,
                name: 'zhangsan',
                username: 'zhangsan',
                password: '000000',
                userType: 'staff'
            },

            {
                id: 000012,
                name: 'lisi',
                username: 'lisi',
                password: '000000',
                userType: 'patron'
            },

            {
                id: 000013,
                name: 'wangwu',
                username: 'wangwu',
                password: '000000',
                userType: 'patron'
            }
        ]
    }

    setTimeout(() => {
        response.send(JSON.stringify(data));
    }, 0);
});

router.get('/deleteAccount', function (request, response, next) {
    let data = {
        state: 1,

        accountNumber: 20,

        accounts: [
            {
                id: 000011,
                name: 'zhangsan',
                username: 'zhangsan',
                password: '000000',
                userType: 'staff'
            },

            {
                id: 000012,
                name: 'lisi',
                username: 'lisi',
                password: '000000',
                userType: 'patron'
            },

            {
                id: 000013,
                name: 'wangwu',
                username: 'wangwu',
                password: '000000',
                userType: 'patron'
            }
        ]
    }

    setTimeout(() => {
        response.send(JSON.stringify(data));
    }, 0);
});

router.get('/switchPage', function (request, response, next) {
    let data = {
        accountNumber: 20,

        accounts: [
            {
                id: 000001,
                name: 'zhangsan',
                username: 'zhangsan',
                password: '000000',
                userType: 'staff'
            },

            {
                id: 000002,
                name: 'lisi',
                username: 'lisi',
                password: '000000',
                userType: 'patron'
            }
        ]
    }

    response.send(JSON.stringify(data));
});

router.post('/addNewAccount', function (request, response, next) {
    // response.setHeader('Access-Control-Allow-Origin', '*');

    setTimeout(() => {
        response.send(JSON.stringify({
            state: 1,

            accountNumber: 21,

            accounts: [
                {
                    id: 000001,
                    name: 'zhangsan',
                    username: 'zhangsan',
                    password: '000000',
                    userType: 'staff'
                },

                {
                    id: 000002,
                    name: 'lisi',
                    username: 'lisi',
                    password: '000000',
                    userType: 'patron'
                },

                {
                    id: 000003,
                    name: 'wangwu',
                    username: 'wangwu',
                    password: '000000',
                    userType: 'patron'
                },

                {
                    id: 000004,
                    name: 'zhaoliu',
                    username: 'zhaoliu',
                    password: '000000',
                    userType: 'patron'
                }
            ]
        }));
    }, 0);
});



module.exports = router;