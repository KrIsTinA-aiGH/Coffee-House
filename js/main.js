// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main script loaded');
    
    // Сразу обновляем UI из localStorage
    updateAuthUIFromStorage();
    
    // Затем подписываемся на изменения аутентификации
    if (window.auth) {
        window.auth.onAuthStateChanged((user) => {
            console.log('Auth state changed in main:', user);
            updateAuthUI(user);
        });
    }
});