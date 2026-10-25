document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    setupScrollListener();
    setupHeroSlideshow();
    setupHeroSearch();
    renderHomeGigs();
});

function renderHomeGigs() {
    const container = document.getElementById('home-gigs-grid');
    if (!container || !window.MockData) return;

    // Show first 8 gigs as featured
    const featured = window.MockData.gigs.slice(0, 8);

    featured.forEach(gig => {
        const rating = !isNaN(gig.totalStars / gig.starNumber)
            ? Math.round(gig.totalStars / gig.starNumber) : 0;

        const card = `
            <div class="gig-card" onclick="window.location.href='pages/gigs.html?search=${encodeURIComponent(gig.title)}'">
                <img src="${gig.img}" alt="${gig.title}" class="gig-card-cover" />
                <div class="gig-card-body">
                    <div class="gig-card-user">
                        <div>
                            <div class="gig-card-username">${gig.username}</div>
                            <div class="gig-card-seller-tag">${gig.rate}</div>
                        </div>
                    </div>
                    <div class="gig-card-title">${gig.title}</div>
                    <div class="gig-card-rating">
                        <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                        ${rating} <span class="rating-count">(${gig.starNumber})</span>
                    </div>
                </div>
                <div class="gig-card-footer">
                    <span class="gig-card-heart" onclick="event.stopPropagation();">
                        <svg fill="currentColor" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
                    </span>
                    <span class="gig-card-price">
                        Starting At <strong>${window.MockData.formatPrice(gig.price)}</strong>
                    </span>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}


function setupScrollListener() {
    const navbar = document.getElementById('navbar');
    const navSliderContainer = document.getElementById('nav-slider-container');
    const sliderText = document.getElementById('navSlider');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navbar.classList.add('scrolled');
            if (navSliderContainer) {
                navSliderContainer.classList.add('visible');
            }
            if (sliderText) {
                sliderText.classList.add('scrolled-text');
            }
        } else {
            navbar.classList.remove('scrolled');
            if (navSliderContainer) {
                navSliderContainer.classList.remove('visible');
            }
            if (sliderText) {
                sliderText.classList.remove('scrolled-text');
            }
        }
    });
}

function renderNavbar() {
    const navLinksContainer = document.getElementById('nav-links');
    if (!navLinksContainer) return;

    const currentUser = StorageManager.getCurrentUser();

    if (currentUser) {
        navLinksContainer.innerHTML = `
            <span class="nav-wallet" title="Wallet Balance">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M464 128H48c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zM392 336c-22.091 0-40-17.909-40-40s17.909-40 40-40s40 17.909 40 40s-17.909 40-40 40zm72-160H48v-32c0-8.837 7.163-16 16-16h384c8.837 0 16 7.163 16 16v32z"></path></svg>
                ₹${currentUser.walletBalance || 0}
            </span>
            <div class="nav-user">
                <span>${currentUser.username}</span>
                <div class="nav-dropdown">
                    <div class="nav-dropdown-inner">
                        ${currentUser.isSeller ? `
                            <a href="pages/myGigs.html">Gigs</a>
                            <a href="pages/add.html">Add New Gig</a>
                        ` : ''}
                        <a href="pages/orders.html">Orders</a>
                        <a href="#" id="topup-btn">Top Up Wallet</a>
                        <a href="#" id="logout-btn">Logout</a>
                    </div>
                </div>
            </div>
        `;

        createWalletModal();

        document.getElementById('topup-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('wallet-modal');
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            modal.children[0].style.transform = 'translateY(0)';
        });

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            StorageManager.logout();
            window.location.reload();
        });
    } else {
        navLinksContainer.innerHTML = `
            <a href="pages/login.html">Sign in</a>
            <a href="pages/register.html" class="nav-join-btn">Join</a>
        `;
    }
}

function setupHeroSlideshow() {
    const heroBg = document.getElementById('hero-bg');
    if (!heroBg) return;

    const changeImage = [
        'assets/images/hero1.png',
        'assets/images/hero2.png',
        'assets/images/hero3.png',
        'assets/images/hero4.png',
        'assets/images/hero5.png',
        'assets/images/hero6.png'
    ];
    let currentImageIndex = 0;

    heroBg.src = changeImage[currentImageIndex];

    setInterval(() => {
        currentImageIndex = currentImageIndex === changeImage.length - 1 ? 0 : currentImageIndex + 1;

        heroBg.style.opacity = '0.95';
        heroBg.src = changeImage[currentImageIndex];

        setTimeout(() => {
            heroBg.style.opacity = '1';
        }, 1000);

    }, 5000);
}

function setupHeroSearch() {
    const searchInput = document.getElementById('hero-search-input');
    const searchBtn = document.getElementById('hero-search-btn');
    const tagBtns = document.querySelectorAll('.hero-tag-btn');

    // Helper: navigate to gigs page with the search term
    function doSearch(query) {
        const q = query.trim();
        if (!q) return;
        window.location.href = `pages/gigs.html?search=${encodeURIComponent(q)}`;
    }

    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', () => doSearch(searchInput.value));
    }

    // Press Enter in the search box
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doSearch(searchInput.value);
        });
    }

    // Popular tag buttons — each has a data-search attribute
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            doSearch(btn.getAttribute('data-search'));
        });
    });
}

function createWalletModal() {
    if (document.getElementById('wallet-modal')) return;
    
    const modalHtml = `
        <div id="wallet-modal" class="wallet-modal-overlay">
            <div class="wallet-modal-box">
                <div class="wallet-modal-header">
                    <h3 class="wallet-modal-title">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="18" width="18"><path d="M464 128H48c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zM392 336c-22.091 0-40-17.909-40-40s17.909-40 40-40s40 17.909 40 40s-17.909 40-40 40zm72-160H48v-32c0-8.837 7.163-16 16-16h384c8.837 0 16 7.163 16 16v32z"></path></svg>
                        Top Up Wallet
                    </h3>
                    <button id="close-wallet-modal" class="wallet-close-btn">&times;</button>
                </div>
                <div class="wallet-preset-group">
                    <button class="wallet-preset-btn" data-amt="500">₹500</button>
                    <button class="wallet-preset-btn" data-amt="1000">₹1000</button>
                    <button class="wallet-preset-btn" data-amt="2000">₹2000</button>
                    <button class="wallet-preset-btn" data-amt="5000">₹5000</button>
                </div>
                <div class="wallet-input-group">
                    <label class="wallet-input-label">Or enter custom amount</label>
                    <div class="wallet-input-wrapper">
                        <span class="wallet-input-prefix">₹</span>
                        <input type="number" id="wallet-custom-amt" placeholder="1500" class="wallet-input">
                    </div>
                </div>
                <button id="confirm-topup-btn" class="wallet-submit-btn">
                    Proceed to Pay
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('wallet-modal');
    const modalBox = modal.children[0];
    const input = document.getElementById('wallet-custom-amt');
    const presetBtns = document.querySelectorAll('.wallet-preset-btn');

    document.getElementById('close-wallet-modal').addEventListener('click', () => {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modalBox.style.transform = 'translateY(20px)';
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            input.value = e.target.getAttribute('data-amt');
            presetBtns.forEach(b => {
                b.classList.remove('active');
            });
            e.target.classList.add('active');
        });
    });

    document.getElementById('confirm-topup-btn').addEventListener('click', (e) => {
        const amount = input.value;
        if (amount && !isNaN(amount) && Number(amount) > 0) {
            e.target.innerHTML = '<span style="opacity: 0.8;">Processing...</span>';
            setTimeout(() => {
                const currentUser = StorageManager.getCurrentUser();
                currentUser.walletBalance = (currentUser.walletBalance || 0) + Number(amount);
                StorageManager.setCurrentUser(currentUser);
                
                const users = StorageManager.get('users') || [];
                const userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex].walletBalance = currentUser.walletBalance;
                    StorageManager.set('users', users);
                }
                window.location.reload();
            }, 800);
        }
    });
}
