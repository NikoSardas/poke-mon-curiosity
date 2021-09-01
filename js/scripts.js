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
const bigPokemonText = "Wow that's big!";
const PokemonListLength = pokemonList.length;
let i = 0;

//display pokemonList names and heights
for (;i < PokemonListLength;) {
  const name = pokemonList[i].name,
      height = pokemonList[i].height;
  let displayText = `${name} (height:` + height + ')';
  height > 1 && (displayText = displayText + (' ' + bigPokemonText));
  document.write(displayText, '<br>');
  i++;
}