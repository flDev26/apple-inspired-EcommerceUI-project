// MAIN JAVASCRIPT LOGIC
// - - - - - - - - - - - - - - - - - - - - - - - - -


// MODULE USE: We are "importing" data from another file. 
// This keeps this file clean and lets us reuse the 'products' list elsewhere.
import { products } from '../data/products.js';

// EVENT LITERAL: "DOMContentLoaded" is a built-in browser event.
// It ensures the code doesn't run until the HTML is fully finished loading.
document.addEventListener("DOMContentLoaded", function () {
    
    // DATA STRUCTURES: 'cart' is an Array, and we're using JSON.parse 
    // to turn a string from storage back into a usable Javascript Object.
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // DOM ELEMENTS: 'document.querySelector' is like a magnet. 
    // It finds the HTML elements so JS can talk to them.
    const checkoutCountElement = document.querySelector(".header__checkout-count");
    const cartPreviewElement = document.querySelector(".header__cart-preview");
    const cartItemsElement = document.querySelector(".header__cart-items");
    const cartTotalElement = document.querySelector(".header__cart-total-amount");
    const productListElement = document.querySelector('.store__product-list');
    const toastContainer = document.querySelector('.toast-container');

    // FUNCTION to render products
    function renderProducts(products) {
        productListElement.innerHTML = ''; // Clear existing content

        // ARROW FUNCTIONS: '(product => { ... })' the modern, sleek way to write functions.
        // We are looping through every product in our list.
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('store__product');
            productElement.setAttribute('data-id', product.id);

            // TEMPLATE LITERALS: The backticks `` allow us to inject variables
            // like ${product.name} directly into a string of HTML.
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="store__product-image">
                <h2 class="store__product-name">${product.name}</h2>
                <p class="store__product-price">$${product.price.toFixed(2)}</p>
                <p class="store__product-description">${product.description}</p>
                <button class="store__add-to-cart">Add to Basket</button>
            `;

            productListElement.appendChild(productElement);
        });

        attachAddToCartListeners();
    }

    // FUNCTION to attach event listeners to "Add to Basket" buttons
    function attachAddToCartListeners() {
        document.querySelectorAll(".store__add-to-cart").forEach(button => {
            button.addEventListener("click", function () {
                const productElement = this.parentElement;
                const productId = productElement.getAttribute("data-id");
                const productName = productElement.querySelector(".store__product-name").textContent;
                const productPrice = parseFloat(productElement.querySelector(".store__product-price").textContent.replace('$', ''));
                const productImage = productElement.querySelector(".store__product-image").src;

                const existingProduct = cart.find(item => item.id === productId);

                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    // OBJECT CREATION: We are grouping individual pieces of info
                    // (id, name, price) into one single 'product' package.
                    const product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                    cart.push(product);
                }

                updateCart();
                showToast(`${productName} added to basket`, 'success');
            });
        });
    }

    // FUNCTION to update the cart in localStorage and update the checkout count
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart)); 
        // 8. REDUCE: A powerful method to boil an entire array down to a single number (total quantity).
        checkoutCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); 
        updateCartPreview(); 
    }

    // FUNCTION to update the mini-basket preview
    function updateCartPreview() {
        cartItemsElement.innerHTML = ''; 
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('header__cart-item');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="header__cart-item-image">
                <span class="header__cart-item-name">${item.name}</span>
                <span class="header__cart-item-quantity">x${item.quantity}</span>
                <span class="header__cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="header__cart-item-increase">+</button>
                <button class="header__cart-item-decrease">-</button>
                <button class="header__cart-item-remove">X</button>
            `;

            // Nested Event Listeners: Attaching logic to buttons that were JUST created.
            li.querySelector('.header__cart-item-increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });

            li.querySelector('.header__cart-item-decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1); 
                }
                showToast(`${item.name} removed from basket`, 'error'); 
                updateCart();
            });

            li.querySelector('.header__cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                showToast(`${item.name} removed from basket`, 'error'); 
                updateCart();
            });

            cartItemsElement.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }

    // FUNCTION to clear the basket
    function clearCart() {
        cart = [];
        updateCart();
        showToast(`Cleared entire basket`, 'error'); 
    }

    // FUNCTION to show toast notifications
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} toast--visible`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // ASYNC BEHAVIOR (Promises/Timeouts): setTimeout tells the browser 
        // "wait 3 seconds, THEN run this code." It doesn't block other code from running.
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            // 10. PROMISE-LIKE EVENT: 'transitionend' waits for the CSS animation 
            // to finish before cleaning up the element.
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    // Show cart preview on hover (UI Interaction logic)
    const checkoutLink = document.querySelector('.header__checkout-link');

    cartPreviewElement.addEventListener('mouseenter', () => {
        cartPreviewElement.style.display = 'flex';
    });

    checkoutLink.addEventListener('mouseenter', () => {
        cartPreviewElement.style.display = 'flex';
    });

    cartPreviewElement.addEventListener('mouseleave', () => {
        cartPreviewElement.style.display = 'none';
    });

    checkoutLink.addEventListener('mouseleave', () => {
        cartPreviewElement.style.display = 'none';
    });

    // INITIALIZATION: Running the functions to set everything up on page load.
    renderProducts(products);
    updateCart();

    document.querySelector('.header__clear-cart-button').addEventListener('click', clearCart);

    document.querySelector('.header__view-cart-button').addEventListener('click', function () {
        console.log('View Cart clicked:', cart);
    });
});