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
let i = 0;

//display pokemonList names and heights
for (; i < pokemonList.length;) {
  const height = pokemonList[i].height;
  let displayText = pokemonList[i].name + ' (height: ' + height + ')';
  //check for adding big text:
  height > 1 && (displayText = displayText + (' ' + "Wow that's big!"));
  document.write(displayText, '<br>');
  i++;
}