let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //return pokemonList
  function getList() {
    return pokemonList;
  }

  //fetch items from api and send each to add
  function loadList() {
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
          imgUrl: item.imgUrl
        };
        //send to validation and add to array
        add(pokemon);
      });
      hideLoadingMessage();
      return true;
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  //send pokemon to loadDetails to add more parameters then send updated pokemon to modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function (updatedPokemon) {
      hideLoadingMessage();
      modal.show(updatedPokemon)
    });
  }

  //get parameter pokemon from api and add parameters to the same pokemon on the list
  function loadDetails(pokemon) {
    showLoadingMessage();
    return fetch(pokemon.detailsUrl).then(function (response) {
      return response.json().then(function (json) {
        let thisPokemon = find(pokemon.name);
        thisPokemon[0].imgUrl = json.sprites.front_default;
        thisPokemon[0].height = json.height;
        thisPokemon[0].weight = json.weight;
        thisPokemon[0].abilities = json.abilities;
        // hideLoadingMessage();
        return thisPokemon;
      });
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  //validate parameter and push it into pokemonList array
  function add(pokemon) {
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
  function find(name) {
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

  //creates a a button for the current pokemon name with a click listener and modal interaction
  function addListItem(pokemon) {
    const pokemonListElement = document.querySelector("#pokemon-list");
    let listItem = document.createElement('div');
    let button = document.createElement('button');
    listItem.classList.add('group-list-item');
    listItem.classList.add('col-lg-3');
    listItem.classList.add('col-sm-12');
    listItem.classList.add('col-md-4');
    button.classList.add('btn');
    button.dataset.target = '#pokemon-modal';
    button.dataset.toggle = 'modal';
    button.innerText = pokemon.name;
    button.classList.add('name-button');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
    setButtonListener(button, pokemon);
  }

  //click listener for a pokemon button
  function setButtonListener(btn, pokemon) {
    function sendToShowDetails() {
      showDetails(pokemon);
    }

    btn.addEventListener('click', sendToShowDetails);
  }

  // display a loading message while data is being loaded
  function showLoadingMessage() {
    document.querySelector("#loadingMessage").classList.remove('d-none');
  }

  // hide a loading message when data finishes loading
  function hideLoadingMessage() {
    document.querySelector("#loadingMessage").classList.add('d-none');
  }

  return {
    add: add,
    getList: getList,
    addListItem: addListItem,
    loadList: loadList
  };
})()

let modal = (function () {
  $('.modal').on('hidden.bs.modal', function () {
    $('#height').text('');
    $('#weight').text('');
    $('.modal-title').text('');
    $('#abilities').text('');
    $('#pokemon-image').remove();
  });

  //show modal with parameter details
  function showModal(pokemonObj) {
    console.log(pokemonObj[0]);
    const name = pokemonObj[0].name;
    const imageUrl = pokemonObj[0].imgUrl;
    const abilities = pokemonObj[0].abilities;
    const height = pokemonObj[0].height;
    const weight = pokemonObj[0].weight;
    const imageElement = document.createElement('img');
    imageElement.id = 'pokemon-image';
    imageElement.setAttribute('draggable', 'false');
    //load image before other details
    imageElement.onload = function () {
      $('.modal-title').text(name);
      $('#height').text('Height: ' + height);
      $('#weight').text('Weight: ' + weight);
      // $('#abilities').text("Abilities: ");
      abilities.forEach(function (item) {
        const name = item.ability.name
        $('#abilities').append(name + '<br>');
      })
    }
    imageElement.src = imageUrl;
    imageElement.setAttribute('alt', name + ' image');
    $('#pokemon-image-container').append(imageElement);
    // (https://stackoverflow.com/questions/2342132/waiting-for-image-to-load-in-javascript)
  }

  return {
    show: showModal
  }
})()

//load api into array. them use the array to display each pokemon button
pokemonRepository.loadList().then(function (response) {
  response && pokemonRepository.getList().forEach(pokemonRepository.addListItem);
});