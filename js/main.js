const API_KEY = "51131028";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const IMG_URL = `https://img.omdbapi.com/?apikey=${API_KEY}`;

const elForm = document.querySelector("[data-movie-form]");
const elList = document.querySelector("[data-movie-list]");
const elPagination = document.querySelector("[data-movie-pagination]");
const elMovieModal = document.querySelector("[data-movie-modal]");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);
  const name = formData.get("name");
  const year = formData.get("year");
  const type = formData.get("type");
  searchMovies(name, year, type);
});

async function searchMovies(query, year, type, page = 1) {
  elList.innerHTML = `<div class="loading"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;
  let res = await fetch(
    `${API_URL}&s=${query}&y=${year}&type=${type}&page=${page}`
  );
  const searchResult = await res.json();

  if (searchResult.Error) {
    alert(searchResult.Error);
    return;
  }

  renderMovies(searchResult.Search);
  renderPagination(
    Math.ceil(+searchResult.totalResults / 10),
    query,
    year,
    type,
    page
  );
}

async function getMovie(movieId) {
  const res = await fetch(`${API_URL}&i=${movieId}`);

  return await res.json();
}

function renderMovies(movies) {
  elList.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    const moviePosterUrl =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/200x296"
        : movie.Poster;
    html += `<li>
        <button type="button" data-movie-info="#modal" data-movie-id="${movie.imdbID}">
        <img src="${moviePosterUrl}" alt="${movie.Title}" />
        </button><h3>${movie.Title}</h3></li>`;
  });

  elList.innerHTML = html;
}

function renderPagination(totalPages, query, page) {
  elPagination.innerHTML = "";
  let html = "";

  html += `<li class="page-item ${+page === 1 ? "disabled" : ""}">
  <a class="page-link" data-movie-page=${
    +page - 1
  } data-movie-query="${query}" href="?page=${+page - 1}">Previous</a>
</li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item${
      +page === i ? " active" : ""
    }"><a class="page-link" data-movie-page=${i} data-movie-query="${query}" href="?page=${i}">${i}</a></li>`;
  }

  html += `<li class="page-item ${+page === totalPages ? " disabled" : ""}">
  <a class="page-link" data-movie-page=${
    +page + 1
  } data-movie-query="${query}" href="?page=${+page + 1}">Next</a>
</li>`;

  elPagination.innerHTML = html;
}

document.addEventListener("click", (evt) => {
  modalOpen(evt);
  modalOutsideClick(evt);
  modalClose(evt);
  onPageClick(evt);
});

function modalOpen(evt) {
  const el = evt.target.closest("[data-movie-info]");

  if (!el) return;

  const modalSelector = el.dataset.movieInfo;
  const movieId = el.dataset.movieId;
  const elModal = document.querySelector(modalSelector);
  const elModalSpinner = elModal.querySelector("[data-spinner]");

  fillModal(movieId, elModalSpinner);

  elModal.classList.add("show");
}

function modalOutsideClick(evt) {
  const el = evt.target;

  if (!el.matches("[data-movie-modal]")) return;

  el.classList.remove("show");
}

function modalClose(evt) {
  const el = evt.target.closest("[data-button-close]");

  if (!el) return;

  el.closest("[data-movie-modal]").classList.remove("show");
}

function onPageClick(evt) {
  const el = evt.target.closest("[data-movie-page]");

  if (!el) return;

  evt.preventDefault();

  searchMovies(el.dataset.movieQuery, el.dataset.moviePage);
}

async function fillModal(movieId, elModalSpinner) {
  elModalSpinner.classList.remove("d-none");
  const movie = await getMovie(movieId);

  elMovieModal.querySelector("[data-movie-poster]").src = movie.Poster;
  elMovieModal.querySelector(
    "[data-movie-title]"
  ).textContent = `Title: ${movie.Title}`;
  elMovieModal.querySelector(
    "[data-movie-year]"
  ).textContent = `Year: ${movie.Year}`;
  elMovieModal.querySelector(
    "[data-movie-country]"
  ).textContent = `Country: ${movie.Country}`;
  elMovieModal.querySelector(
    "[data-movie-genre]"
  ).textContent = `Genre: ${movie.Genre}`;
  elMovieModal.querySelector(
    "[data-movie-rating]"
  ).textContent = `Rating: ${movie.imdbRating}`;
  elMovieModal.querySelector(
    "[data-movie-type]"
  ).textContent = `Type: ${movie.Type}`;
  elMovieModal.querySelector(
    "[data-movie-plot]"
  ).textContent = `Plot: ${movie.Plot}`;

  elMovieModal.querySelector("[data-movie-title]").style.fontSize = "18px";

  elModalSpinner.classList.add("d-none");
}
