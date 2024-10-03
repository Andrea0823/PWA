const apiURL = 'https://pokeapi.co/api/v2/pokemon/bulbasaur'; // Puedes cambiar "pikachu" por cualquier otro nombre o ID de Pokémon

// Función para obtener datos de la API
async function fetchDataFromAPI() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Guarda los datos en LocalStorage
    localStorage.setItem('pokemon', JSON.stringify(data));

    // Muestra los datos en la UI
    displayPokemon(data);
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);

    // Si hay un error, intenta cargar datos desde el cache (LocalStorage)
    const cachedData = localStorage.getItem('pokemon');
    if (cachedData) {
      console.log('Cargando datos desde LocalStorage...');
      displayPokemon(JSON.parse(cachedData));
    }
  }
}

// Función para mostrar el Pokémon en la página
function displayPokemon(pokemon) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = ''; // Limpiar contenido previo

  const pokemonElement = document.createElement('div');
  pokemonElement.innerHTML = `
    <h3>${pokemon.name.toUpperCase()}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p>Altura: ${pokemon.height}</p>
    <p>Peso: ${pokemon.weight}</p>
    <p>Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
  `;
  contentDiv.appendChild(pokemonElement);
}

// Llamar a la función para obtener y mostrar los datos
fetchDataFromAPI();
