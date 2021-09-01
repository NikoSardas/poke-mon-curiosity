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

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    function checkPokemonKeys() {
      const pokemonKeys = Object.keys(pokemon);
      // return keyTest boolean
      return (pokemonKeys[0] === "name" && pokemonKeys[1] === "height" && pokemonKeys[2] === "type");
    }

    // return pokemon if tests are validated
    typeof pokemon === 'object' && checkPokemonKeys() && pokemonList.push(pokemon);
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
    getAll: getAll,
    add: add,
    find: findPokemon
  }
})()

function printPokemonDetails(pokemon) {
  const height = pokemon.height;
  let displayText = pokemon.name + ' (height: ' + height + ')';
  height > 1 && (displayText = displayText + (' ' + "Wow that's big!"));
  document.write(displayText, '<br>');
}

pokemonRepository.getAll().forEach(printPokemonDetails);


console.log(pokemonRepository.find('Stunfisk'));
console.log(pokemonRepository.find('Stunkfisk'));