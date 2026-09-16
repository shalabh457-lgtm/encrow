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
}
