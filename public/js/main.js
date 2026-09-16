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
                        <a href="#" id="logout-btn">Logout</a>
                    </div>
                </div>
            </div>
        `;

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
