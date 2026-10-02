console.log("Meal Finder JavaScript connected!");


// =========================================
// GLOBAL ELEMENTS
// =========================================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchBtn");

const searchResultsSection =
    document.getElementById("searchResultsSection");

const searchResultsContainer =
    document.getElementById("searchResultsContainer");

const categoriesSection =
    document.querySelector(".categories-section");

const hero =
    document.querySelector(".hero");

const categoryPage =
    document.getElementById("categoryPage");

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryDescription =
    document.getElementById("categoryDescription");

const categoryMealsContainer =
    document.getElementById("categoryMealsContainer");

const menuButton =
    document.querySelector(".menu-btn");

const categoryMenu =
    document.getElementById("categoryMenu");

const closeMenu =
    document.getElementById("closeMenu");


// =========================================
// FETCH MEAL CATEGORIES
// =========================================

fetch("https://www.themealdb.com/api/json/v1/1/categories.php")

    .then(response => response.json())

    .then(data => {

        const categories = data.categories;

        const categoriesContainer =
            document.getElementById("categoriesContainer");

        const menuCategories =
            document.getElementById("menuCategories");


        // =========================================
        // DISPLAY CATEGORY CARDS
        // =========================================

        categories.forEach(category => {

            const categoryCard =
                document.createElement("div");

            categoryCard.classList.add("category-card");


            categoryCard.innerHTML = `
                <img
                    src="${category.strCategoryThumb}"
                    alt="${category.strCategory}"
                >

                <span>
                    ${category.strCategory}
                </span>
            `;


            // =========================================
            // OPEN CATEGORY PAGE WHEN CARD IS CLICKED
            // =========================================

            categoryCard.addEventListener(
                "click",
                () => {

                    showCategory(
                        category.strCategory,
                        category.strCategoryDescription
                    );

                }
            );


            categoriesContainer.appendChild(
                categoryCard
            );

        });


        // =========================================
        // DISPLAY CATEGORY MENU
        // =========================================

        categories.forEach(category => {

            const menuLink =
                document.createElement("a");

            menuLink.textContent =
                category.strCategory;

            menuLink.href = "#";


            menuLink.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    showCategory(
                        category.strCategory,
                        category.strCategoryDescription
                    );

                }
            );


            menuCategories.appendChild(
                menuLink
            );

        });

    })

    .catch(error => {

        console.error(
            "Error fetching categories:",
            error
        );

    });


// =========================================
// CREATE MEAL CARD
// =========================================

function createMealCard(
    meal,
    categoryName = ""
) {

    const mealCard =
        document.createElement("div");

    mealCard.classList.add("meal-card");


    // Category shown in badge

    const category =
        categoryName || meal.strCategory;


    // Area / cuisine shown below image

    const area =
        meal.strArea || "";


    mealCard.innerHTML = `
        <div class="meal-image">

            <img
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >

            <span class="meal-badge">
                ${category}
            </span>

        </div>

        <p class="meal-area">
            ${area}
        </p>

        <h3>
            ${meal.strMeal}
        </h3>
    `;

    return mealCard;
}


// =========================================
// CATEGORY PAGE
// =========================================

function showCategory(
    categoryName,
    description
) {

    // Close side menu

    categoryMenu.classList.remove("active");


    // Hide homepage sections

    hero.style.display = "none";

    categoriesSection.style.display = "none";

    searchResultsSection.style.display = "none";


    // Show category page

    categoryPage.style.display = "block";


    // Add category information

    categoryTitle.textContent =
        categoryName;

    categoryDescription.textContent =
        description;


    // Clear previous meals

    categoryMealsContainer.innerHTML = "";


    // =========================================
    // FETCH CATEGORY MEALS
    // =========================================

    fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
    )

        .then(response => response.json())

        .then(data => {

            console.log(data);


            if (!data.meals) {

                categoryMealsContainer.innerHTML =
                    "<p>No meals found.</p>";

                return;
            }


            data.meals.forEach(meal => {

                const mealCard =
                    createMealCard(
                        meal,
                        categoryName
                    );

                categoryMealsContainer.appendChild(
                    mealCard
                );

            });

        })

        .catch(error => {

            console.error(
                "Error fetching category meals:",
                error
            );

        });
}


// =========================================
// SEARCH FUNCTIONALITY
// =========================================

searchButton.addEventListener(
    "click",
    searchMeals
);


// =========================================
// SEARCH USING ENTER KEY
// =========================================

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchMeals();

        }

    }
);


function searchMeals() {

    const foodName =
        searchInput.value.trim();


    // Don't search if input is empty

    if (foodName === "") {
        return;
    }


    // Return to homepage view

    hero.style.display = "flex";

    categoriesSection.style.display = "block";

    categoryPage.style.display = "none";


    // Clear previous search results

    searchResultsContainer.innerHTML = "";


    // =========================================
    // SEARCH THEMEALDB
    // =========================================

    fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`
    )

        .then(response => response.json())

        .then(data => {

            console.log(data);


            // Show MEALS section

            searchResultsSection.style.display =
                "block";


            // =========================================
            // NO RESULTS
            // =========================================

            if (!data.meals) {

                searchResultsContainer.innerHTML = `
                    <p>No meals found.</p>
                `;

                return;
            }


            // =========================================
            // DISPLAY SEARCH RESULTS
            // =========================================

            data.meals.forEach(meal => {

                const mealCard =
                    createMealCard(meal);

                searchResultsContainer.appendChild(
                    mealCard
                );

            });

        })

        .catch(error => {

            console.error(
                "Error searching meals:",
                error
            );

        });
}


// =========================================
// OPEN CATEGORY MENU
// =========================================

menuButton.addEventListener(
    "click",
    () => {

        categoryMenu.classList.add(
            "active"
        );

    }
);


// =========================================
// CLOSE CATEGORY MENU
// =========================================

closeMenu.addEventListener(
    "click",
    () => {

        categoryMenu.classList.remove(
            "active"
        );

    }
);