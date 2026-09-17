// 1. Wait for the HTML page to fully load before running our script
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});

// Main function to load the profile page
function loadProfileData() {
    // 2. Get the username from the web address (URL)
    // Example: If URL is profile.html?user=john, 'username' becomes 'john'
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user') || 'Top Seller'; // Default if no user is provided

    // 3. Create mock (fake) data for this user's profile
    const userProfile = {
        username: username,
        img: `https://i.pravatar.cc/150?u=${username}`, // Generate a random avatar picture using an API
        country: 'India',
        memberSince: 'Nov 2021',
        description: 'Hi, I am a professional freelancer with 5+ years of experience in my field. I strive to deliver the best quality work to my clients and ensure they are 100% satisfied.',
        languages: 'English, Hindi',
        skills: ['Web Design', 'Graphic Design', 'WordPress', 'HTML', 'CSS']
    };

    // 4. Update the HTML page with the user's data
    // We find elements by their ID and change their text or source
    document.getElementById('profile-name').innerText = userProfile.username;
    
    // Show a short version of the description (first 50 characters), and the full version elsewhere
    document.getElementById('profile-desc').innerText = userProfile.description.substring(0, 50) + '...';
    document.getElementById('profile-full-desc').innerText = userProfile.description;
    
    // Fill in the rest of the details
    document.getElementById('profile-country').innerText = userProfile.country;
    document.getElementById('profile-member-since').innerText = userProfile.memberSince;
    document.getElementById('profile-languages').innerText = userProfile.languages;
    document.getElementById('gigs-owner-name').innerText = userProfile.username;
    document.getElementById('profile-avatar').src = userProfile.img; // Update the image source

    // 5. Display the user's skills as little tags
    const skillsContainer = document.getElementById('profile-skills');
    skillsContainer.innerHTML = ''; // Clear any existing skills first
    
    // Loop through each skill in the array and create an HTML element for it
    userProfile.skills.forEach(skill => {
        const skillEl = document.createElement('span');
        skillEl.className = 'border rounded-full px-3 py-1 text-xs text-gray-600'; // Add styling classes
        skillEl.innerText = skill; // Set the text to the skill name
        skillsContainer.appendChild(skillEl); // Add it to the page
    });

    // 6. Find and display the gigs (services) this user is selling
    let userGigs = [];
    
    // Look through all the gigs in our fake database (MockData) from data.js
    if (window.MockData && window.MockData.gigs) {
        // Only keep the gigs where the username matches our profile username
        userGigs = window.MockData.gigs.filter(gig => gig.username === userProfile.username);
    }

    // Fallback: If they don't have any gigs, just show 3 random ones as an example
    if (userGigs.length === 0 && window.MockData && window.MockData.gigs) {
        userGigs = window.MockData.gigs.slice(0, 3);
    }

    // Finally, draw the gig cards on the screen
    renderGigs(userGigs);
}

// Helper function to create the HTML layout for the gig cards
function renderGigs(gigs) {
    const container = document.getElementById('profile-gigs-container');
    if (!container) return; // Safety check
    
    container.innerHTML = ''; // Clear container before adding new cards

    // Loop through every gig and generate the HTML for it
    gigs.forEach(gig => {
        // Calculate the rating (e.g. 5 stars) out of total votes
        const rating = !isNaN(gig.totalStars / gig.starNumber) ? Math.round(gig.totalStars / gig.starNumber) : 0;

        // Create the card layout using backticks (Template Literals)
        // This lets us inject variables using ${}
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
                            <!-- SVG Star Icon -->
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>
                            ${rating}
                        </p>
                    </div>
                    
                    <div class="border-t w-full p-4 flex items-center justify-between mt-4">
                        <span class="text-gray-400 hover:text-red-500 transition-colors" onclick="event.stopPropagation();">
                            <!-- SVG Heart Icon -->
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path></svg>
                        </span>
                        
                        <span class="text-sm font-normal text-gray-500 uppercase">
                            Starting At <span class="text-xl font-semibold text-darkColor normal-case">${window.MockData.formatPrice(gig.price)}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Inject the generated HTML into our container on the page
        container.innerHTML += gigCard;
    });
}

