const sectionWatchlist = document.getElementById('section-watchlist');
const returnedWatchList = JSON.parse(localStorage.getItem('watchList')) || [];

renderWatchList();

sectionWatchlist.addEventListener('click', handleWatchlistClick);

function handleWatchlistClick(event) {
    if (event.target.dataset.name) {
        const imdbID = event.target.dataset.name;
        const movieIndex = returnedWatchList.findIndex(movie => movie.imdbID === imdbID);

        if (movieIndex !== -1) {
            returnedWatchList.splice(movieIndex, 1);
            localStorage.setItem('watchList', JSON.stringify(returnedWatchList));
            renderWatchList();
        }
    }
}

function renderWatchList() {
    sectionWatchlist.innerHTML = '';

    if (returnedWatchList.length > 0) {
        sectionWatchlist.classList.add('add-margin-top');

        returnedWatchList.forEach(movie => {
            sectionWatchlist.innerHTML += `
                <div class="container-movie">
                    <img src="${movie.Poster}" class="movie__poster" alt="movie poster">
                    <div class="movie__details">
                        <div class="movie__header">
                            <h3 class="movie__title">${movie.Title}</h3>
                            <div class="movie__rating">
                                <img src="/img/star-icon.png" class="star-icon" alt="star icon">
                                <p class="movie__rating-value" style="color: ${setRatingColor(movie.imdbRating)};">${movie.imdbRating}</p>
                            </div>
                        </div>
                        <div class="movie__meta">
                            <p class="movie__runtime">${movie.Runtime}</p>
                            <p class="movie__genre">${movie.Genre}</p>
                            <button class="movie__watchlist-button" data-name="${movie.imdbID}">
                                <img src="/img/remove-icon.png" alt="minus icon" class="btn__remove-movie" data-name="${movie.imdbID}">
                                <p class="button-text" data-name="${movie.imdbID}">Remove</p>
                            </button>
                        </div>
                        <p class="movie__plot">${movie.Plot}</p>
                    </div>
                </div>
                <hr>
            `;
        });

    } else {
        sectionWatchlist.innerHTML = `
            <h2 class="heading-secondary">Your watchlist is looking a little empty...</h2>
            <a class="link-secondary" href="index.html">
                <div class="search-movies">
                    <img src="/img/add-icon.svg" class="icon-plus" alt="add icon">
                    <p>Let's add some movies!</p>
                </div>
            </a>
        `;
    }
}
// Render color based on rating to data.imbdRating
function setRatingColor(rating) {
    if (rating >= 8) {
        return '#08a32a';
    } else if (rating >= 5) {
        return '#ffa500';
    } else {
        return '#ff0000';
    }
}