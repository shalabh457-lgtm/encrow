document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    const searchQuery = urlParams.get('search');

    let gigs = window.MockData.gigs;

    if (category) {
        gigs = gigs.filter(g => g.cat.toLowerCase() === category.toLowerCase());
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        gigs = gigs.filter(g =>
            g.title.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q) ||
            g.cat.toLowerCase().includes(q) ||
            g.username.toLowerCase().includes(q)
        );
    }

    const pageTitle = category || searchQuery || 'All Gigs & Services';
    const breadcrumb = document.getElementById('breadcrumb-title');
    const heading = document.getElementById('page-heading');
    const subtitle = document.getElementById('page-subtitle');

    if (breadcrumb) breadcrumb.innerText = pageTitle;
    if (heading) heading.innerText = pageTitle;
    if (subtitle) {
        if (category) {
            subtitle.innerText = `Find top freelance experts in ${category} to help scale your business`;
        } else if (searchQuery) {
            subtitle.innerText = `Explore top freelance services matching "${searchQuery}"`;
        } else {
            subtitle.innerText = 'Find high-quality freelance services and talent for your business';
        }
    }

    renderGigs(gigs);
});

function renderGigs(gigs) {
    const container = document.getElementById('gigs-grid');
    if (!container) return;
    container.innerHTML = '';

    if (gigs.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png" alt="No Result" />
                <h2>Oops!🤷‍♂️ No gigs found in this category</h2>
            </div>
        `;
        return;
    }

    gigs.forEach(gig => {
        const rating = !isNaN(gig.totalStars / gig.starNumber) ? Math.round(gig.totalStars / gig.starNumber) : 0;

        const gigCard = `
            <div class="gig-card" onclick="window.location.href='gig.html?id=${gig.id}'">
                <img src="${gig.img}" alt="${gig.title}" class="gig-card-cover" />
                <div class="gig-card-body">
                    <div class="gig-card-user" onclick="event.stopPropagation(); window.location.href='profile.html?user=${gig.username}'">
                        <img src="${gig.userImg}" alt="${gig.username}" class="gig-card-avatar" />
                        <div>
                            <div class="gig-card-username">${gig.username}</div>
                            <div class="gig-card-seller-tag">${gig.rate}</div>
                        </div>
                    </div>

                    <div class="gig-card-title">${gig.title}</div>

                    <div class="gig-card-rating">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>
                        ${rating} <span class="rating-count">(${gig.starNumber})</span>
                    </div>
                </div>

                <div class="gig-card-footer">
                    <span class="gig-card-heart" onclick="event.stopPropagation();">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path></svg>
                    </span>
                    <span class="gig-card-price">
                        Starting At <strong>${window.MockData.formatPrice(gig.price)}</strong>
                    </span>
                </div>
            </div>
        `;
        container.innerHTML += gigCard;
    });
}
