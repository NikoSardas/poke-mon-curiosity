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

  //get parameter pokemon from api and add parameters to the same pokemon on the list
  function loadPokemonDetails(pokemon) {
    showLoadingMessage();
    console.log(pokemon);
    return fetch(pokemon.detailsUrl).then(function (response) {
      return response.json().then(function (json) {
        let thisPokemon = findPokemonInList(pokemon.name);
        thisPokemon[0].imgUrl = json.sprites.front_default;
        thisPokemon[0].height = json.height;
        thisPokemon[0].weight = json.weight;
        thisPokemon[1] = json.abilities;
        console.log(thisPokemon);
        hideLoadingMessage();
        return thisPokemon;
      });
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  //send pokemon to add more parameters then log returned pokemon with added parameters
  function showPokemonDetails(pokemon) {
    loadPokemonDetails(pokemon).then(function (updatedPokemon) {
      hideLoadingMessage();
      console.log(updatedPokemon);
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
    showLoadingMessage();
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
          height: item.height,
          weight: item.weight,
          imgUrl: item.imgUrl,
          abilities: item.abilities
        };
        showPokemonDetails(pokemon);
        addPokemonToList(pokemon);
      });
      hideLoadingMessage();
      return true;
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  function showLoadingMessage() {
    document.querySelector("#loadingMessage").classList.remove('hidden');
  }

  function hideLoadingMessage() {
    document.querySelector("#loadingMessage").classList.add('hidden');
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