// auth-utils.js
if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
} else {
    console.log('Firebase loaded successfully');
    
    // Инициализация Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCzzfz_piyPu4TJMUtmHIOA5j0Yl9ZjIZw",
        authDomain: "coffee-house-a65b4.firebaseapp.com",
        databaseURL: "https://coffee-house-a65b4-default-rtdb.firebaseio.com",
        projectId: "coffee-house-a65b4",
        storageBucket: "coffee-house-a65b4.firebasestorage.app",
        messagingSenderId: "214964009417",
        appId: "1:214964009417:web:717a4f7189ae58b8dc5018",
        measurementId: "G-W5TYF380FM"
    };
    
    // Инициализируем Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Создаем глобальные переменные для обратной совместимости
    window.auth = firebase.auth();
    window.firebaseConfig = firebaseConfig;
}

// Функция для обновления UI на основе статуса аутентификации
function updateAuthUI(user) {
    const loginLink = document.getElementById('login-link');
    const accountLink = document.getElementById('account-link');
    const footerLoginLink = document.getElementById('footer-login-link');
    const footerAccountLink = document.getElementById('footer-account-link');

    if (user) {
        // Пользователь авторизован
        if (loginLink) loginLink.style.display = 'none';
        if (accountLink) accountLink.style.display = 'block';
        if (footerLoginLink) footerLoginLink.style.display = 'none';
        if (footerAccountLink) footerAccountLink.style.display = 'block';
        
        // Сохраняем в localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.displayName || user.email);
    } else {
        // Пользователь не авторизован
        if (loginLink) loginLink.style.display = 'block';
        if (accountLink) accountLink.style.display = 'none';
        if (footerLoginLink) footerLoginLink.style.display = 'block';
        if (footerAccountLink) footerAccountLink.style.display = 'none';
        
        // Очищаем localStorage
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
    }
}

// Функция для немедленного обновления UI из localStorage
function updateAuthUIFromStorage() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    const loginLink = document.getElementById('login-link');
    const accountLink = document.getElementById('account-link');
    const footerLoginLink = document.getElementById('footer-login-link');
    const footerAccountLink = document.getElementById('footer-account-link');

    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (accountLink) accountLink.style.display = 'block';
        if (footerLoginLink) footerLoginLink.style.display = 'none';
        if (footerAccountLink) footerAccountLink.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (accountLink) accountLink.style.display = 'none';
        if (footerLoginLink) footerLoginLink.style.display = 'block';
        if (footerAccountLink) footerAccountLink.style.display = 'none';
    }
}

// Функция выхода
function logout() {
    if (window.auth) {
        window.auth.signOut()
            .then(() => {
                console.log('Пользователь вышел из системы');
                // Перенаправляем на главную страницу
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Ошибка при выходе:', error);
            });
    }
}

// Функция показа сообщений
function showMessage(message, type) {
    // Удаляем предыдущие сообщения
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    const authBox = document.querySelector('.auth-box');
    if (authBox) {
        authBox.insertBefore(messageDiv, authBox.firstChild);
        
        // Автоматическое скрытие сообщения
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Получение понятного сообщения об ошибке
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Этот email уже используется';
        case 'auth/invalid-email':
            return 'Неверный формат email';
        case 'auth/weak-password':
            return 'Пароль слишком простой';
        case 'auth/user-not-found':
            return 'Пользователь не найден';
        case 'auth/wrong-password':
            return 'Неверный пароль';
        default:
            return error.message;
    }
}