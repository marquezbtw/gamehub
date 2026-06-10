const api = axios.create({
  baseURL: 'https://api.rawg.io/api/',
  headers: {'Content-Type': 'application/json;charset=utf-8'},
  params:{
    'key': API_KEY,
  },
});



const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {

      const img = entry.target;
      const url = img.getAttribute("data-img");

      img.src = url;

      lazyLoader.unobserve(img);
    }
  });
});

function createGames(games, container, lazyLoad = true) {

  games.forEach(game => {

    const card = document.createElement("div");
    card.classList.add("game-card");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("game-image-wrapper");

    const img = document.createElement("img");
    img.classList.add("game-img");

    img.alt = game.name;

    const imageURL = game.background_image
      ? game.background_image
      : 'https://static.platzi.com/static/images/error/img404.png';

    img.setAttribute(
      lazyLoad ? "data-img" : "src",
      imageURL
    );

    if (lazyLoad) {
      lazyLoader.observe(img);
    }

    const info = document.createElement("div");
    info.classList.add("game-info");

    const title = document.createElement("h3");
    title.classList.add("game-title");

    title.textContent = game.name;

    const rating = document.createElement("span");
    rating.classList.add("game-rating");

    rating.textContent = `⭐ ${game.rating}`;

    info.appendChild(title);
    info.appendChild(rating);

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(info);

    card.appendChild(imageWrapper);

    card.addEventListener("click", () => {
      location.hash = "#game=" + game.id;
    });

    container.appendChild(card);
  });
}

async function Game() {
    const {data} = await api ("games",{
        params: {
            ordering: "rating_top",
            page_size: 40,
            page,
        }
    });
    gameSection.innerHTML = "";
    const games = data.results;
    maxPage = Math.ceil(data.count / 40);

    createGames (games,gameSection)

    console.log(document.querySelectorAll(".game").length);
};
async function getPaginatedGames() {

  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  const scrollIsBottom =
    (scrollTop + clientHeight) >= (scrollHeight - 15);

  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {

    page++;

    const {data} = await api("games", {
      params: {
        ordering: "rating_top",
        page_size: 40,
        page,
      }
    });
    
      const games = data.results;

    createGames(games, gameSection);
  }
}

async function getGenres(){
  const {data} = await api ("genres");
  allGenres = data.results;

  maxPage = Math.ceil(data.count / 40);

  renderItems(allGenres, genresList,btnShowGenres,"genre");
  btnGenresToggle(allGenres,genresList,btnShowGenres,"genre");
}

function renderItems(list, container, btn, type){
  container.innerHTML=""

  const limit = isExpanded ? list.length:5;
  const itemToRender = list.slice(0,limit);


  itemToRender.forEach(item => {
    const genres = document.createElement("div");
    genres.textContent = item.name;
    

  genres.addEventListener("click",()=>{

  if (type === "genre") {
  location.hash = `#genre=${item.slug}`;
}

  if (type === "platform") {
  location.hash = `#platform=${item.slug}`;
}
});

    container.appendChild(genres);
  });
if (btn) {
  btn.textContent = isExpanded ? "Ver menos" : "Ver mas"
}
}
function btnGenresToggle(list, container, btn, type){
if (btn) {
    btn.addEventListener("click", ()=> {
      isExpanded = !isExpanded;
      renderItems(list,container,btn,type);
    });
  }
}
async function getPlatforms() {
   const {data} = await api ("platforms");
   allPlatforms = data.results;

   const filtered = data.results.filter(platform =>
    allowedIds.includes(platform.id)
  );

  allPlatforms = filtered;

   renderItems (allPlatforms,platformsList, btnShowPlatforms,"platform");
   btnGenresToggle(allPlatforms,platformsList, btnShowPlatforms,"platform")
}

async function getGameById(id){
 const {data : game} = await api ("games/" + id);

gameDetailImg.src = game.background_image;
 gameDetailDescription.innerHTML = game.description;
 gameDetailScore.textContent = game.rating;
 gameDetailTitle.textContent = game.name;
}

async function gamesByGenres(genreSlug){
  const { data } = await api("games", {
    params: {
      page_size: 40,
      genres: genreSlug   
    }
  });
  const gamesGenres = data.results || []; 

  maxPage = Math.ceil(data.count / 40);
  
  createGames(gamesGenres,genreContainer);
}
function getPaginatedGenres(genreSlug) {

  return async function () {

    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom =
      (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {

      page++;

      const { data } = await api("games", {
        params: {
          page_size: 40,
          genres: genreSlug,
          page,
        }
      });
      const games = data.results;

      createGames(games, genreContainer);
    }
  }
}
async function getGameBySearch(query){
  const {data} = await api ("games",{
        params: {
           search: query,
          }
      });
      const searchGame=data.results;

      maxPage = Math.ceil(data.count / 40);

      gameSection.innerHTML = "";
      createGames(searchGame,gameSection)
}
function getPaginatedSearch(query) {

  return async function () {

    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom =
      (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {

      page++;

      const {data} = await api("games", {
        params: {
          search: query,
          page_size: 40,
          page,
        }
      });
      const games = data.results;

      createGames(games, gameSection);
    }
  }
}

async function getGamesByPlatforms(platformId){
  const {data} = await api ("games",{
        params: {
          page_size: 40,
           platforms:platformId,
          }
      });
    const gamePlatforms = data.results;

    maxPage = Math.ceil(data.count / 40);

    gameSection.innerHTML = "";
    createGames (gamePlatforms,genreContainer);
}

function getPaginatedPlatforms(platformId) {
  return async function () {

    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    const scrollIsBottom =
      (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {

      page++;

      const {data} = await api("games", {
        params: {
          platforms: platformId,
          page_size: 40,
          page,
        }
      });
      const games=data.results;

      createGames(games, genreContainer);
    }
  }
}




