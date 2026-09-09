/**
 * SAFFRON & SAGE ARTISAN KITCHEN - CORE JAVASCRIPT
 * Handles:
 * - Dynamic Shopping Cart with slide-out drawer
 * - Real-time Menu Search filter
 * - Category Tab filtering
 * - Mobile responsive navigation menu
 * - Toast notifications
 * - Educational interactive toggles (Box model / Display demo)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let cart = JSON.parse(localStorage.getItem('saffron_cart')) || [];

    // --- DOM Elements ---
    const mainHeader = document.getElementById('mainHeader');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const headerCartBtn = document.getElementById('headerCartBtn');
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartState = document.getElementById('emptyCartState');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const floatingCartCount = document.getElementById('floatingCartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartGrandTotal = document.getElementById('cartGrandTotal');
    const toastNotification = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const toggleDisplayNoneBtn = document.getElementById('toggleDisplayNoneBtn');
    const secretPerkBox = document.getElementById('secretPerkBox');
    const menuSearchInput = document.getElementById('menuSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    // --------------------------------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // --------------------------------------------------------------------------
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            mainNav.classList.toggle('open');
        });

        // Close when clicking nav link
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                mainNav.classList.remove('open');
            });
        });
    }

    // --------------------------------------------------------------------------
    // 2. BACK TO TOP BUTTON & HEADER SCROLL EFFECT
    // --------------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn?.classList.add('visible');
        } else {
            backToTopBtn?.classList.remove('visible');
        }

        if (mainHeader) {
            if (window.scrollY > 50) {
                mainHeader.style.background = 'rgba(15, 17, 21, 0.96)';
                mainHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
            } else {
                mainHeader.style.background = 'rgba(15, 17, 21, 0.88)';
                mainHeader.style.boxShadow = 'none';
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --------------------------------------------------------------------------
    // 3. SHOPPING CART MANAGEMENT
    // --------------------------------------------------------------------------
    function openCart() {
        cartDrawer?.classList.add('open');
        cartOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeCart() {
        cartDrawer?.classList.remove('open');
        cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    headerCartBtn?.addEventListener('click', openCart);
    floatingCartBtn?.addEventListener('click', openCart);
    closeCartBtn?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const img = btn.dataset.img;

            addToCart({ id, name, price, img });
            showToast('Delicacy Added!', `${name} is in your basket.`);
        });
    });

    function addToCart(item) {
        const existingIndex = cart.findIndex(c => c.id === item.id);
        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        updateCartUI();
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('saffron_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        if (floatingCartCount) floatingCartCount.textContent = totalItems;

        if (!cartItemsContainer) return;

        // Clear dynamic elements, keep empty state container
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(el => el.remove());

        if (cart.length === 0) {
            if (emptyCartState) emptyCartState.style.display = 'flex';
            if (cartSubtotal) cartSubtotal.textContent = '$0.00';
            if (cartTax) cartTax.textContent = '$0.00';
            if (cartGrandTotal) cartGrandTotal.textContent = '$0.00';
            return;
        }

        if (emptyCartState) emptyCartState.style.display = 'none';

        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.qty;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn dec-qty" data-id="${item.id}" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn inc-qty" data-id="${item.id}" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        const tax = subtotal * 0.08;
        const grandTotal = subtotal + tax;

        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
        if (cartGrandTotal) cartGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;

        // Attach quantity handlers
        cartItemsContainer.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = cart.find(c => c.id === btn.dataset.id);
                if (item) item.qty += 1;
                updateCartUI();
                saveCart();
            });
        });

        cartItemsContainer.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = cart.findIndex(c => c.id === btn.dataset.id);
                if (index > -1) {
                    if (cart[index].qty > 1) {
                        cart[index].qty -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                }
                updateCartUI();
                saveCart();
            });
        });

        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cart = cart.filter(c => c.id !== btn.dataset.id);
                updateCartUI();
                saveCart();
                showToast('Item Removed', 'Item was removed from your basket.');
            });
        });
    }

    // Checkout Button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your basket is currently empty! Please select dishes to place an order.');
                return;
            }
            alert(`Thank you for dining with Saffron & Sage! Your order total is ${cartGrandTotal.textContent}. Express thermal delivery dispatched!`);
            cart = [];
            saveCart();
            updateCartUI();
            closeCart();
        });
    }

    // Initialize Cart UI
    updateCartUI();

    // --------------------------------------------------------------------------
    // 4. TOAST NOTIFICATIONS
    // --------------------------------------------------------------------------
    let toastTimeout;
    function showToast(title, message) {
        if (!toastNotification) return;
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;

        toastNotification.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3200);
    }

    // --------------------------------------------------------------------------
    // 5. COPY PROMO CODE INTERACTION
    // --------------------------------------------------------------------------
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const code = copyCodeBtn.dataset.code || 'SAFFRON30';
            navigator.clipboard.writeText(code).then(() => {
                showToast('Promo Code Copied!', `Code "${code}" copied to clipboard.`);
                copyCodeBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
                setTimeout(() => {
                    copyCodeBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Code`;
                }, 2000);
            }).catch(() => {
                showToast('Promo Code', `Use code "${code}" at checkout.`);
            });
        });
    }

    // --------------------------------------------------------------------------
    // 6. CATEGORY & STICKY SUB-BAR FILTERING
    // --------------------------------------------------------------------------
    const categoryCards = document.querySelectorAll('.category-card');
    const stickyTags = document.querySelectorAll('.sticky-tag');
    const menuCards = document.querySelectorAll('.menu-card');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const activeItemsCount = document.getElementById('activeItemsCount');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    function filterMenuByCategory(selectedCategory) {
        let visibleCount = 0;

        menuCards.forEach(card => {
            const cardCat = card.dataset.category;
            if (selectedCategory === 'all' || cardCat === selectedCategory) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (activeItemsCount) {
            activeItemsCount.textContent = `Showing ${visibleCount} items`;
        }

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Sync Category Cards
        categoryCards.forEach(card => {
            if (card.dataset.category === selectedCategory) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Sync Sticky Filter Tags
        stickyTags.forEach(tag => {
            if (tag.dataset.filter === selectedCategory) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });
    }

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.category;
            filterMenuByCategory(cat);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                filterMenuByCategory(card.dataset.category);
            }
        });
    });

    stickyTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterMenuByCategory(tag.dataset.filter);
        });
    });

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (menuSearchInput) menuSearchInput.value = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';
            filterMenuByCategory('all');
        });
    }

    // --------------------------------------------------------------------------
    // 7. REAL-TIME MENU SEARCH
    // --------------------------------------------------------------------------
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (clearSearchBtn) {
                clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
            }

            let visibleCount = 0;
            menuCards.forEach(card => {
                const title = (card.dataset.title || '').toLowerCase();
                const desc = card.querySelector('.menu-item-description')?.textContent.toLowerCase() || '';
                const cat = (card.dataset.category || '').toLowerCase();

                if (title.includes(query) || desc.includes(query) || cat.includes(query)) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (activeItemsCount) {
                activeItemsCount.textContent = `Found ${visibleCount} dishes`;
            }

            if (noResultsMsg) {
                noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                menuSearchInput.value = '';
                clearSearchBtn.style.display = 'none';
                filterMenuByCategory('all');
                menuSearchInput.focus();
            });
        }
    }

    // --------------------------------------------------------------------------
    // 8. CSS DISPLAY: NONE TOGGLE DEMO (Academic Evaluation)
    // --------------------------------------------------------------------------
    if (toggleDisplayNoneBtn && secretPerkBox) {
        toggleDisplayNoneBtn.addEventListener('click', () => {
            if (secretPerkBox.style.display === 'none' || secretPerkBox.style.display === '') {
                secretPerkBox.style.display = 'flex';
                toggleDisplayNoneBtn.innerHTML = `<i class="fa-solid fa-eye"></i> Hide Secret Perk (set display: none)`;
                showToast('Secret Perk Revealed!', 'Vip perk unlocked via CSS display property change.');
            } else {
                secretPerkBox.style.display = 'none';
                toggleDisplayNoneBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Toggle Hidden Secret Offer (display: none)`;
            }
        });
    }
});
