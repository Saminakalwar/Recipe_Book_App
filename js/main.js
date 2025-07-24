const recipesContainer = document.getElementById('recipesContainer');
const favouritesContainer = document.getElementById('favouritesContainer');
const searchInput = document.getElementById('searchInput');
const ingredientFilter = document.getElementById('ingredientFilter');
const cuisineFilter = document.getElementById('cuisineFilter');
const timeFilter = document.getElementById('timeFilter');

let allRecipes = [];

fetch('data/recipes.json')
  .then(res => res.json())
  .then(data => {
    allRecipes = data;
    renderRecipes(allRecipes);
    renderFavourites();
  });

function renderRecipes(recipes) {
  recipesContainer.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const isFav = isFavourite(recipe.name);
    card.innerHTML = `
      <div class="fav-star" onclick="toggleFavourite('${recipe.name}')">
        ${isFav ? '⭐' : '☆'}
      </div>
      <img src="images/${recipe.image}" alt="${recipe.name}" onclick="openModal('${recipe.name}')">
      <h3>${recipe.name}</h3>
      <p>Time: ${recipe.time} min</p>
      <p>${recipe.ingredients.join(', ')}</p>
    `;
    recipesContainer.appendChild(card);
  });
}

function renderFavourites() {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  const favRecipes = allRecipes.filter(r => favourites.includes(r.name));
  favouritesContainer.innerHTML = '';
  favRecipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="images/${recipe.image}" alt="${recipe.name}" onclick="openModal('${recipe.name}')">
      <h3>${recipe.name}</h3>
    `;
    favouritesContainer.appendChild(card);
  });
}

function toggleFavourite(name) {
  let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  if (favourites.includes(name)) {
    favourites = favourites.filter(n => n !== name);
  } else {
    favourites.push(name);
  }
  localStorage.setItem('favourites', JSON.stringify(favourites));
  renderRecipes(filteredRecipes());
  renderFavourites();
}

function filteredRecipes() {
  return allRecipes.filter(recipe => {
    return (
      recipe.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
      (ingredientFilter.value === '' || recipe.ingredients.includes(ingredientFilter.value)) &&
      (cuisineFilter.value === '' || recipe.cuisine === cuisineFilter.value) &&
      (timeFilter.value === '' || recipe.time <= parseInt(timeFilter.value))
    );
  });
}

[searchInput, ingredientFilter, cuisineFilter, timeFilter].forEach(input => {
  input.addEventListener('input', () => {
    renderRecipes(filteredRecipes());
  });
});

function isFavourite(name) {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  return favourites.includes(name);
}

// Modal
const modal = document.getElementById("recipeModal");
const closeBtn = document.querySelector(".close-button");

function openModal(recipeName) {
  const recipe = allRecipes.find(r => r.name === recipeName);
  if (!recipe) return;

  document.getElementById("modalTitle").innerText = recipe.name;
  document.getElementById("modalImage").src = `images/${recipe.image}`;
  document.getElementById("modalTime").innerText = recipe.time;
  document.getElementById("modalIngredients").innerText = recipe.ingredients.join(', ');

  const stepsList = document.getElementById("modalSteps");
  stepsList.innerHTML = '';
  recipe.steps?.forEach(step => {
    const li = document.createElement('li');
    li.innerText = step;
    stepsList.appendChild(li);
  });

  modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
