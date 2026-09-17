document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    setupScrollListener();
    setupHeroSlideshow();
});

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
            <a href="pages/gigs.html">Explore</a>
            <span class="nav-wallet" title="Wallet Balance">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M464 128H48c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zM392 336c-22.091 0-40-17.909-40-40s17.909-40 40-40s40 17.909 40 40s-17.909 40-40 40zm72-160H48v-32c0-8.837 7.163-16 16-16h384c8.837 0 16 7.163 16 16v32z"></path></svg>
                ₹${currentUser.walletBalance || 0}
            </span>
            <div class="nav-user">
                <img src="${currentUser.img || 'https://i.pravatar.cc/150?u=' + currentUser.username}" alt="Profile" class="nav-user-avatar">
                <span>${currentUser.username}</span>
                <div class="nav-dropdown">
                    <div class="nav-dropdown-inner">
                        ${currentUser.isSeller ? `
                            <a href="pages/myGigs.html">Gigs</a>
                            <a href="pages/add.html">Add New Gig</a>
                        ` : ''}
                        <a href="pages/orders.html">Orders</a>
                        <a href="pages/messages.html">Messages</a>
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
            <a href="pages/gigs.html">Explore</a>
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

function createWalletModal() {
    if (document.getElementById('wallet-modal')) return;
    
    const modalHtml = `
        <div id="wallet-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s;">
            <div style="background: #fff; width: 380px; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); transform: translateY(20px); transition: transform 0.25s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #1a1b1d; display: flex; align-items: center; gap: 8px;">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="18" width="18" style="color: var(--primary)"><path d="M464 128H48c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zM392 336c-22.091 0-40-17.909-40-40s17.909-40 40-40s40 17.909 40 40s-17.909 40-40 40zm72-160H48v-32c0-8.837 7.163-16 16-16h384c8.837 0 16 7.163 16 16v32z"></path></svg>
                        Top Up Wallet
                    </h3>
                    <button id="close-wallet-modal" style="background: #f5f5f5; border: none; font-size: 1.25rem; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; color: #74767e; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button class="wallet-preset-btn" data-amt="500" style="flex: 1; padding: 10px; border: 1px solid #e4e5e7; border-radius: 8px; background: #fff; cursor: pointer; font-weight: 600; color: #404145; transition: all 0.2s;">₹500</button>
                    <button class="wallet-preset-btn" data-amt="1000" style="flex: 1; padding: 10px; border: 1px solid #e4e5e7; border-radius: 8px; background: #fff; cursor: pointer; font-weight: 600; color: #404145; transition: all 0.2s;">₹1000</button>
                    <button class="wallet-preset-btn" data-amt="2000" style="flex: 1; padding: 10px; border: 1px solid #e4e5e7; border-radius: 8px; background: #fff; cursor: pointer; font-weight: 600; color: #404145; transition: all 0.2s;">₹2000</button>
                    <button class="wallet-preset-btn" data-amt="5000" style="flex: 1; padding: 10px; border: 1px solid #e4e5e7; border-radius: 8px; background: #fff; cursor: pointer; font-weight: 600; color: #404145; transition: all 0.2s;">₹5000</button>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #74767e; margin-bottom: 8px;">Or enter custom amount</label>
                    <div style="position: relative;">
                        <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #74767e; font-weight: 600;">₹</span>
                        <input type="number" id="wallet-custom-amt" placeholder="1500" style="width: 100%; padding: 12px 12px 12px 30px; border: 1px solid #c5c6c9; border-radius: 8px; outline: none; font-size: 1rem; font-weight: 600; color: #404145; box-sizing: border-box;">
                    </div>
                </div>
                <button id="confirm-topup-btn" style="width: 100%; background: var(--primary); color: #fff; padding: 14px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: opacity 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px;">
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
                b.style.borderColor = '#e4e5e7';
                b.style.color = '#404145';
                b.style.background = '#fff';
            });
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.color = 'var(--primary)';
            e.target.style.background = 'rgba(29, 191, 115, 0.05)';
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
