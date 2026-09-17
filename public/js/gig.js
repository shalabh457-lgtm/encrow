document.addEventListener('DOMContentLoaded', () => {
    loadGigData();
});

function loadGigData() {

    const urlParams = new URLSearchParams(window.location.search);
    const gigId = urlParams.get('id');

    let gig = null;
    if (window.MockData && window.MockData.gigs) {
        gig = window.MockData.gigs.find(g => g.id === gigId);
    }

    if (!gig && window.MockData && window.MockData.gigs && window.MockData.gigs.length > 0) {
        gig = window.MockData.gigs[0];
    }

    if (!gig) {
        document.getElementById('gig-title').innerText = "Gig not found";
        return;
    }

    const rating = !isNaN(gig.totalStars / gig.starNumber) ? Math.round(gig.totalStars / gig.starNumber) : 0;

    document.getElementById('gig-category').innerText = gig.cat;
    document.getElementById('gig-title').innerText = gig.title;

    document.getElementById('seller-name-top').innerText = gig.username;
    document.getElementById('seller-avatar-top').src = gig.userImg;
    document.getElementById('seller-link-top').href = `profile.html?user=${gig.username}`;
    document.getElementById('gig-rating').innerText = `${rating} (${gig.starNumber})`;

    document.getElementById('gig-image').src = gig.cover || gig.img;
    document.getElementById('gig-desc').innerText = gig.fullDesc || gig.description;

    document.getElementById('seller-name-bottom').innerText = gig.username;
    document.getElementById('seller-avatar-bottom').src = gig.userImg;
    document.getElementById('seller-link-bottom').href = `profile.html?user=${gig.username}`;
    document.getElementById('seller-name-link-bottom').href = `profile.html?user=${gig.username}`;

    document.getElementById('gig-price').innerText = window.MockData.formatPrice(gig.price);
    document.getElementById('gig-short-desc').innerText = gig.description;

    if (gig.deliveryTime) {
        document.getElementById('gig-delivery').innerText = gig.deliveryTime + " Delivery";
    }

    if (gig.revisions) {
        document.getElementById('gig-revisions').innerText = gig.revisions + " Revisions";
    }

    createCompareModal(gig);

    const compareBtn = document.querySelector('.btn-compare');
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            const modal = document.getElementById('compare-modal');
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            modal.children[0].style.transform = 'translateY(0)';
        });
    }
}

function createCompareModal(gig) {
    if (document.getElementById('compare-modal')) return;
    
    // Mock the packages based on base gig data
    const basePrice = gig.price;
    const baseRev = parseInt(gig.revisions) || 1;
    
    const p1 = { name: "Basic", desc: "Standard delivery with basic features.", price: basePrice, delivery: gig.deliveryTime, revisions: baseRev };
    const p2 = { name: "Standard", desc: "Faster delivery with standard features and source files.", price: Math.round(basePrice * 1.5), delivery: gig.deliveryTime, revisions: baseRev + 2 };
    const p3 = { name: "Premium", desc: "Express delivery with premium features and VIP support.", price: Math.round(basePrice * 2.5), delivery: gig.deliveryTime, revisions: "Unlimited" };

    const modalHtml = `
        <div id="compare-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1100; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s; padding: 20px;">
            <div style="background: #fff; width: 800px; max-width: 100%; border-radius: 12px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transform: translateY(30px); transition: transform 0.3s; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: #404145;">Compare Packages</h2>
                    <button id="close-compare-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #74767e; padding: 4px; display: flex; align-items: center;">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z"></path></svg>
                    </button>
                </div>
                
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th style="width: 25%;">Package</th>
                            <th style="width: 25%;"><div class="pkg-price">₹${p1.price.toLocaleString('en-IN')}</div><div class="pkg-name">${p1.name}</div></th>
                            <th style="width: 25%;"><div class="pkg-price">₹${p2.price.toLocaleString('en-IN')}</div><div class="pkg-name">${p2.name}</div></th>
                            <th style="width: 25%;"><div class="pkg-price">₹${p3.price.toLocaleString('en-IN')}</div><div class="pkg-name">${p3.name}</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Description</td>
                            <td>${p1.desc}</td>
                            <td>${p2.desc}</td>
                            <td>${p3.desc}</td>
                        </tr>
                        <tr>
                            <td>Delivery Time</td>
                            <td>${p1.delivery}</td>
                            <td>${p2.delivery}</td>
                            <td>${p3.delivery}</td>
                        </tr>
                        <tr>
                            <td>Revisions</td>
                            <td>${p1.revisions}</td>
                            <td>${p2.revisions}</td>
                            <td>${p3.revisions}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button class="btn-select-pkg" data-pkg="basic">Select</button></td>
                            <td><button class="btn-select-pkg" data-pkg="standard">Select</button></td>
                            <td><button class="btn-select-pkg btn-select-premium" data-pkg="premium">Select</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('compare-modal');
    
    document.getElementById('close-compare-modal').addEventListener('click', () => {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.children[0].style.transform = 'translateY(30px)';
    });

    document.querySelectorAll('.btn-select-pkg').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const originalText = e.target.innerText;
            e.target.innerText = 'Selected!';
            setTimeout(() => {
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                modal.children[0].style.transform = 'translateY(30px)';
                setTimeout(() => {
                    e.target.innerText = originalText;
                }, 300);
            }, 800);
        });
    });
}
