//TODO try IIFE. style modal. next button.

const pokemonRepository = (function () {
  const pokemonList = [];
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // return pokemonList
  function getList() {
    return pokemonList;
  }

  async function loadList() {const pokemonRepository=function(){const e=[],t="https://pokeapi.co/api/v2/pokemon/?limit=150";function n(t){const n=Object.keys(t);if("object"!=typeof t)return!1;("name"===n[0]&&"detailsUrl"===n[1]&&e).push(t)}async function o(t){try{let n=await async function(t){try{i();const n=function(t){let n=e.filter(function(e){if(e.name===t)return e});0===n.length&&(n="That Pokemon is not on the list!");return n}(t.name);let o=await fetch(t.detailsUrl),c=await o.json();return n[0].imgUrl=c.sprites.front_default,n[0].height=c.height,n[0].weight=c.weight,n[0].abilities=c.abilities,n}catch(e){a(),console.error(e)}}(t);modal.show(n)}catch(e){console.error(e)}}function i(){document.querySelector("#loadingMessage").classList.remove("d-none")}function a(){document.querySelector("#loadingMessage").classList.add("d-none")}return{add:n,getList:function(){return e},addListItem:function(e){const t=document.createElement("div"),n=document.createElement("button");t.classList.add("group-list-item"),t.classList.add("col-lg-3"),t.classList.add("col-sm-12"),t.classList.add("col-md-4"),n.classList.add("btn"),n.classList.add("btn-primary"),n.classList.add("name-button"),n.innerText=e.name,n.dataset.target="#pokemon-modal",n.dataset.toggle="modal",t.appendChild(n),document.querySelector("#pokemon-list").appendChild(t),n.addEventListener("click",function(){i(),o(e)})},loadList:async function(){i();try{let e=await fetch(t),o=await e.json();return(await o.results).forEach(function(e){n({name:e.name.charAt(0).toUpperCase()+e.name.slice(1),detailsUrl:e.url})}),a(),!0}catch(e){a(),console.error(e)}},hideLoadMessage:a}}(),modal=function(){return $(".modal").on("hidden.bs.modal",function(){document.querySelector("#pokemon-image-container").innerHTML="",document.querySelector(".modal-content").classList.remove("loaded"),document.querySelector("#height").innerText="",document.querySelector("#weight").innerText="",document.querySelector(".modal-title").innerText="",document.querySelector("#abilities").innerText=""}),{show:function(e){const t=document.createElement("img");t.id="pokemon-image",t.setAttribute("alt",e[0].name+" image"),t.setAttribute("draggable","false"),document.querySelector("#pokemon-image-container").appendChild(t),t.onload=function(){document.querySelector(".modal-title").innerText=e[0].name,document.querySelector("#height").innerText=`Height: ${e[0].height}`,document.querySelector("#weight").innerText=`Weight: ${e[0].weight}`,e[0].abilities.forEach(function(e){let t=document.createElement("li");document.querySelector("#abilities").appendChild(t),t.innerText=e.ability.name}),document.querySelector(".modal-content").classList.add("loaded")},t.src=e[0].imgUrl,pokemonRepository.hideLoadMessage()}}}();pokemonRepository.loadList().then(function(e){(e&&pokemonRepository.getList()).forEach(pokemonRepository.addListItem)});
    showLoadMessage();
    try {
      let response = await fetch(apiUrl);
      let json = await response.json();
      let results = await json.results;
      results.forEach(function (item) {
        const pokemon = {
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          detailsUrl: item.url,
        };
        // send to add() for validations and to push into the array
        add(pokemon);
      });
      hideLoadMessage();
      return true;
    } catch (e) {
      hideLoadMessage();
      console.error(e);
    }
  }

  // validate parameter and push it into pokemonList array
  function add(pokemon) {
    const pokemonKeys = Object.keys(pokemon);
    if (typeof pokemon === "object") {
      const parameterIsPokemon =
        pokemonKeys[0] === "name" && pokemonKeys[1] === "detailsUrl";
      // push to array if passed validations
      (parameterIsPokemon && pokemonList).push(pokemon);
    } else {
      return false;
    }
  }

  // send pokemon parameter to modal
  async function showDetails(pokemon) {
    // add further parameter details before sending updated pokemon to modal
    try {
      let response = await loadDetails(pokemon);
      modal.show(response);
    } catch (e) {
      console.error(e);
    }
  }

  // add pokemon parameters from api
  async function loadDetails(pokemon) {
    try {
      showLoadMessage();
      const thisPokemon = find(pokemon.name);
      let response = await fetch(pokemon.detailsUrl);
      let json = await response.json();
      // add parameters to pokemon
      thisPokemon[0].imgUrl = json.sprites.front_default;
      thisPokemon[0].height = json.height;
      thisPokemon[0].weight = json.weight;
      thisPokemon[0].abilities = json.abilities;
      return thisPokemon;
    } catch (e) {
      hideLoadMessage();
      console.error(e);
    }
  }

  // return pokemon details from name parameter
  function find(name) {
    function checkName(pokemon) {
      if (pokemon.name === name) {
        return pokemon;
      }
    }

    // return array of validated pokemonList elements into filterResult
    let filterResult = pokemonList.filter(checkName);
    if (filterResult.length === 0) {
      filterResult = "That Pokemon is not on the list!";
    }
    return filterResult;
  }

  // create a display button from the pokemon parameter
  function addListItem(pokemon) {
    const listItem = document.createElement("div");
    const button = document.createElement("button");
    // create list to nest button
    listItem.classList.add("group-list-item");
    listItem.classList.add("col-lg-3");
    listItem.classList.add("col-sm-12");
    listItem.classList.add("col-md-4");
    // create button
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("name-button");
    button.innerText = pokemon.name;
    button.dataset.target = "#pokemon-modal";
    button.dataset.toggle = "modal";
    // append to DOM
    listItem.appendChild(button);
    document.querySelector("#pokemon-list").appendChild(listItem);
    // set button listener
    button.addEventListener("click", function sendToShowDetails() {
      showLoadMessage();
      showDetails(pokemon);
    });
  }

  function showLoadMessage() {
    document.querySelector("#loadingMessage").classList.remove("d-none");
  }

  function hideLoadMessage() {
    document.querySelector("#loadingMessage").classList.add("d-none");
  }

  // toggle load message display

  return {
    add: add,
    getList: getList,
    addListItem: addListItem,
    loadList: loadList,
    hideLoadMessage: hideLoadMessage,
  };
})();

const modal = (function () {
  $(".modal").on("hidden.bs.modal", function () {
    document.querySelector("#pokemon-image-container").innerHTML = "";
    document.querySelector(".modal-content").classList.remove("loaded");
    document.querySelector("#height").innerText = "";
    document.querySelector("#weight").innerText = "";
    document.querySelector(".modal-title").innerText = "";
    document.querySelector("#abilities").innerText = "";
  });

  // show modal with parameter details
  function showModal(pokemonObj) {
    // create image container
    const imageElement = document.createElement("img");
    imageElement.id = "pokemon-image";
    imageElement.setAttribute("alt", pokemonObj[0].name + " image");
    imageElement.setAttribute("draggable", "false");
    document
      .querySelector("#pokemon-image-container")
      .appendChild(imageElement);
    // load other details after image done loading
    imageElement.onload = function () {
      document.querySelector(".modal-title").innerText = pokemonObj[0].name;
      document.querySelector(
        "#height"
      ).innerText = `Height: ${pokemonObj[0].height}`;
      document.querySelector(
        "#weight"
      ).innerText = `Weight: ${pokemonObj[0].weight}`;
      pokemonObj[0].abilities.forEach(function (item) {
        let abilityListItem = document.createElement("li");
        document.querySelector("#abilities").appendChild(abilityListItem);
        abilityListItem.innerText = item.ability.name;
      });
      document.querySelector(".modal-content").classList.add("loaded");
    };
    imageElement.src = pokemonObj[0].imgUrl;
    pokemonRepository.hideLoadMessage();
  }

  return {
    show: showModal,
  };
})();

// load api into array then send each pokemon to the display list
pokemonRepository.loadList().then(function (response) {
  (response && pokemonRepository.getList()).forEach(
    pokemonRepository.addListItem
  );
});
