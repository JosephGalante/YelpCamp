const sortAlphaAscBtn = document.querySelector('#alphabetSortAsc');
sortAlphaAscBtn.addEventListener('click', (e) => {
	sortby('alphaAsc');
});

const sortAlphaDescBtn = document.querySelector('#alphabetSortDesc');
sortAlphaDescBtn.addEventListener('click', (e) => {
	sortby('alphaDesc');
});

const sortPriceAscBtn = document.querySelector('#priceSortAsc');
sortPriceAscBtn.addEventListener('click', (e) => {
	sortby('priceAsc');
});

const sortPriceDescBtn = document.querySelector('#priceSortDesc');
sortPriceDescBtn.addEventListener('click', (e) => {
	sortby('priceDesc');
});

const newestSortBtn = document.querySelector('#mostRecentSort');
newestSortBtn.addEventListener('click', (e) => {
	sortby('newest');
});

const oldestSortBtn = document.querySelector('#oldestSort');
oldestSortBtn.addEventListener('click', (e) => {
	sortby('oldest');
});

async function sortby(by) {

    let campgrounds1 = '';

    switch (by) {
        case 'alphaAsc':
            campgrounds1 = campgrounds.features.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
            document.getElementById('dropdownMenuLink').innerText = 'Alphabetically (A-Z)';
            break;
        case 'alphaDesc':
            campgrounds1 = campgrounds.features.sort((a, b) => (a.title > b.title ? -1 : b.title > a.title ? 1 : 0));
            document.getElementById('dropdownMenuLink').innerText = 'Alphabetically (Z-A)';
            break;
        case 'priceAsc':
            campgrounds1 = campgrounds.features.sort((a, b) => (a.price > b.price ? 1 : b.price > a.price ? -1 : 0));
            document.getElementById('dropdownMenuLink').innerText = 'Price: low to high';
            break;
        case 'priceDesc':
            campgrounds1 = campgrounds.features.sort((a, b) => (a.price > b.price ? -1 : b.price > a.price ? 1 : 0));
            document.getElementById('dropdownMenuLink').innerText = 'Price: high to low';
            break;
        case 'newest':
            campgrounds1 = campgrounds.features.sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0));
            document.getElementById('dropdownMenuLink').innerText = 'Newest';
            break;
        case 'oldest':
            campgrounds1 = campgrounds.features.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));
            document.getElementById('dropdownMenuLink').innerText = 'Newest';
            break;
        default:
            return;
    }
	
	document.getElementById('cards').innerHTML = '';

	campgrounds1.forEach((c) => {
		document.getElementById('cards').innerHTML += displayCard(c);
	});
}


function displayCard(c) {
	const { id, title, location, description, reviews, images, price } = c;

	let avgRating = 0;
	if (reviews.length) {
		for (review of reviews) {
			avgRating += review.rating;
		}
		avgRating /= reviews.length;

		const num_emptyStars = 5 - Math.ceil(Math.round(avgRating * 2) / 2);

		let stars = '';
		for (let i = 0; i < Math.floor(avgRating); i++) {
			stars += `<i class="fas fa-star full-star" style="color: #fbbd06"></i>`;
		}

		let halfStars = '';
		if (avgRating - Math.floor(avgRating) > 0.2) {
			halfStars += `<i class="fas fa-star-half-alt" style="color: #fbbd06"></i>`;
		}

		let emptyStars = '';
		for (let i = 0; i < num_emptyStars; i++) {
			emptyStars += `<i class="far fa-star empty-star" style="color: #fbbd06"></i>`;
		}

        const card = `
            <div class="card mb-3">
                <div class="campground-card row" >
                    <div class="col-md-4">
                        <a class="campground-link" href="/campgrounds/${id}">
                            <img class="img-fluid rounded" alt="" src="${images[0].url}">
                        </a>
                    </div>
                    
                    <div class="col-md-8">
                        <div class="card-body">
                            <a class="campground-link pb-0 mb-0" href="/campgrounds/${id}">
                                <div class="card-title pb-0 mb-0" style="display: flex; justify-content: space-between;">
                                    <h3 class="mb-0 pb-0">${title}</h3> 
                                    <h4>$${price}</h4>
                                </div>
                            </a>

                            <a class="campground-link" href="/campgrounds/${id}">
                                <div class="text-muted my-3">
                                
                                <span class="me-1">${(Math.round(avgRating * 10) / 10).toFixed(1)}</span>
                                
                                ${stars} ${halfStars}${emptyStars}
                                
                                <a class="reviewLink" href="/campgrounds/${id}"><span class="ms-2" style="color: #1a73e8;">${reviews.length} reviews</span></a>
                                
                                </div>
                            </a>

                            <a class="campground-link" href="/campgrounds/${id}"><h5 class="card-subtitle mb-3 text-muted">${location}</h5></a>
                        
                            <a class="campground-link" href="/campgrounds/${id}">
                                <p class="card-text my-4">
                                    ${description}
                                </p>
                            </a>
                        </div> 
                    </div>
                </div>
            </div>`;
		return card;
	} else {
		card = `<div class="card mb-3">
        
            <div class="campground-card row" >
                
                <div class="col-md-4">
                    <a class="campground-link" href="/campgrounds/${id}">
                        <img class="img-fluid rounded" alt="" src="${images[0].url}">
                    </a>
                </div>
                
                <div class="col-md-8">
                    <div class="card-body">

                        <a class="campground-link" href="/campgrounds/${id}">
                            <div class="card-title mb-3" style="display: flex; justify-content: space-between;">
                                <h3>${title}</h3> 
                                <h4>$${price}</h4>
                            </div>
                        </a>

                        <a class="campground-link" href="/campgrounds/${id}"><h5 class="card-subtitle mb-3 text-muted">${location}</h5></a>
                    
                        <a class="campground-link" href="/campgrounds/${id}">
                            <p class="card-text my-4">
                                ${description}
                            </p>
                        </a>
                    </div> 
                </div>
            </div>
        </div>`;
		return card;
	}
}
