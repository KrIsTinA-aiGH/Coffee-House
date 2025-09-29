// products.js - используем compat версию (глобальные переменные)

// Элементы DOM
const addProductBtn = document.getElementById('add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const closeModal = document.querySelector('.close');
const addProductForm = document.getElementById('add-product-form');
const productGrid = document.querySelector('.product-grid');

console.log('Products.js loaded');


const staticProducts = [
    {
        id: 'static-1',
        name: 'Эфиопия Иргачефф',
        description: 'Страна: Эфиопия<br>Регион: Сидамо<br>Вкус: яркий, цветочный, с нотами цитрусов и ягод',
        price: 750,
        weight: 250,
        image: 'https://static.insales-cdn.com/images/products/1/6682/514415130/yirgacheffe.jpg',
        category: 'Африка',
        roast: 'светлая'
    },
    {
        id: 'static-2',
        name: 'Колумбия Супремо',
        description: 'Страна: Колумбия<br>Регион: Андины<br>Вкус: сбалансированный, с ореховыми и шоколадными нотами',
        price: 690,
        weight: 250,
        image: 'https://ir-5.ozone.ru/s3/multimedia-a/wc1000/6663371194.jpg',
        category: 'Южная Америка',
        roast: 'средняя'
    },
    {
        id: 'static-3',
        name: 'Гватемала Антьгуа',
        description: 'Страна: Гватемала<br>Регион: Антигуа<br>Вкус: сложный, с фруктовыми нотами и яркой кислотностью',
        price: 820,
        weight: 250,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        category: 'Центральная Америка',
        roast: 'светлая'
    },
    {
        id: 'static-4',
        name: 'Бразилия Сантос',
        description: 'Страна: Бразилия<br>Регион: Минас-Жерайс<br>Вкус: мягкий, с ореховыми и шоколадными нотами',
        price: 620,
        weight: 250,
        image: 'https://diamondelectric.ru/images/3345/3344915/kofe_v_zernah_geografiya_vkysa_braziliya_santos_1.jpg',
        category: 'Южная Америка',
        roast: 'средняя'
    },
    {
        id: 'static-5',
        name: 'Кения АА',
        description: 'Страна: Кения<br>Регион: Ньери<br>Вкус: яркий, с нотами черной смородины и цитрусов',
        price: 780,
        weight: 250,
        image: 'https://basket-01.wbbasket.ru/vol122/part12242/12242358/images/big/1.webp',
        category: 'Африка',
        roast: 'светлая'
    },
    {
        id: 'static-6',
        name: 'Суматра Манделинг',
        description: 'Страна: Индонезия<br>Регион: Суматра<br>Вкус: плотный, землистый, с пряными нотами',
        price: 710,
        weight: 250,
        image: 'https://cdn1.ozone.ru/s3/multimedia-t/c600/6252599141.jpg',
        category: 'Азия',
        roast: 'темная'
    }
];

// Загрузка товаров из базы данных
function loadProducts() {
    // Сначала отображаем статические товары
    displayStaticProducts();
    
    if (!firebase.database) {
        console.error('Firebase Database not loaded');
        return;
    }

    const db = firebase.database();
    const productsRef = db.ref('products');
    
    productsRef.on('value', (snapshot) => {
        const dbProducts = snapshot.val();
        displayDBProducts(dbProducts);
    }, (error) => {
        console.error('Error loading products:', error);
    });
}

// Отображение статических товаров
function displayStaticProducts() {
    if (!productGrid) return;
    
    // Очищаем сетку товаров
    productGrid.innerHTML = '';
    
    staticProducts.forEach((product) => {
        const productCard = createProductCard(product, product.id);
        productGrid.appendChild(productCard);
    });
}

// Отображение товаров из базы данных
function displayDBProducts(dbProducts) {
    if (!productGrid || !dbProducts) return;
    
    // Добавляем товары из базы данных к существующим
    Object.keys(dbProducts).forEach((productId) => {
        const product = dbProducts[productId];
        const productCard = createProductCard(product, productId);
        productGrid.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product, productId) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', productId);
    card.setAttribute('data-category', product.category || 'Все');
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Изображение+не+загружено'">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description.replace(/\n/g, '<br>')}</p>
            <p class="product-description">Обжарка: ${product.roast || 'не указана'}</p>
            <p class="product-price">${product.price} ₽ / ${product.weight || 250} г</p>
            <a href="#" class="btn add-to-cart-btn">В корзину</a>
        </div>
    `;
    
    // Добавляем обработчик для кнопки "В корзину"
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(productId, product);
    });
    
    return card;
}

// Функция добавления в корзину (заглушка)
function addToCart(productId, product) {
    console.log('Adding to cart:', product);
    alert(`Товар "${product.name}" добавлен в корзину!`);
    // Здесь можно добавить логику для работы с корзиной
}

// Фильтрация товаров
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
            
            const filter = btn.textContent;
            filterProducts(filter);
        });
    });
}

// Фильтрация товаров по категории
function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (filter === 'Все' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Проверка авторизации администратора
if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
        console.log('Auth state changed in products:', user);
        
        if (user && user.email === 'shilenko.c139@gmail.com') {
            console.log('Showing add product button');
            if (addProductBtn) addProductBtn.style.display = 'block';
        } else {
            console.log('Hiding add product button');
            if (addProductBtn) addProductBtn.style.display = 'none';
        }
    });
}

// Открытие модального окна
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        if (addProductModal) addProductModal.style.display = 'block';
    });
}

// Закрытие модального окна
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (addProductModal) addProductModal.style.display = 'none';
    });
}

// Закрытие при клике вне окна
window.addEventListener('click', (event) => {
    if (event.target === addProductModal) {
        addProductModal.style.display = 'none';
    }
});

// Добавление товара в базу данных
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-product-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Показываем загрузку
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Добавление...';
            submitBtn.disabled = true;
            
            // Получаем данные из формы
            const productData = {
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                price: parseInt(document.getElementById('product-price').value),
                weight: parseInt(document.getElementById('product-weight').value),
                image: document.getElementById('product-image').value,
                category: document.getElementById('product-category').value,
                roast: document.getElementById('product-roast').value,
                createdAt: new Date().toISOString()
            };
            
            console.log('Adding product:', productData);
            
            // Добавляем в базу данных
            const db = firebase.database();
            const productsRef = db.ref('products');
            const newProductRef = productsRef.push();
            await newProductRef.set(productData);
            
            // Успех
            alert('Товар успешно добавлен!');
            addProductForm.reset();
            if (addProductModal) addProductModal.style.display = 'none';
            
            // Товар автоматически добавится через слушатель базы данных
            
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
            alert('Ошибка при добавлении товара: ' + error.message);
        } finally {
            // Восстанавливаем кнопку
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded');
    
    // Загружаем товары
    loadProducts();
    
    // Инициализируем фильтры
    initFilters();
    
    // Слушаем изменения в базе данных в реальном времени
    if (firebase.database) {
        const db = firebase.database();
        const productsRef = db.ref('products');
        
        productsRef.on('value', (snapshot) => {
            console.log('Products updated in real-time');
        });
    }
});
// Функция добавления в корзину
function addToCart(productId, product) {
    if (window.cartManager) {
        window.cartManager.addToCart(productId, product);
    } else {
        console.log('Adding to cart:', product);
        alert(`Товар "${product.name}" добавлен в корзину!`);
    }
}