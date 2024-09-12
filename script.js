const pokemonList = document.querySelector("#pokemonList");
const headerButtons = document.querySelectorAll(".boton-header");
const logo = document.querySelector("#pokedex-logo");
const pokemonDetailsContainer = document.querySelector("#pokemon-details-container");
const overlay = document.querySelector("#overlay");
let api = "https://pokeapi.co/api/v2/pokemon/";

function showPokemonDetails(pokemonId, pokemonData) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    .then(response => response.json())
    .then(speciesData => {
      const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es');
      const description = descriptionEntry ? descriptionEntry.flavor_text : 'No hay descripción disponible.';

      const detailsHTML = `
        <img src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}" style="width: 150px;">
        <h2 id="pokemon-name">${pokemonData.name}</h2>
        <p id="pokemon-type">Tipo: ${pokemonData.types.map((type) => type.type.name).join(', ')}</p>
        <p id="pokemon-stats">Altura: ${pokemonData.height}m, Peso: ${pokemonData.weight}kg</p>
        <p id="pokemon-description">${description}</p>
      `;

      pokemonDetailsContainer.innerHTML = detailsHTML;
      pokemonDetailsContainer.classList.add('show');

      overlay.classList.add('show');
    });
}

function showPokemon(data) {
  let tipos = data.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
  tipos = tipos.join('');
  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
    <div class="pokemon">
      <div class="pokemon-image">
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
      </div>
      <div class="info-pokemon">
        <div class="name-container">
          <h2 class="name-pokemon">${data.name}</h2>
        </div>
        <div class="type-pokemon">
          ${tipos}
        </div>
        <div class="stats-pokemon">
          <p class="height">${data.height}m</p>
          <p class="weight">${data.weight}kg</p>
        </div>
      </div>
    </div>`;

  div.addEventListener("click", (event) => {
    event.stopPropagation(); 
    showPokemonDetails(data.id, data);
  });

  pokemonList.append(div);
}

for (let i = 1; i <= 1025; i++) {
  fetch(api + i)
    .then((response) => response.json())
    .then(data => showPokemon(data));
}

headerButtons.forEach(boton => boton.addEventListener("click", (event) => {
  const botonId = event.currentTarget.id.toLowerCase();
  pokemonList.innerHTML = "";
  for (let i = 1; i <= 1025; i++) {
    fetch(api + i)
      .then((response) => response.json())
      .then(data => {
        const tipos = data.types.map(type => type.type.name.toLowerCase());
        if (tipos.some(tipo => tipo.includes(botonId))) {
          showPokemon(data);
        }
      });
  }
}));

logo.addEventListener("click", () => {
  pokemonList.innerHTML = "";
  for (let i = 1; i <= 1025; i++) {
    fetch(api + i)
      .then((response) => response.json())
      .then(data => showPokemon(data));
  }
});


document.addEventListener('click', (event) => {
  const isClickInside = pokemonDetailsContainer.contains(event.target);

  if (!isClickInside) {
    pokemonDetailsContainer.classList.remove('show');
    overlay.classList.remove('show');
  }
});
