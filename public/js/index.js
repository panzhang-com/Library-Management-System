window.addEventListener('load', () => {
    const usernameInput = document.querySelector('.username');
    const passwordInput = document.querySelector('.password');
    const userTypeSelect = document.querySelector('.userType');
    const submitButton = document.querySelector('.submit');

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (userTypeSelect.value === 'none') {
            alert('select user type');
        } else {
            axios({
                method: 'POST',

                url: '/users/login/',

                params: {
                    username: usernameInput.value,
                    password: passwordInput.value,
                    userType: userTypeSelect.value
                },

                timeout: 2000
            }).then(response => {
                if (userTypeSelect.value === 'administrator') {
                    // 设置会话，用于防止用户未登录访问其他页面
                    sessionStorage.setItem('userType', 'administrator');
                    window.location.assign('./html/administrator.html');
                } else {
                    sessionStorage.setItem('userType', 'other');
                    window.location.assign('./html/other.html');
                }
            });
        }

    });
});