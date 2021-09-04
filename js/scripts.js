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
    console.log(pokemon);
    return fetch(pokemon.detailsUrl).then(function (response) {
      return response.json().then(function (json) {
        let thisPokemon = find(pokemon.name);
        thisPokemon[0].imgUrl = json.sprites.front_default;
        thisPokemon[0].height = json.height;
        thisPokemon[0].weight = json.weight;
        console.log(thisPokemon);
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

  //creates a a button with the current pokemon name and sets a listener
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

  return {
    add: add,
    getList: getList,
    addListItem: addListItem,
    loadList: loadList
  };
})()

let modal = (function () {
  function showModal(pokemonObj) {
    let modalContainer = document.querySelector('#modal-container');
    //empty container from previous modal
    modalContainer.innerHTML = '';
    // create modal and div elements
    let modal = document.createElement('div');
    modal.id = 'modal';
    let modalDivContainer = document.createElement('div');
    modalDivContainer.id = 'modal-divs-container';
    let modalTextDiv = document.createElement('div');
    modalTextDiv.id = 'modal-text-div';
    let modalImageDiv = document.createElement('div');
    modalImageDiv.id = 'modal-image-div';
    //close button
    let closeButtonElement = document.createElement('button');
    closeButtonElement.id = 'modal-close';
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);
    //create title
    let titleElement = document.createElement('h1');
    titleElement.innerText = pokemonObj[0].name;
    modalContainer.classList.remove('hidden');
    //height text
    let heightElement = document.createElement('p');
    heightElement.innerText = 'Height: ' + pokemonObj[0].height;
    heightElement.innerText = 'Height: ' + pokemonObj[0].height;
    //weight text
    let weightElement = document.createElement('p');
    weightElement.innerText = 'Weight: ' + pokemonObj[0].weight;
    //pokemon image
    let imageElement = document.createElement('img');
    imageElement.id = 'pokemon-image';
    imageElement.setAttribute('draggable', 'false');
//set container to show only after image is loaded
    // (https://stackoverflow.com/questions/2342132/waiting-for-image-to-load-in-javascript)
    imageElement.onload = function () {
      modal.appendChild(titleElement);
      modal.appendChild(modalDivContainer);
      modalDivContainer.appendChild(modalTextDiv);
      modalDivContainer.appendChild(modalImageDiv);
      modalTextDiv.appendChild(heightElement);
      modalTextDiv.appendChild(weightElement);
      modalImageDiv.appendChild(imageElement);
      modal.appendChild(closeButtonElement);
      modalContainer.appendChild(modal);
      modalContainer.classList.remove('hidden');
    }
    imageElement.src = pokemonObj[0].imgUrl;
  }

  // let dialogPromiseReject;

  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.add('hidden');
    // if (dialogPromiseReject) {
    //   dialogPromiseReject();
    //   dialogPromiseReject = null;
    // }
  }

  // function showDialog(title, text) {
  //   showModal(title, text);
  //   let modalContainer = document.querySelector('#modal-container');
  //   let modal = modalContainer.querySelector('#modal');
  //   let confirmButton = document.createElement('button');
  //   confirmButton.classList.add('modal-confirm');
  //   confirmButton.innerText = 'Confirm';
  //   let cancelButton = document.createElement('button');
  //   cancelButton.classList.add('modal-cancel');
  //   cancelButton.innerText = 'Cancel';
  //   modal.appendChild(confirmButton);
  //   modal.appendChild(cancelButton);
  //   confirmButton.focus();
  //   return new Promise((resolve, reject) => {
  //     cancelButton.addEventListener('click', hideModal);
  //     confirmButton.addEventListener('click', () => {
  //       dialogPromiseReject = null;
  //       hideModal();
  //       resolve();
  //     })
  //     dialogPromiseReject = reject;
  //   })
  // }

  document.querySelector('#modal-container').addEventListener('click', (e) => {
    if (e.target.id === 'modal-container') {
      modal.hide();
    }
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' &&
        !document.querySelector('#modal-container').classList.contains('hidden')) {
      modal.hide();
    }
  });
  // document.querySelector('#show-dialog-button').addEventListener('click', () => {
  //   modal.showDialog('Confirm action', 'Are you sure you want to do this?').then(function () {
  //     alert(true);
  //   }, () => {
  //     alert(false);
  //   });
  // })

  return {
    show: showModal,
    // showDialog: showDialog,
    hide: hideModal
  }
})()

//load api into array. them use the array to display each pokemon button
pokemonRepository.loadList().then(function (response) {
  response && pokemonRepository.getList().forEach(pokemonRepository.addListItem);
});