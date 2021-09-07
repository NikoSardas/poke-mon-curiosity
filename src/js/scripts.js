const pokemonRepository = (function () {
  const pokemonList = []
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'

  // return pokemonList
  function getList() {
    return pokemonList
  }

  // fetch items from api and send each to validation function
  function loadList() {
    loadMessage(true)
    return fetch(apiUrl)
      .then(function (response) {
        // convert response object to json
        return response.json()
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          const pokemon = {
            name: item.name,
            detailsUrl: item.url
          }
          // send to add() for validations and to push into the array
          add(pokemon)
        })
        loadMessage(false)
        return true
      })
      .catch(function (e) {
        loadMessage(false)
        console.error(e)
      })
  }

  // validate parameter and push it into pokemonList array
  function add(pokemon) {
    const pokemonKeys = Object.keys(pokemon)
    if (typeof pokemon === 'object') {
      const parameterIsPokemon =
        pokemonKeys[0] === 'name' && pokemonKeys[1] === 'detailsUrl'
      // push to array if passed validations
      parameterIsPokemon && pokemonList.push(pokemon)
    } else {
      return false
    }
  }

  // send pokemon parameter to modal
  function showDetails(pokemon) {
    // add further parameter details before sending updated pokemon to modal
    loadDetails(pokemon).then(function (updatedPokemon) {
      modal.show(updatedPokemon)
    })
  }

  // add pokemon parameters from api
  function loadDetails(pokemon) {
    // fetch specific pokemon by url
    return fetch(pokemon.detailsUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        const thisPokemon = find(pokemon.name)
        // add parameters to pokemon
        thisPokemon[0].imgUrl = json.sprites.front_default
        thisPokemon[0].height = json.height
        thisPokemon[0].weight = json.weight
        thisPokemon[0].abilities = json.abilities
        return thisPokemon
      })
      .catch(function (e) {
        console.error(e)
      })
  }

  // return pokemon details from name parameter
  function find(name) {
    function checkName(pokemon) {
      if (pokemon.name === name) {
        return pokemon
      }
    }

    // return array of validated pokemonList elements into filterResult
    let filterResult = pokemonList.filter(checkName)
    if (filterResult.length === 0) {
      filterResult = 'That Pokemon is not on the list!'
    }
    return filterResult
  }

  // create a display button from the pokemon parameter
  function addListItem(pokemon) {
    const listItem = document.createElement('div')
    const button = document.createElement('button')
    // create list to nest button
    listItem.classList.add('group-list-item')
    listItem.classList.add('col-lg-3')
    listItem.classList.add('col-sm-12')
    listItem.classList.add('col-md-4')
    // create button
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.classList.add('name-button')
    button.innerText = pokemon.name
    button.dataset.target = '#pokemon-modal'
    button.dataset.toggle = 'modal'
    // append to DOM
    listItem.appendChild(button)
    document.querySelector('#pokemon-list').appendChild(listItem)
    // set button listener
    button.addEventListener('click', function sendToShowDetails() {
      loadMessage(true)
      showDetails(pokemon)
    })
  }

  // toggle load message display
  function loadMessage(state) {
    const loadMessage = $('#loadingMessage')
    state ? loadMessage.removeClass('d-none') : loadMessage.addClass('d-none')
  }

  return {
    add: add,
    getList: getList,
    addListItem: addListItem,
    loadList: loadList,
    loadMessage: loadMessage
  }
})()

const modal = (function () {
  $('.modal').on('hidden.bs.modal', function () {
    $('#height').text('')
    $('#weight').text('')
    $('.modal-title').text('')
    $('#abilities').text('')
    $('#pokemon-image').remove()
  })

  // show modal with parameter details
  function showModal(pokemonObj) {
    // create image container
    const imageElement = document.createElement('img')
    imageElement.id = 'pokemon-image'
    imageElement.setAttribute('alt', pokemonObj[0].name + ' image')
    imageElement.setAttribute('draggable', 'false')
    $('#pokemon-image-container').append(imageElement)
    // load other details after image done loading
    imageElement.onload = function () {
      $('.modal-title').text(pokemonObj[0].name)
      $('#height').text(`Height: ${pokemonObj[0].height}`)
      $('#weight').text(`Weight: ${pokemonObj[0].weight}`)
      pokemonObj[0].abilities.forEach(function (item) {
        $('#abilities').append('<li>' + item.ability.name + ' ' + '</li>')
      })
    }
    imageElement.src = pokemonObj[0].imgUrl
    pokemonRepository.loadMessage(false)
  }

  return {
    show: showModal
  }
})()

// load api into array then send each pokemon to the display list
pokemonRepository.loadList().then(function (response) {
  response &&
    pokemonRepository.getList().forEach(pokemonRepository.addListItem)
})