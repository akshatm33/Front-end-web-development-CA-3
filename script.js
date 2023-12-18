const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealResult = document.getElementById('mealResult');
const randomMeal = document.getElementById('randomMealContent');
const mealDetailsContent = document.querySelector('.meal-details-content'); // Add this line
const recipeCloseBtn = document.querySelector('.recipe-close-btn');


// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
window.addEventListener('load', getRandomMeal);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');

                // Display the meal results
                mealResult.style.display = 'block';
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        });
}



// function to fetch and display a random meal
function getRandomMeal() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const randomMealData = data.meals[0];
            displayRandomMeal(randomMealData);
        });
}

// function to display the details of a random meal
function displayRandomMeal(randomMealData) {
    let html = `
        <div class="meal-item" data-id="${randomMealData.idMeal}">
            <div class="meal-img">
                <img src="${randomMealData.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
                <h3>${randomMealData.strMeal}</h3>
            </div>
        </div>
    `;
    randomMeal.innerHTML = html;

    // Display the random meal section
    randomMeal.parentElement.style.display = 'block';
}

// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}