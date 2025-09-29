// cart.js - управление корзиной
class CartManager {
    constructor() {
        this.cart = this.getCartFromStorage();
        this.updateCartUI();
    }

    // Получить корзину из localStorage
    getCartFromStorage() {
        const cart = localStorage.getItem('coffeeCart');
        return cart ? JSON.parse(cart) : [];
    }

    // Сохранить корзину в localStorage
    saveCartToStorage() {
        localStorage.setItem('coffeeCart', JSON.stringify(this.cart));
    }

    // Добавить товар в корзину
    addToCart(productId, product) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                weight: product.weight || 250
            });
        }
        
        this.saveCartToStorage();
        this.updateCartUI();
        this.showCartNotification(product.name);
    }

    // Удалить товар из корзины
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    // Изменить количество товара
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    // Очистить корзину
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartUI();
    }

    // Показать уведомление о добавлении в корзину
    showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} добавлен в корзину</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Обновить UI корзины
    updateCartUI() {
        this.updateCartCount();
        this.updateCartPage();
    }

    // Обновить счетчик товаров в header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cartLink = document.getElementById('cart-link');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        if (cartLink) {
            if (totalItems > 0) {
                cartLink.style.display = 'block';
            } else {
                cartLink.style.display = 'none';
            }
        }
    }

    // Обновить страницу корзины
    updateCartPage() {
        const cartItems = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartItems) cartItems.style.display = 'none';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItems) cartItems.style.display = 'block';

        // Очищаем и заполняем корзину
        cartItems.innerHTML = '';
        
        let totalPrice = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₽ / ${item.weight} г</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    ${itemTotal} ₽
                </div>
            `;

            cartItems.appendChild(cartItem);
        });

        // Обновляем общую сумму
        if (cartTotalPrice) {
            cartTotalPrice.textContent = totalPrice;
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }

        // Добавляем обработчики событий
        this.addCartEventListeners();
    }

    // Добавить обработчики событий для корзины
    addCartEventListeners() {
        // Кнопки увеличения количества
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quantity-btn').dataset.id;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Кнопки уменьшения количества
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quantity-btn').dataset.id;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Кнопки удаления
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-btn').dataset.id;
                this.removeFromCart(productId);
            });
        });

        // Кнопка оформления заказа
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    // Оформление заказа
    checkout() {
        if (!window.auth || !window.auth.currentUser) {
            alert('Пожалуйста, войдите в систему для оформления заказа');
            window.location.href = 'login.html';
            return;
        }

        const user = window.auth.currentUser;
        const order = {
            userId: user.uid,
            items: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            createdAt: new Date().toISOString(),
            userEmail: user.email,
            userName: user.displayName || user.email
        };

        // Сохраняем заказ в базу данных
        const db = firebase.database();
        const ordersRef = db.ref('orders');
        ordersRef.push(order)
            .then(() => {
                alert('Заказ успешно оформлен!');
                this.clearCart();
                // Переключаем на вкладку заказов
                this.switchTab('orders');
            })
            .catch(error => {
                console.error('Ошибка при оформлении заказа:', error);
                alert('Ошибка при оформлении заказа: ' + error.message);
            });
    }

    // Переключение вкладок
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }
}

// Создаем глобальный экземпляр корзины
window.cartManager = new CartManager();