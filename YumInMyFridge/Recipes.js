const IngLocal = JSON.parse(localStorage.getItem('ingredients'));
const ingredients = IngLocal.join(',');

//Fetch recipes based on ingredients
async function fetchRecipes(ingredients) {
    try{
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ranking=2&ignorePantry=true&number=10&ingredients=${ingredients}`);

        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        //Get data                                                                              
        const data = await response.json();
        displayRecipes(data);

    }catch(error){
        console.error(`Error fetching recipes: ${error}`);
    }
}

fetchRecipes(ingredients);

//Create recipes in dom
const AllRecipes = document.querySelector('.AllRecipes');

function displayRecipes(recipes){
    recipes.forEach(recipe => {
        AllRecipes.style.visibility =  'unset';
        AllRecipes.innerHTML +=  `<div class="Recipe" id="${recipe.id}">
                                    <img src="${recipe.image}" alt="RecipeImage" class="RecipeImg">
                                        <div class="RecipeDetails">
                                            <h3 class="RecipeHeader">${recipe.title}</h3>

                                            <div class="IngSection UsedIng">
                                                <span class="IngHeader">You have ${recipe.usedIngredientCount} Ingredients:</span>
                                                <ul class="IngList" id="used${recipe.id}">
                                                </ul>
                                            </div>
                                            <hr>
                                            <div class="IngSection MissIng">
                                                <span class="IngHeader">You are missing ${recipe.missedIngredientCount} Ingredients:</span>
                                                <ul class="IngList" id="missed${recipe.id}">
                                                </ul>
                                            </div>
                                        </div>
                                    </div> `
        
        //Add used Ingredients
        recipe.usedIngredients.forEach(usedIngredients =>{
            const UsedList = document.querySelector(`#used${recipe.id}`);
            UsedList.innerHTML += `<li class="Ing">${usedIngredients.name}</li>`
        })

        //Add missing Ingredients
        recipe.missedIngredients.forEach(missedIngredients =>{
            const MissList = document.querySelector(`#missed${recipe.id}`);
            MissList.innerHTML += `<li class="Ing">${missedIngredients.name}</li>`
        })
    });
}

//Go to source URL when a recipe is clicked
async function fetchInfo(RecipeId) {
    try{
        const response = await fetch(`https://api.spoonacular.com/recipes/${RecipeId}/information?apiKey=${apiKey}&includeNutrition=false`);

        if(!response.ok){
            throw new Error('Network response was not ok');
        }
                                                                           
        const data = await response.json();
        const sourceURL = data.sourceUrl
        window.open(sourceURL, "_blank");

    }catch(error){
        console.error(`Error fetching recipes: ${error}`);
    }
}

//Event listener on parent element
AllRecipes.addEventListener('click', function(event) {

    const recipeElement = event.target.closest('.Recipe');
    if (recipeElement) {
        fetchInfo(recipeElement.id)
    }
});