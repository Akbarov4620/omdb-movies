const API_KEY = "51131028"
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`
const IMG_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`

const elForm = document.querySelector("[data-movie-form]")
const elList = document.querySelector("[data-movie-list]")

elForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    const formData = new FormData(elForm)
    const name = formData.get("name") 
    searchMovies(name)
})

async function searchMovies(query) {
    elList.innerHTML = `<h3 class="loading">Loading ...</h3>`
    const res = await fetch(`${API_URL}&s=${query}`)
    const searchResult = await res.json()

    renderMovies(searchResult.Search)
}

function renderMovies(movies) {
    elList.innerHTML = ""
    let html = ""
    movies.forEach(movie => {
        html += `<li><button type="button" data-movie-info="#modal"><img src="${movie.Poster}" alt="${movie.Title}" /></button>${movie.Title}</li>`
        
        // const elMovieButton = document.querySelector("[data-movie-info]").dataset.id = movie.imdbID
        const elMovieImg = document.querySelector("[data-movie-poster]")
        const elMovieTitle = document.querySelector("[data-movie-title]")
        const elMovieYear = document.querySelector("[data-movie-year]")
            
        elMovieImg.src = movie.Poster
        elMovieTitle.textContent = `Title: ${movie.Title}`
        elMovieYear.textContent = `Year: ${movie.Year}`
    });


    elList.innerHTML = html
}

document.addEventListener("click", (evt) => {
    modalOpen(evt)
    modalOutsideClick(evt)
    modalClose(evt)
})

function modalOpen(evt) {
    const el = evt.target.closest("[data-movie-info]")
    
    if(!el) return;
    
    const modalSelector = el.dataset.movieInfo
    
    document.querySelector(modalSelector).classList.add("show")
    
    // const id = el.dataset.id

    // renderMovies(movies)
}

function modalOutsideClick(evt) {
    const el = evt.target
    
    if(!el.matches("[data-movie-modal]")) return;

    el.classList.remove("show")
}

function modalClose(evt) {
    const el = evt.target.closest("[data-button-close]")
    
    if(!el) return;

    el.closest("[data-movie-modal]").classList.remove("show")
}

// function renderModal(movies) {
//     let html = ""
//     const movie = movies.find(movie => movie.imdbID === item)
// }