console.log("Meal Finder JavaScript connected!");

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

            categoriesContainer.appendChild(categoryCard);
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


            // =========================================
            // CATEGORY CLICK
            // =========================================

            menuLink.addEventListener("click", event => {

                event.preventDefault();

                showCategory(
                    category.strCategory,
                    category.strCategoryDescription
                );

            });


            menuCategories.appendChild(menuLink);
        });

    })
    .catch(error => {
        console.error(
            "Error fetching categories:",
            error
        );
    });


// =========================================
// CATEGORY PAGE
// =========================================

function showCategory(categoryName, description) {

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

    const categoryMenu =
        document.getElementById("categoryMenu");


    // Close menu

    categoryMenu.classList.remove("active");


    // Hide homepage sections

    hero.style.display = "none";

    categoriesSection.style.display = "none";


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
    // FETCH MEALS FOR SELECTED CATEGORY
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
                    document.createElement("div");

                    mealCard.innerHTML = `
                        <img
                            src="${meal.strMealThumb}"
                            alt="${meal.strMeal}"
                        >
                      
                        <p class="meal-category">
                            ${categoryName}
                      </p>

                      <h3>
                           ${meal.strMeal}
                      </h3>
                    `;

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
// SIDE MENU
// =========================================

const menuButton =
    document.querySelector(".menu-btn");

const categoryMenu =
    document.getElementById("categoryMenu");

const closeMenu =
    document.getElementById("closeMenu");


menuButton.addEventListener("click", () => {

    categoryMenu.classList.add("active");

});


closeMenu.addEventListener("click", () => {

    categoryMenu.classList.remove("active");

});

// =========================================
// SEARCH FUNCTIONALITY
// =========================================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchBtn");

const searchResultsSection =
    document.getElementById("searchResultsSection");

const searchResultsContainer =
    document.getElementById("searchResultsContainer");


searchButton.addEventListener("click", searchMeals);


function searchMeals() {

    const foodName =
        searchInput.value.trim();


    // Do nothing if search is empty

    if (foodName === "") {
        return;
    }


    fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`
    )
        .then(response => response.json())

        .then(data => {

            console.log(data);


            // Clear previous results

            searchResultsContainer.innerHTML = "";


            // Show search section

            searchResultsSection.style.display =
                "block";


            // No meals found

            if (!data.meals) {

                searchResultsContainer.innerHTML =
                    "<p>No meals found.</p>";

                return;
            }


            // Display meals

            data.meals.forEach(meal => {

                const mealCard =
                    document.createElement("div");


                mealCard.innerHTML = `
                    <img
                        src="${meal.strMealThumb}"
                        alt="${meal.strMeal}"
                    >

                    <p class="meal-category">
                        ${meal.strCategory}
                    </p>

                    <h3>
                        ${meal.strMeal}
                    </h3>
                `;


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