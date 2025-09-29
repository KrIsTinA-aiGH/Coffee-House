// js/account.js

// Функция для инициализации вкладок
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Убираем активный класс у всех кнопок и контента
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Добавляем активный класс текущей вкладке
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Если переключились на корзину, обновляем ее
            if (tabName === 'cart' && window.cartManager) {
                window.cartManager.updateCartPage();
            }
        });
    });
    
    // Обработка якорных ссылок (например, account.html#cart)
    const hash = window.location.hash.substring(1);
    if (hash && document.querySelector(`[data-tab="${hash}"]`)) {
        document.querySelector(`[data-tab="${hash}"]`).click();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Account script loaded');
    
    // Инициализируем вкладки
    initTabs();
    
    // Проверяем авторизацию
    if (window.auth) {
        window.auth.onAuthStateChanged((user) => {
            console.log('Auth state changed in account:', user);
            
            if (!user) {
                // Если пользователь не авторизован, перенаправляем на страницу входа
                showMessage('Пожалуйста, войдите в систему', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }
            
            // Отображаем информацию о пользователе
            displayUserInfo(user);
            
            // Инициализируем кнопку выхода
            initLogout();
            
            // Если есть менеджер корзины, обновляем UI корзины
            if (window.cartManager) {
                window.cartManager.updateCartUI();
            }
        });
    } else {
        console.error('Firebase auth not initialized');
        showMessage('Ошибка инициализации системы', 'error');
    }
});

// Функция для отображения информации о пользователе
function displayUserInfo(user) {
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userCreated = document.getElementById('user-created');
    
    if (userName) userName.textContent = user.displayName || 'Не указано';
    if (userEmail) userEmail.textContent = user.email || 'Не указан';
    
    // Форматируем дату регистрации
    if (userCreated && user.metadata) {
        const creationDate = new Date(user.metadata.creationTime);
        userCreated.textContent = creationDate.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Функция для выхода
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите выйти?')) {
                if (window.auth) {
                    window.auth.signOut()
                        .then(() => {
                            console.log('User signed out');
                            showMessage('Вы успешно вышли из системы', 'success');
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1500);
                        })
                        .catch((error) => {
                            console.error('Error signing out:', error);
                            showMessage('Ошибка при выходе: ' + error.message, 'error');
                        });
                }
            }
        });
    }
}

// Функция для показа сообщений
function showMessage(message, type) {
    // Создаем элемент для сообщения
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        font-weight: bold;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }
    
    document.body.appendChild(messageDiv);
    
    // Автоматически удаляем сообщение через 5 секунд
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}