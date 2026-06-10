let infiniteScroll;
let page = 1;
let maxPage;

let allGenres = [];
let isExpanded = false; 
let allPlatforms = [];
const allowedIds = [4,187,1,18,186,7,3,21,14,16,15];

//eventos
searchBtn.addEventListener("click", () => {
    const query = searchImput.value.trim();
    if(query){
        location.hash = "#search=" + encodeURIComponent(query);
    }
});
headerTitle.addEventListener("click", ()=>{
    location.hash = "#home";
})
searchImput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchImput.value.trim();

    if (query) {
      location.hash = "#search=" + encodeURIComponent(query);
    }
  }
});


window.addEventListener("hashchange", navigation);



function navigation(){

    if (infiniteScroll) {
      window.removeEventListener('scroll', infiniteScroll);
      infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#game=')){
       gamesDetail();
    }
    else if (location.hash.startsWith('#search=')) {
       searchPage();
    }
    else if (location.hash.startsWith('#genre=')) {
       genrePage();
    }
    else if (location.hash.startsWith('#platform=')) {
       platformPage();
    }
    else {
        homePage();
    }

    if (infiniteScroll) {
      window.addEventListener('scroll', infiniteScroll);
    }
}

function gamesDetail(){
    console.log("Game");

    gamesList.classList.add("inactive");
    genreContainer.classList.add("inactive");
    gamesDetailContainer.classList.remove("inactive");


    const [_, gameid] = location.hash.split('=');
    getGameById(gameid);
}

function homePage(){
    
    page = 1;

    gamesList.classList.remove("inactive");
    gamesDetailContainer.classList.add("inactive");
    genreContainer.classList.add("inactive")

    searchImput.value = "";

    Game();
    

    infiniteScroll = getPaginatedGames;
}

function searchPage(){

    page = 1;

    console.log("SEARCH PAGE");

    gamesList.classList.remove("inactive");
    genreContainer.classList.add("inactive");
    gamesDetailContainer.classList.add("inactive");

    const [_, query] = location.hash.split('=');
    const decodedQuery = decodeURIComponent(query);

    getGameBySearch(decodedQuery);

    infiniteScroll = getPaginatedSearch(decodedQuery);
}
function genrePage(){

    page = 1;

    gamesList.classList.add("inactive");
    gamesDetailContainer.classList.add("inactive");
    genreContainer.classList.remove("inactive");

    const [_, slug] = location.hash.split('=');

    const genre = allGenres.find(g => g.slug === slug);

     if (genre) {

        genreContainer.innerHTML = `
          <h2 class="title-genre">${genre.name}</h2>
        `;

        gamesByGenres(genre.slug);
    }
    infiniteScroll = getPaginatedGenres(slug);
}
function platformPage(){

    page = 1;

    gamesList.classList.add("inactive");
    gamesDetailContainer.classList.add("inactive");
    genreContainer.classList.remove("inactive");

    const [_, slug] = location.hash.split('=');

    const platform = allPlatforms.find(p => p.slug === slug);

    if (platform) {

        genreContainer.innerHTML = `
          <h2 class="title-genre">${platform.name}</h2>
        `;

        getGamesByPlatforms(platform.id);

        infiniteScroll = getPaginatedPlatforms(platform.id);
    }
}

getGenres();
getPlatforms();
navigation();