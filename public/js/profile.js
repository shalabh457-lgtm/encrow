document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});

function loadProfileData() {

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user') || 'Top Seller';

    const userProfile = {
        username: username,
        img: `https://i.pravatar.cc/150?u=${username}`,
        country: 'India',
        memberSince: 'Nov 2021',
        description: 'Hi, I am a professional freelancer with 5+ years of experience in my field. I strive to deliver the best quality work to my clients and ensure they are 100% satisfied.',
        languages: 'English, Hindi',
        skills: ['Web Design', 'Graphic Design', 'WordPress', 'HTML', 'CSS']
    };

    document.getElementById('profile-name').innerText = userProfile.username;
    document.getElementById('profile-desc').innerText = userProfile.description.substring(0, 50) + '...';
    document.getElementById('profile-full-desc').innerText = userProfile.description;
    document.getElementById('profile-country').innerText = userProfile.country;
    document.getElementById('profile-member-since').innerText = userProfile.memberSince;
    document.getElementById('profile-languages').innerText = userProfile.languages;
    document.getElementById('gigs-owner-name').innerText = userProfile.username;
    document.getElementById('profile-avatar').src = userProfile.img;

    const skillsContainer = document.getElementById('profile-skills');
    skillsContainer.innerHTML = '';
    userProfile.skills.forEach(skill => {
        const skillEl = document.createElement('span');
        skillEl.className = 'border rounded-full px-3 py-1 text-xs text-gray-600';
        skillEl.innerText = skill;
        skillsContainer.appendChild(skillEl);
    });

    let userGigs = [];
    if (window.MockData && window.MockData.gigs) {
        userGigs = window.MockData.gigs.filter(g => g.username === userProfile.username);
    }

    if (userGigs.length === 0 && window.MockData && window.MockData.gigs) {
        userGigs = window.MockData.gigs.slice(0, 3);
    }

    renderGigs(userGigs);
}

function renderGigs(gigs) {
    const container = document.getElementById('profile-gigs-container');
    container.innerHTML = '';

    gigs.forEach(gig => {
        const rating = !isNaN(gig.totalStars / gig.starNumber) ? Math.round(gig.totalStars / gig.starNumber) : 0;

        const gigCard = `
            <div class="w-full shadow-box flex items-start flex-col justify-start border group cursor-pointer hover:shadow-lg transition-shadow bg-white h-full" onclick="window.location.href='gig.html?id=${gig.id}'">
                <img src="${gig.cover || gig.img}" alt="Gig Cover" class="w-full object-cover h-[200px]" />
                <div class="w-full pt-5 flex items-start flex-col gap-3 justify-between flex-grow">
                    <div class="flex flex-col gap-3 w-full">
                        <div class="flex items-center justify-start gap-3 px-4">
                            <div class="w-8 h-8">
                                <img src="${gig.userImg}" alt="${gig.username}" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="flex flex-col items-start justify-start">
                                <h2 class="text-sm font-medium text-darkColor">${gig.username}</h2>
                                <p class="text-sm font-normal text-gray-400">Seller</p>
                            </div>
                        </div>
                        <p class="text-darkColor text-base group-hover:text-primary transition-all duration-300 px-4 line-clamp-2">
                            ${gig.title}
                        </p>
                        <p class="flex items-center justify-start gap-1 text-yellow-400 font-semibold px-4">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>
                            ${rating}
                        </p>
                    </div>
                    <div class="border-t w-full p-4 flex items-center justify-between mt-4">
                        <span class="text-gray-400 hover:text-red-500 transition-colors" onclick="event.stopPropagation();">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path></svg>
                        </span>
                        <span class="text-sm font-normal text-gray-500 uppercase">
                            Starting At <span class="text-xl font-semibold text-darkColor normal-case">${window.MockData.formatPrice(gig.price)}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += gigCard;
    });
}
