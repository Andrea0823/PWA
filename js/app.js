// Obtener elementos del DOM
const loadPokemonButton = document.getElementById('load-pokemon-button');
const pokemonList = document.getElementById('pokemon-list');

// Función para cargar Pokémon desde la PokéAPI
async function loadPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    const data = await response.json();
    
    // Limpiar la lista antes de agregar nuevos Pokémon
    pokemonList.innerHTML = '';

    // Agregar cada Pokémon a la lista
    data.results.forEach(pokemon => {
        addPokemonToDOM(pokemon);
    });
}

// Agregar Pokémon al DOM
function addPokemonToDOM(pokemon) {
    const li = document.createElement('li');
    li.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    pokemonList.appendChild(li);
}

// Manejar el evento de cargar Pokémon
loadPokemonButton.addEventListener('click', loadPokemon);
