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
const bigAlert = "Wow that's big!";
for (let i = 0; i < pokemonList.length; i++) {
  const name = pokemonList[i].name;
  const height = pokemonList[i].height;
  document.write(`${name} (height:` + height + ')');
  height > 1 && document.write(' ' + bigAlert);
  document.write('<br>')
}