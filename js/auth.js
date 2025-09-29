// js/auth.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth script loaded');
    
    // Сначала обновляем UI из localStorage для мгновенного отображения
    updateAuthUIFromStorage();
    
    // Затем подписываемся на изменения аутентификации
    if (window.auth) {
        window.auth.onAuthStateChanged((user) => {
            console.log('Auth state changed:', user);
            updateAuthUI(user);
        });
    }

    // Инициализация форм
    if (document.getElementById('login-form')) {
        initLogin();
    }
    if (document.getElementById('register-form')) {
        initRegister();
    }
});

// Инициализация формы входа
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const googleBtn = document.querySelector('.google-btn');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        loginWithEmail(email, password);
    });
    
    // Вход через Google
    if (googleBtn) {
        googleBtn.addEventListener('click', loginWithGoogle);
    }
}

// Инициализация формы регистрации
function initRegister() {
    const registerForm = document.getElementById('register-form');
    const googleBtn = document.querySelector('.google-btn');
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            showMessage('Пароли не совпадают', 'error');
            return;
        }
        
        registerWithEmail(name, email, password);
    });
    
    // Регистрация через Google
    if (googleBtn) {
        googleBtn.addEventListener('click', loginWithGoogle);
    }
}

// Регистрация с email и паролем
function registerWithEmail(name, email, password) {
    showMessage('Регистрация...', 'info');
    
    if (!window.auth) {
        showMessage('Ошибка инициализации Firebase', 'error');
        return;
    }
    
    window.auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Сохраняем дополнительную информацию о пользователе
            const user = userCredential.user;
            return user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            showMessage('Регистрация успешна!', 'success');
            // Даем время для обновления UI
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            showMessage(getErrorMessage(error), 'error');
        });
}

// Вход с email и паролем
function loginWithEmail(email, password) {
    showMessage('Вход...', 'info');
    
    if (!window.auth) {
        showMessage('Ошибка инициализации Firebase', 'error');
        return;
    }
    
    window.auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showMessage('Вход успешен!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            showMessage(getErrorMessage(error), 'error');
        });
}

// Вход через Google
function loginWithGoogle() {
    if (!window.auth || !firebase.auth) {
        showMessage('Ошибка инициализации Firebase', 'error');
        return;
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    
    window.auth.signInWithPopup(provider)
        .then((result) => {
            showMessage('Вход через Google успешен!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            showMessage(getErrorMessage(error), 'error');
        });
}