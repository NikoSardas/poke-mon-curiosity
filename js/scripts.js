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
      const parameterIsPokemon = (
          pokemonKeys[0] === "name" &&
          pokemonKeys[1] === "height" &&
          pokemonKeys[2] === "types"
      );
      parameterIsPokemon && pokemonList.push(pokemon);
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

    let filterResult = pokemonList.filter(checkName);
    if (filterResult.length === 0) {
      filterResult = 'That Pokemon is not on the list!'
    }
    return filterResult;
  }

  return {
    getAllPokemons: getAllPokemons,
    addPokemon: addPokemon,
    findPokemon: findPokemon
  }
})()

function printPokemonDetails(pokemon) {
  const height = pokemon.height;
  let displayText = pokemon.name + ' (height: ' + height + ')';
  height > 1 && (displayText = displayText + (' ' + "Wow that's big!"));
  document.write(displayText, '<br>');
}

pokemonRepository.getAll().forEach(printPokemonDetails);
