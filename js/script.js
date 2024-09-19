const searchForm = document.getElementById('search-form');
const mainSection = document.getElementById('results');
const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
let movieIdArray = [];

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchFormData = new FormData(searchForm);
    const movie = searchFormData.get('movie-search');
    getMovieID(movie);
});

mainSection.addEventListener('click', (e) => {
    let target = e.target;

    // Traverse up the DOM to find the button element
    while (target && !target.classList.contains('movie__watchlist-button')) {
        target = target.parentElement;
    }

    if (target && target.classList.contains('movie__watchlist-button')) {
        const imdbID = target.dataset.name;
        target.setAttribute('disabled', ''); // Disable button to avoid multiple clicks
        addToWatchList(imdbID);
    }
});

function addToWatchList(imdbID) {
    fetch(`https://www.omdbapi.com/?apikey=7bb80b3&i=${imdbID}&type=movie&plot=short`)
        .then(res => res.json())
        .then(data => {
            if (!watchList.some(movie => movie.imdbID === imdbID)) {
                watchList.push(data);
                localStorage.setItem('watchList', JSON.stringify(watchList));
                updateButtonState(imdbID, true);
            } else {
                updateButtonState(imdbID, false);
            }
        }).catch(err => {
        console.error('Failed to add to watchlist:', err);
    });
}

function updateButtonState(imdbID, added) {
    const button = document.querySelector(`button[data-name='${imdbID}']`);
    if (added) {
        button.innerHTML = `<p class="movie-data"><span style="color: #08a32a; font-weight: 500;">&#10003 Added</span></p>`;
        button.setAttribute('disabled', '');
    } else {
        button.removeAttribute('disabled');
    }
}

function getMovieID(movieInput) {
    fetch(`https://www.omdbapi.com/?apikey=7bb80b3&s=${movieInput}&type=movie`)
        .then(res => res.json())
        .then(data => {
            movieIdArray = [];
            if (data.Search) {
                mainSection.innerHTML = "";
                for (let movieIds of data.Search) {
                    movieIdArray.push(movieIds.imdbID);
                }
                fetchMovieDetails();
            } else {
                mainSection.innerHTML = `<h2 class="heading-secondary">Unable to find what you’re looking for. Please try another search.</h2>`;
            }
        });
}

function fetchMovieDetails() {
    for (let id of movieIdArray) {
        fetch(`https://www.omdbapi.com/?apikey=7bb80b3&i=${id}&type=movie&plot=short`)
            .then(res => res.json())
            .then(data => {
                if (data.Title) {
                    mainSection.innerHTML += `
                        <div class="container-results">
                            <img src="${data.Poster}" class="movie__poster" alt="movie poster">
                            <div class="movie__details">
                                <div class="movie__header">
                                    <h3 class="movie__title">${data.Title}</h3>
                                    <div class="movie__rating">
                                        <img src="/img/star-icon.png" class="star-icon" alt="star icon">
                                        <p class="movie__rating-value" style="color: ${setRatingColor(data.imdbRating)};">${data.imdbRating}</p>
                                    </div>
                                </div>
                                <div class="movie__meta">
                                    <p class="movie__runtime">${data.Runtime}</p>
                                    <p class="movie__genre">${data.Genre}</p>
                                    <button class="movie__watchlist-button" data-name="${data.imdbID}">
                                        <img src="/img/add-icon.png" alt="add icon" class="btn__add-movie" data-name="${data.imdbID}">
                                        <p class="button-text" data-name="${data.imdbID}">Watchlist</p>
                                    </button>
                                </div>
                                <p class="movie__plot">${data.Plot}</p>
                            </div>
                        </div>
                        <hr>
                    `;

                    if (watchList.some(movie => movie.imdbID === data.imdbID)) {
                        updateButtonState(data.imdbID, true);
                    }
                }
            }).catch(err => {
            console.error('Failed to fetch movie details:', err);
        });
    }
}

function setRatingColor(rating) {
    if (rating >= 8) {
        return '#08a32a';
    } else if (rating >= 5) {
        return '#ffa500';
    } else {
        return 'red';
    }
}