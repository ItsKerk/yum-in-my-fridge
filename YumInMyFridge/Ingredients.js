const apiKey = ''; //Enter your key here

const SearchInput = document.querySelector('.SearchInput');
const IngSuggestion = document.querySelector('.IngSuggestion');
const YourIngredients = document.querySelector('.YourIngredients');

//Get input and call api based on that input
SearchInput.addEventListener('input',async (event) => {
    const query = event.target.value.trim();

    if (!query) {
        IngSuggestion.innerHTML = '';
        return;
    }

    try {

        const Ingredients = await fetchIngredients(query);
        displayIngredients(Ingredients);

    } catch (error) {
        console.error(`Error fetching ingredients: ${error}`);
    }
});

//Get Ingredients from autocomplete
async function fetchIngredients(query){
    try{
        const response = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${apiKey}&number=3&query=${query}`);

        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;

    }catch(error){
        console.error(`Error fetching ingredients: ${error}`);
        return [];
    }
}

//Display suggestions list
function displayIngredients(ingredients){
    IngSuggestion.innerHTML = '';

    if (ingredients.length === 0){
        IngSuggestion.innerHTML = `<li class="IngredientDropDown">Cant find any Ingredients</li>`
    }else{
        const listingredients = ingredients.map((element) => `<li class="IngredientDropDown">${element.name}</li>`);
        IngSuggestion.innerHTML = listingredients.join('');
    }

}

//Check if the click is outside the SearchInput and not on the IngSuggestion
document.addEventListener('click', (event) => {
    if (!SearchInput.contains(event.target) && !IngSuggestion.contains(event.target)) {
        IngSuggestion.innerHTML = '';
    }
});                                                                 

//Add Ingredients - Event listener on parent element
IngSuggestion.addEventListener('click', selectIngredient);

function selectIngredient(event) {
    if (event.target && event.target.classList.contains('IngredientDropDown') && event.target.textContent!=='Cant find any Ingredients') {
        addIngredient(event.target.textContent)
    }
}

function addIngredient(event){

    IngSuggestion.innerHTML = '';
    SearchInput.value = '';

    if (!YourIngredients.innerHTML.includes(event)) {
        let IngLocal = JSON.parse(localStorage.getItem('ingredients')) || [];

        //Remove span and change height
        if (IngLocal.length === 0) {
            YourIngredients.innerHTML = '';
            YourIngredients.style.height = 'auto';
        }

        //Add to html
        YourIngredients.innerHTML += `<div class='Ingredient'>${event}</div>`;

        //Store in local
        IngLocal.push(event);
        localStorage.setItem("ingredients", JSON.stringify(IngLocal));
    }
}


//Remove Ingredients
YourIngredients.addEventListener('click', removeIngredient);

function removeIngredient(event) {
    if (event.target && event.target.classList.contains('Ingredient')) {
        //Remove from html
        YourIngredients.removeChild(event.target);

        //Remove from local storage
        let IngLocal = JSON.parse(localStorage.getItem('ingredients'));
        const ingredientToRemove = event.target.textContent;
        IngLocal = IngLocal.filter(ingredient => ingredient !== ingredientToRemove);
        localStorage.setItem('ingredients', JSON.stringify(IngLocal));

        //Add span and change height
        if (YourIngredients.children.length === 0) {
            YourIngredients.innerHTML = `<span class="NoIng">No ingredients added</span>`
            YourIngredients.style.height = '100%';
        }
    }
}

//Load the ingredients from localStorage when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    let IngLocal = JSON.parse(localStorage.getItem('ingredients'));

    if (IngLocal && IngLocal.length > 0) {
        Display(IngLocal);
    }
});

function Display(IngLocal){
    YourIngredients.innerHTML = '';

    IngLocal.forEach(Ingredient =>{
        YourIngredients.innerHTML += `<div class='Ingredient'>${Ingredient}</div>`;
        YourIngredients.style.height = 'auto';
    })
}