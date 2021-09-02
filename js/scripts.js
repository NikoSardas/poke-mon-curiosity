let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: 'Genesect',
      height: '1.5',
      types: [
        'bug',
        'steel'
      ]
    },
    {
      name: 'Stunfisk',
      height: '0.7',
      types: [
        'electric',
        'ground'
      ]
    },
    {
      name: 'Chimchar',
      height: '0.5',
      types: [
        'fire'
      ]
    },
  ];

  function getAllPokemons() {
    return pokemonList;
  }

  function addPokemon(pokemon) {
    const pokemonKeys = Object.keys(pokemon);
    if (typeof pokemon === 'object') {
      const parameterIsPokemon = (pokemonKeys[0] === "name" && pokemonKeys[1] === "height" && pokemonKeys[2] === "types");
      parameterIsPokemon && pokemonList.push(pokemon);//push to array if passed validations
    } else {
      return false;
    }
  }

  function findPokemon(name) {
    function checkName(pokemon) {
      if (pokemon.name === name) {
        return pokemon;
      }
    }

    let filterResult = pokemonList.filter(checkName);//return array of pokemonList validated elements to filterResult
    if (filterResult.length === 0) {
      filterResult = 'That Pokemon is not on the list!'
    }
    return filterResult;
  }

  function showDetails(pokemon) {
    console.log(pokemon);
  }

  function setButtonListener(btn, pokemon) {
    function sendToShowDetails() {
      showDetails(pokemon);//
    }

    btn.addEventListener('click', sendToShowDetails)
  }

  function addListItem(pokemon) { //populate a button list with objects from pokemonList
    const pokemonListElement = document.querySelector("#pokemon-list");
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('name-button');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
    setButtonListener(button, pokemon);  //send list button to a dedicated addListener function
  }

  return {
    getAllPokemons: getAllPokemons,
    addPokemon: addPokemon,
    findPokemon: findPokemon,
    addListItem: addListItem,
    showDetails: showDetails
  }
})()
pokemonRepository.getAllPokemons().forEach(pokemonRepository.addListItem);

