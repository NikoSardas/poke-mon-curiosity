let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //return pokemonList
  function getPokemonList() {
    return pokemonList;
  }

  //validate and push into pokemonList array
  function addPokemonToList(pokemon) {
    const pokemonKeys = Object.keys(pokemon);
    if (typeof pokemon === 'object') {
      const parameterIsPokemon = (
          pokemonKeys[0] === "name" &&
          pokemonKeys[1] === "detailsUrl"
      );
      parameterIsPokemon && pokemonList.push(pokemon);//push to array if passed validations
    } else {
      return false;
    }
  }

  // return pokemon details from name parameter
  function findPokemonInList(name) {
    function checkName(pokemon) {
      if (pokemon.name === name) {
        return pokemon;
      }
    }

    //return array of validated pokemonList elements into filterResult
    let filterResult = pokemonList.filter(checkName);
    if (filterResult.length === 0) {
      filterResult = 'That Pokemon is not on the list!'
    }
    return filterResult;
  }

  //
  function loadPokemonDetails(pokemon) {
    return fetch(pokemon.detailsUrl).then(function (response) {
      return response.json().then(function (json) {
        let thisPokemon = findPokemonInList(pokemon.name);
        thisPokemon.imgUrl = json.imgUrl;
        thisPokemon.height = json.height;
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  //
  function showPokemonDetails(pokemon) {
    loadPokemonDetails(pokemon).then(function () {
      console.log(pokemon);
    });
  }

  //Since it's only used by addListItem,
  // isn't it better to move the function inside addListItem?
  function setButtonListener(btn, pokemon) {
    function sendToShowDetails() {
      showPokemonDetails(pokemon);//
    }

    btn.addEventListener('click', sendToShowDetails);
  }

  //creates a list item with a button for the current pokemon parameter
  //and sets a button listener
  function addHTMLListItem(pokemon) {
    const pokemonListElement = document.querySelector("#pokemon-list");
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('name-button');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
    setButtonListener(button, pokemon);
  }

  //fetch items from api and send each to addPokemonToList
  function loadApiIntoList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        showPokemonDetails(pokemon);
        addPokemonToList(pokemon);
      });
      return true;
    }).catch(function (e) {
      console.error(e);
    })
  }

  return {
    addPokemonToList: addPokemonToList,
    getPokemonList: getPokemonList,
    addHTMLListItem: addHTMLListItem,
    loadApiIntoList: loadApiIntoList
  };
})()

pokemonRepository.loadApiIntoList().then(function (response) {
  response && pokemonRepository.getPokemonList().forEach(pokemonRepository.addHTMLListItem);
});