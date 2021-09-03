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
          imgUrl: item.imgUrl,
          abilities: item.abilities
        };
        showDetails(pokemon);
        add(pokemon);
      });
      hideLoadingMessage();
      return true;
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

//send pokemon to add more parameters then log returned pokemon with added parameters
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function (updatedPokemon) {
      hideLoadingMessage();
      console.log(updatedPokemon);
    });
  }

//get parameter pokemon from api and add parameters to the same pokemon on the list
  function loadDetails(pokemon) {
    showLoadingMessage();
    console.log(pokemon);
    return fetch(pokemon.detailsUrl).then(function (response) {
      return response.json().then(function (json) {
        let thisPokemon = find(pokemon.name);
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

  //creates a list item with a button for the current pokemon parameter
  //and sets a button listener
  function addListItem(pokemon) {
    const pokemonListElement = document.querySelector("#pokemon-list");
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('name-button');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
    setButtonListener(button, pokemon);
  }

  //add click listener to a pokemon button
  function setButtonListener(btn, pokemon) {
    function sendToShowDetails() {
      showDetails(pokemon);//
    }

    btn.addEventListener('click', sendToShowDetails);
  }

  // display a loading message while data is being loaded
  function showLoadingMessage() {
    document.querySelector("#loadingMessage").classList.remove('hidden');
  }

  // hide a loading message when data finishes loading
  function hideLoadingMessage() {
    document.querySelector("#loadingMessage").classList.add('hidden');
  }

  // display the modal
  function showModal(title, text) {
    //clear modalContainer
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.innerHTML = '';
    //add modal content
    let modal = document.createElement('div');
    modal.id = 'modal';
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);
    let titleElement = document.createElement('h1');
    titleElement.innerText = title;
    modalContainer.classList.remove('hidden');
    let contentElement = document.createElement('p');
    contentElement.innerText = text;
    //append to DOM
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modalContainer.appendChild(modal);
    //show modal container
    modalContainer.classList.remove('hidden');
  }

  let dialogPromiseReject;

  //hide the modal
  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.add('hidden');
    if (dialogPromiseReject) {
      dialogPromiseReject();
      dialogPromiseReject = null;
    }
  }

  //show modal dialog buttons
  function showDialog(title, text) {
    showModal(title, text);
    let modalContainer = document.querySelector('#modal-container');
    let modal = modalContainer.querySelector('#modal');
    //add dialog content
    let confirmButton = document.createElement('button');
    confirmButton.classList.add('modal-confirm');
    confirmButton.innerText = 'Confirm';
    let cancelButton = document.createElement('button');
    cancelButton.classList.add('modal-cancel');
    cancelButton.innerText = 'Cancel';
    //append to DOM
    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);
    //focus on confirm button
    confirmButton.focus();
    // return promise after button click
    return new Promise((resolve, reject) => {
      cancelButton.addEventListener('click', hideModal);
      confirmButton.addEventListener('click', () => {
        dialogPromiseReject = null;
        hideModal();
        resolve();
      })
      dialogPromiseReject = reject;
    })
  }

  document.querySelector('#show-modal').addEventListener('click', () => {
    showModal('Modal title', 'This is the modal content!');
  });
  document.querySelector('#modal-container').addEventListener('click', (e) => {
    if (e.target.id === 'modal-container') {
      hideModal();
    }
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' &&
        !document.querySelector('#modal-container').classList.contains('hidden')) {
      hideModal();
    }
  });
  document.querySelector('#show-dialog').addEventListener('click', () => {
    showDialog('Confirm action', 'Are you sure you want to do this?').then(function () {
      alert(true);
    }, () => {
      alert(false);
    });
  })

  return {
    add: add,
    getList: getList,
    addListItem: addListItem,
    loadList: loadList
  };
})
()

pokemonRepository.loadList().then(function (response) {
  response && pokemonRepository.getList().forEach(pokemonRepository.addListItem);
});