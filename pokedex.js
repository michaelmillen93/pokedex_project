"use strict";

//ELEMENT SELECTORS

const btnSearch = document.getElementById("search");
const spriteContainer = document.getElementById("sprite-container");
const option = document.getElementById("option");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const entries = document.getElementById("entries-list");
const scrollbar = document.getElementById("scrollbar");
const optionModal = document.querySelector(".modal");
const closeOptionModal = document.querySelector(".cancel");
const optionSearch = document.querySelector(".begin-search");
const type1 = document.getElementById("type-1");
const type2 = document.getElementById("type-2");

//FUNCTIONS

const state = {
  pokedex: [],
};

/**
 *
 * @param {sets how many pokmeon are fetched from the API ( should always be 12)} limit
 * @param {Determines what index number is recieved (ex. offset of 150 returns Chikorita as the first index, will use when user wants to move back and forth in the pokedex), app opens with an offset of 0, getNextOffset increases offfset by 12 and getPrevoffset decreases by 12} offset
 */

let offset = 0;

const getPokemon = async function (offset, limit = 12) {
  try {
    //Guard clauses
    if (offset < 0 || offset > 251) return null;

    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
    );

    const data = await res.json();

    console.log(data);

    data.results.forEach((pokemon) => {
      addToDOM(pokemon.name.toUpperCase());
    });
  } catch (err) {
    console.error(err);
  }
};

//Function to display results to Pokedex container
const addToDOM = function (pokemon) {
  if (pokemon === "TREECKO") return;

  const entry = document.createElement("li");
  entry.classList.add("entry");

  entry.innerHTML = `
  <li>${pokemon}</li>
  `;

  //Append list items to entries list
  entries.appendChild(entry);
};

//Function that adds the sprite of the first pokemon from the API to the DOM
const addSpriteToDOM = async function (pokemon) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await res.json();

    console.log(data);

    const sprite = document.createElement("div");

    sprite.innerHTML = `
    <img class="sprite" src="${data.sprites.versions["generation-ii"].crystal.front_default}" />
    `;

    spriteContainer.innerHTML = "";
    spriteContainer.appendChild(sprite);
  } catch (err) {
    console.error(err);
  }
};

const getNextOffset = async function () {
  try {
    //Max offset before the size limit of the gen 2 Pokedex
    if (offset > 228) return;

    offset += 12;
    entries.innerHTML = "";

    //returns a new response from the API with the next 12 pokemon in the Pokedex
    const newRes = await getPokemon(offset);

    //Returns a promise that must be awaited
    const newData = await newRes;

    return newData;
  } catch (err) {
    console.error(err);
  }
};

const getPrevOffset = async function () {
  try {
    //Prevents user from going to a negative index in the Pokedex
    if (offset === 0) return;

    offset -= 12;
    entries.innerHTML = "";

    const newRes = await getPokemon(offset);
    const newData = await newRes;

    return newData;
  } catch (err) {
    console.error(err);
  }
};

//Function to open/close modal window for select by type option
const toggleOptionModal = function (e) {
  e.preventDefault();

  optionModal.classList.toggle("hidden");
};

//Function to search the pokedex and return the types specified in the options

//should have type1 and type2 params

const searchByType = async function () {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=251&offset=0`
  );

  const data = await res.json();
  const namesArray = [];

  data.results.forEach((pokemon) => {
    namesArray.push(pokemon.name);
  });

  // namesArray.forEach((pokemon) => {});

  console.log(data);
  console.log(namesArray);
};

//Initialize Pokedex
getPokemon(offset);
addSpriteToDOM("bulbasaur");

//EVENT LISTENERS
btnNext.addEventListener("click", getNextOffset);
btnPrev.addEventListener("click", getPrevOffset);
entries.addEventListener("click", function (e) {
  e.preventDefault();

  const clicked = e.target.closest(".entry");
  const selected = clicked.textContent.toLowerCase().trim();

  if (!clicked) return;

  console.log(selected);

  //Add sprite to DOM
  addSpriteToDOM(selected);
});

option.addEventListener("click", toggleOptionModal);
closeOptionModal.addEventListener("click", toggleOptionModal);
optionSearch.addEventListener("click", searchByType);

//Pulling the API data once app initializes so that data is already stored

const getJSON = async function () {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=251&offset=0`
    );

    const data = await res.json();
    const namesArray = [];

    data.results.forEach((pokemon) => {
      namesArray.push(pokemon.name);
    });

    namesArray.forEach((name) => {
      getPokemonObject(name);
    });
  } catch (err) {
    console.error(err);
  }
};

//Creates Pokemon Object for all 251 Pokemon
const getPokemonObject = async function (pokemon) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await res.json();

    state.pokedex = {
      name: data.name,
      id: data.id,
      height: data.height,
      weight: data.weight,
      sprite: data.sprite?.versions["generation-ii"].crystal.front_default,
      type1: data?.types[0].name,
      //If there is a second type, add that type to the data object
      ...(data.types[1] && { type2: data.types[1].name }),
    };
  } catch (err) {
    console.error(err);
  }
};

getJSON();
