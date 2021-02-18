// global variables
var allMoviesUrl = 'https://my-json-server.typicode.com/moviedb-tech/movies/list';
var moviesUrl = 'https://my-json-server.typicode.com/moviedb-tech/movies/list/';  //needs id
var starFullSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Five_Pointed_Star_Solid.svg/260px-Five_Pointed_Star_Solid.svg.png";
var starEmptySrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/64px-Empty_Star.svg.png";

var favoriteMovies = {};
var moviesJSON = new Array();

// json methods
var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

// get all movies
var getAllMovies = function () {

    var callback = function (err, movies) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            //receive favorite movies list from storage
            if (localStorage && localStorage.getItem("favoriteMovies")) {
                favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
            } else {
                favoriteMovies = {};
            }

            //if not already json pars into it
            if (typeof movies === 'string') {
                moviesJSON = JSON.parse(movies);
            } else {
                moviesJSON = movies;
            }

            parseMovies(moviesJSON);
            parseFavoriteMovies();

            parseGenres(moviesJSON);
        }
    };

    getJSON(allMoviesUrl, callback);
}

var parseGenres = function (moviesList) {
    var genres = receiveGeneresList(moviesList);

    genres.forEach(showGenres);

    function showGenres(genre) {
        var hSelectGenre = document.getElementById("select-genre");

        var hNewGenre = [
            //onSelect=\"filterMoviesByGenre(\"" + genre + "\")
            "<option value=\"" + genre + "\">",
            genre,
            "</option>"
        ]

        hSelectGenre.insertAdjacentHTML('beforeend', hNewGenre.join(""));
    }
}

var parseMovies = function (moviesList) {

    for (var i = 0; i < moviesList.length; i++) {
        showMovie(moviesList[i]);
    }

    function showMovie(movie) {
        var hGallery = document.getElementById("gallery-movies");
        var img = "<img src='" + movie.img + "' alt='" + movie.name + "' class=\"movie-image\" />";
        var starImgEmpty = "<img src='" + starEmptySrc + "' alt='" + movie.name + "' class=\"star-image star-image-empty\" id=\"movie-image-empty" + movie.id + "\"/>";
        var oneDescriptionSentence = movie.description.split(/[\.!\?]+/)[0];

        var hNewMovie = [
            "<div class=\"movie-tab\">",
                "<div onClick=toggleFavorite(\"" + movie.id + "\")>",
                    starImgEmpty,
                "</div>",
                "<div onClick=showMovieModal(\"" + movie.id + "\") class=\"movie\" id=\"movie" + movie.id + "\">",
                    img,
                    "<div class=\"movie-header-wraper\">",
                        "<h3>",
                            movie.name,
                        "</h3>",
                        "<h3>",
                            movie.year,
                        "</h3>",
                    "</div>",
                    "<br>",
                    "<p class=\"movie-descrition\">" + oneDescriptionSentence + "</p>",
                    "<div class=\"genres-movie-block\" id=\"genres-movie-block" + movie.id + "\">",
                    "</div >",
                "</div>",
            "</div>"
        ]

        hGallery.insertAdjacentHTML('beforeend', hNewMovie.join(""));

        movie.genres.map(function (genre) {
            var hGenres = [
                "<p class=\"genre\">",
                genre,
                "</p>"
            ]

            document.getElementById("genres-movie-block" + movie.id).insertAdjacentHTML('beforeend', hGenres.join(""));
        });
    }
}

// parse favorite movies
var parseFavoriteMovies = function() {
    for (movieId in favoriteMovies) {
        if (favoriteMovies[movieId]) {
            if (document.getElementById("movie-image-empty" + movieId)) {
                document.getElementById("movie-image-empty" + movieId).src = starFullSrc;
            }
            document.getElementById("movie-favorite-image").src = starFullSrc;

            if (!document.getElementById("favorite-movie" + movieId)) {
                showFavoriteMovie(movieId);
            }
        }
    }
}

//add remove from favorite list
var toggleFavorite = function(movieId) {
    if (favoriteMovies[movieId]) {
        favoriteMovies[movieId] = false;
        if (localStorage) {
            localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
        }

        document.getElementById("movie-image-empty" + movieId).src = starEmptySrc;
        document.getElementById("movie-favorite-image").src = starEmptySrc;
        removeMovieFromFavoriteList(movieId);
    } else {
        favoriteMovies[movieId] = true;
        if (localStorage) {
            localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
        }

        document.getElementById("movie-image-empty" + movieId).src = starFullSrc;
        document.getElementById("movie-favorite-image").src = starFullSrc;
        showFavoriteMovie(movieId);
    }
}

var showFavoriteMovie = function (movieId) {
    var hFavoriteMoviesList = document.getElementById("favorite-movies-list");

    moviesJSON.filter(function (favoriteMovie) {
        if (movieId === favoriteMovie.id.toString()) {

            var hFavoriteMovie = [
                "<p class=\"favorite-movie\" id=\"favorite-movie" + favoriteMovie.id + "\">",
                    "<button onClick=showMovieModal(\"" + favoriteMovie.id + "\") id=\"more-info-movie\"" + favoriteMovie.id + ">",
                        "<i class=\"fas fa-arrow-right\"></i>",
                    "</button>",
                    "<span onClick=showMovieModal(\"" + favoriteMovie.id + "\") class=\"favorite-film-name\">",
                        favoriteMovie.name,
                    "</span>",
                    "<button onClick= toggleFavorite(\"" + favoriteMovie.id + "\") class=\"remove-from-favorite\"" +
                    + "id =\"remove-from-favorite\"" + favoriteMovie.id + ">",
                        "<i class=\"fas fa-backspace\"></i>",
                    "</button>",
                "</p>"
            ]

            hFavoriteMoviesList.insertAdjacentHTML('beforeend', hFavoriteMovie.join(""));
        }
    });
}

var removeMovieFromFavoriteList = function (movieId) {
    document.getElementById("favorite-movie" + movieId).parentNode.removeChild(document.getElementById("favorite-movie" + movieId));
}

// When the user clicks on the button, open the modal
var showMovieModal = function (movieId) {
    // Get the modal
    var modal = document.getElementById("movie-modal");
    modal.style.display = "block";

    // parse data
    moviesJSON.filter(function (movie) {
        if (movieId === movie.id.toString()) {
            document.getElementById("movie-image").src = movie.img;
            document.getElementById("movie-name").innerText = movie.name;
            document.getElementById("movie-description").innerText = movie.description;
            document.getElementById("movie-year").innerText = movie.year;
            document.getElementById("director-name").innerText = movie.director;

            if (favoriteMovies[movieId]) {
                document.getElementById("movie-favorite-image").src = starFullSrc;
            } else {
                document.getElementById("movie-favorite-image").src = starEmptySrc;
            }

            document.getElementById("movie-favorite-image-container").setAttribute("onClick", "toggleFavorite(\"" + movie.id + "\")");

            movie.genres.map(function (genre) {
                var hGenres = [
                    "<p class=\"genre\">",
                    genre,
                    "</p>"
                ]

                document.getElementById("genres-block").insertAdjacentHTML('beforeend', hGenres.join(""));
            });

            document.getElementById("movie-stars").insertAdjacentHTML('beforeend', movie.starring.join());
        }
    });
}

// When the user clicks on <span> (x), close the modal
var closeMovieModal = function () {
    // Get the modal and hide it
    var modal = document.getElementById("movie-modal");
    modal.style.display = "none";

    // clear blocks
    document.getElementById("genres-block").innerHTML = "";
    document.getElementById("movie-stars").innerHTML = "";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    // Get the modal
    var modal = document.getElementById("movie-modal");
    if (event.target == modal) {
        closeMovieModal()
    }
}

var receiveGeneresList = function (moviesList) {
    var genresList = [];

    for (var i = 0; i < moviesList.length; i++) {
        genresList[i] = moviesList[i].genres;
    }

    var uniqGenres = Array.prototype.concat.apply([], genresList).reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);

    return uniqGenres; 
}

var filterMoviesByGenre = function (genre) {
    document.getElementById("gallery-movies").innerHTML = "";

    function filterByGenre(item) {
        if (item.genres.indexOf(genre) > -1) {
            return true;
        }
        return false;
    }

    var movies = moviesJSON.filter(filterByGenre);

    parseMovies(movies);
    parseFavoriteMovies();
}

var selectTabsView = function () {
    document.getElementById("gallery").className = "tabs-view"; 
}

var selectRowsView = function () {
    document.getElementById("gallery").className = "rows-view";
}

window.onload = getAllMovies;