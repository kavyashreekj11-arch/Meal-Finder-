const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const categoriesSection =
    document.getElementById("categoriesSection");

const categoriesContainer =
    document.getElementById("categoriesContainer");

const menuCategories =
    document.getElementById("menuCategories");

const categoryMenu =
    document.getElementById("categoryMenu");

const menuBtn =
    document.querySelector(".menu-btn");

const closeMenu =
    document.getElementById("closeMenu");

const searchResultsSection =
    document.getElementById("searchResultsSection");

const searchResultsContainer =
    document.getElementById("searchResultsContainer");

const categoryPage =
    document.getElementById("categoryPage");

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryDescription =
    document.getElementById("categoryDescription");

const categoryMealsContainer =
    document.getElementById("categoryMealsContainer");

const mealDetailsPage =
    document.getElementById("mealDetailsPage");

const mealDetailsImage =
    document.getElementById("mealDetailsImage");

const mealDetailsTitle =
    document.getElementById("mealDetailsTitle");

const mealDetailsCategory =
    document.getElementById("mealDetailsCategory");

const mealDetailsSource =
    document.getElementById("mealDetailsSource");

const mealDetailsTags =
    document.getElementById("mealDetailsTags");

const mealDetailsTagsRow =
    document.getElementById("mealDetailsTagsRow");

const breadcrumbMealName =
    document.getElementById("breadcrumbMealName");

const ingredientsContainer =
    document.getElementById("ingredientsContainer");

const measureContainer =
    document.getElementById("measureContainer");

const instructionsContainer =
    document.getElementById("instructionsContainer");


// ==================================================
// LOAD CATEGORIES
// ==================================================

async function loadCategories() {

    try {

        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/categories.php"
        );

        const data = await response.json();

        renderCategories(data.categories);

        renderMenuCategories(data.categories);

        restorePageFromHistory();

    } catch (error) {

        console.error(
            "Error loading categories:",
            error
        );

    }

}


// ==================================================
// RENDER CATEGORY CARDS
// ==================================================

function renderCategories(categories) {

    categoriesContainer.innerHTML = "";

    categories.forEach(category => {

        const card =
            document.createElement("div");

        card.className =
            "category-card";


        card.innerHTML = `
            <div class="category-image-wrapper">

                <img
                    src="${category.strCategoryThumb}"
                    alt="${category.strCategory}"
                >

                <span class="category-badge">
                    ${category.strCategory}
                </span>

            </div>
        `;


        card.addEventListener(
            "click",
            () => {

                showCategory(
                    category.strCategory,
                    category.strCategoryDescription,
                    true
                );

            }
        );


        categoriesContainer.appendChild(card);

    });

}


// ==================================================
// SIDE MENU CATEGORIES
// ==================================================

function renderMenuCategories(categories) {

    menuCategories.innerHTML = "";

    categories.forEach(category => {

        const link =
            document.createElement("button");

        link.textContent =
            category.strCategory;


        link.addEventListener(
            "click",
            () => {

                showCategory(
                    category.strCategory,
                    category.strCategoryDescription,
                    true
                );

            }
        );


        menuCategories.appendChild(link);

    });

}


// ==================================================
// CREATE MEAL CARD
// ==================================================

function createMealCard(
    meal,
    categoryName = ""
) {

    const card =
        document.createElement("div");

    card.className =
        "meal-card";


    card.innerHTML = `
        <div class="meal-image-wrapper">

            <img
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >

            ${
                categoryName
                    ? `
                        <span class="meal-category-badge">
                            ${categoryName}
                        </span>
                    `
                    : ""
            }

        </div>

        <div class="meal-card-content">

            <p class="meal-area">
                ${meal.strArea || ""}
            </p>

            <h3>
                ${meal.strMeal}
            </h3>

        </div>
    `;


    card.addEventListener(
        "click",
        () => {

            showMealDetails(
                meal.idMeal,
                true
            );

        }
    );


    return card;

}


// ==================================================
// SHOW CATEGORY PAGE
// ==================================================

async function showCategory(
    categoryName,
    description = "",
    addHistory = true
) {

    window.scrollTo(0, 0);

    closeSideMenu();


    if (addHistory) {

        history.pushState(
            {},
            "",
            `#category=${encodeURIComponent(
                categoryName
            )}`
        );

    }


    document.querySelector(
        ".hero"
    ).style.display = "block";


    searchResultsSection.style.display =
        "none";


    categoryPage.style.display =
        "block";


    mealDetailsPage.style.display =
        "none";


    /*
        Categories are hidden while viewing
        an individual category page.
    */

    categoriesSection.style.display =
        "none";


    categoryTitle.textContent =
        categoryName;

    categoryDescription.textContent =
        description;


    categoryMealsContainer.innerHTML =
        "<p>Loading meals...</p>";


    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
                categoryName
            )}`
        );

        const data =
            await response.json();


        categoryMealsContainer.innerHTML =
            "";


        if (!data.meals) {

            categoryMealsContainer.innerHTML =
                "<p>No meals found.</p>";

            return;

        }


        data.meals.forEach(
            meal => {

                const card =
                    createMealCard(
                        meal,
                        categoryName
                    );

                categoryMealsContainer.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading category meals:",
            error
        );

        categoryMealsContainer.innerHTML =
            "<p>Unable to load meals.</p>";

    }

}


// ==================================================
// SHOW MEAL DETAILS
// ==================================================

async function showMealDetails(
    mealId,
    addHistory = false
) {

    window.scrollTo(0, 0);

    closeSideMenu();


    if (addHistory) {

        history.pushState(
            {},
            "",
            `#meal=${encodeURIComponent(mealId)}`
        );

    }


    /*
        Meal details keeps the HERO visible,
        exactly like the reference screenshot.
    */

    document.querySelector(
        ".hero"
    ).style.display = "block";


    searchResultsSection.style.display =
        "none";


    categoryPage.style.display =
        "none";


    mealDetailsPage.style.display =
        "block";


    /*
        IMPORTANT:

        Categories are visible here because
        they now come AFTER the meal details
        section in the HTML.
    */

    categoriesSection.style.display =
        "block";


    // Clear previous content

    mealDetailsImage.src = "";

    mealDetailsTitle.textContent = "";

    mealDetailsCategory.textContent = "";

    mealDetailsSource.textContent = "";

    mealDetailsTags.textContent = "";

    ingredientsContainer.innerHTML = "";

    measureContainer.innerHTML = "";

    instructionsContainer.innerHTML = "";


    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );

        const data =
            await response.json();


        const meal =
            data.meals[0];


        if (!meal) {

            mealDetailsTitle.textContent =
                "Meal not found.";

            return;

        }


        // ------------------------------------------
        // BASIC INFORMATION
        // ------------------------------------------

        mealDetailsImage.src =
            meal.strMealThumb;

        mealDetailsImage.alt =
            meal.strMeal;


        mealDetailsTitle.textContent =
            meal.strMeal;


        mealDetailsCategory.textContent =
            meal.strCategory || "";


        mealDetailsSource.textContent =
            meal.strSource || "Not available";


        if (meal.strTags) {

            mealDetailsTags.textContent =
                meal.strTags;

            mealDetailsTagsRow.style.display =
                "flex";

        } else {

            mealDetailsTagsRow.style.display =
                "none";

        }


        breadcrumbMealName.textContent =
            meal.strMeal;


        // ------------------------------------------
        // INGREDIENTS + MEASUREMENTS
        // ------------------------------------------

        let ingredientNumber = 1;


        for (
            let i = 1;
            i <= 20;
            i++
        ) {

            const ingredient =
                meal[`strIngredient${i}`];

            const measure =
                meal[`strMeasure${i}`];


            if (
                ingredient &&
                ingredient.trim() !== ""
            ) {


                // ------------------------------
                // INGREDIENT
                // ------------------------------

                const ingredientItem =
                    document.createElement("div");

                ingredientItem.className =
                    "ingredient-item";


                ingredientItem.innerHTML = `
                    <span class="ingredient-number">
                        ${ingredientNumber}
                    </span>

                    <span class="ingredient-name">
                        ${ingredient}
                    </span>
                `;


                ingredientsContainer.appendChild(
                    ingredientItem
                );


                // ------------------------------
                // MEASURE
                // ------------------------------

                const measureItem =
                    document.createElement("div");

                measureItem.className =
                    "measure-item";


                measureItem.innerHTML = `
                    <span
                        class="measure-spoon"
                        aria-hidden="true"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                            <path
                                d="
                                    M12 2
                                    C8.69 2 6 4.69 6 8
                                    C6 10.84 7.85 13.25 10.5 13.83
                                    V21
                                    C10.5 21.83 11.17 22.5 12 22.5
                                    C12.83 22.5 13.5 21.83 13.5 21
                                    V13.83
                                    C16.15 13.25 18 10.84 18 8
                                    C18 4.69 15.31 2 12 2
                                    Z

                                    M12 4
                                    C14.21 4 16 5.79 16 8
                                    C16 10.21 14.21 12 12 12
                                    C9.79 12 8 10.21 8 8
                                    C8 5.79 9.79 4 12 4
                                    Z
                                "
                            />

                        </svg>

                    </span>

                    <span>
                        ${measure || ""}
                    </span>
                `;


                measureContainer.appendChild(
                    measureItem
                );


                ingredientNumber++;

            }

        }


        // ------------------------------------------
        // INSTRUCTIONS
        // ------------------------------------------

        const instructions =
            meal.strInstructions || "";


        const instructionParts =
            instructions
                .split(/\r?\n/)
                .map(
                    text => text.trim()
                )
                .filter(
                    text => text.length > 0
                );


        instructionParts.forEach(
            instructionText => {

                const instructionItem =
                    document.createElement("div");

                instructionItem.className =
                    "instruction-item";


                instructionItem.innerHTML = `
                    <span class="instruction-check">
                        ☑
                    </span>

                    <span>
                        ${instructionText}
                    </span>
                `;


                instructionsContainer.appendChild(
                    instructionItem
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading meal details:",
            error
        );

        mealDetailsTitle.textContent =
            "Unable to load meal details.";

    }

}


// ==================================================
// HOME PAGE
// ==================================================

function showHomePage(
    addHistory = false
) {

    window.scrollTo(0, 0);

    closeSideMenu();


    if (addHistory) {

        history.pushState(
            {},
            "",
            window.location.pathname
        );

    }


    document.querySelector(
        ".hero"
    ).style.display = "block";


    searchResultsSection.style.display =
        "none";


    categoryPage.style.display =
        "none";


    mealDetailsPage.style.display =
        "none";


    categoriesSection.style.display =
        "block";


    searchInput.value = "";

}


// ==================================================
// SEARCH MEALS
// ==================================================

async function searchMeals(
    addHistory = true
) {

    window.scrollTo(0, 0);

    const query =
        searchInput.value.trim();


    if (!query) {

        return;

    }


    if (addHistory) {

        history.pushState(
            {},
            "",
            `#search=${encodeURIComponent(
                query
            )}`
        );

    }


    document.querySelector(
        ".hero"
    ).style.display = "block";


    searchResultsSection.style.display =
        "block";


    categoryPage.style.display =
        "none";


    mealDetailsPage.style.display =
        "none";


    /*
        Search results + categories
        are visible on the home/search view.
    */

    categoriesSection.style.display =
        "block";


    searchResultsContainer.innerHTML =
        "<p>Searching...</p>";


    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
                query
            )}`
        );

        const data =
            await response.json();


        searchResultsContainer.innerHTML =
            "";


        if (!data.meals) {

            searchResultsContainer.innerHTML =
                "<p>No meals found.</p>";

            return;

        }


        data.meals.forEach(
            meal => {

                const card =
                    createMealCard(
                        meal,
                        meal.strCategory || ""
                    );

                searchResultsContainer.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Error searching meals:",
            error
        );

        searchResultsContainer.innerHTML =
            "<p>Unable to search meals.</p>";

    }

}


// ==================================================
// MENU
// ==================================================

function openSideMenu() {

    categoryMenu.classList.add(
        "menu-open"
    );

}


function closeSideMenu() {

    categoryMenu.classList.remove(
        "menu-open"
    );

}


menuBtn.addEventListener(
    "click",
    openSideMenu
);


closeMenu.addEventListener(
    "click",
    closeSideMenu
);


// ==================================================
// HOME LOGO
// ==================================================

document
    .querySelector(".logo")
    .addEventListener(
        "click",
        () => showHomePage(true)
    );


// ==================================================
// SEARCH BUTTON
// ==================================================

searchBtn.addEventListener(
    "click",
    () => searchMeals(true)
);


// ==================================================
// ENTER KEY SEARCH
// ==================================================

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchMeals(true);

        }

    }
);


// ==================================================
// BROWSER BACK / FORWARD
// ==================================================

window.addEventListener(
    "popstate",
    restorePageFromHistory
);


// ==================================================
// RESTORE PAGE FROM URL
// ==================================================

function restorePageFromHistory() {

    const hash =
        window.location.hash;


    if (!hash) {

        showHomePage(false);

        return;

    }


    if (
        hash.startsWith(
            "#category="
        )
    ) {

        const categoryName =
            decodeURIComponent(
                hash.replace(
                    "#category=",
                    ""
                )
            );


        showCategory(
            categoryName,
            "",
            false
        );

        return;

    }


    if (
        hash.startsWith(
            "#meal="
        )
    ) {

        const mealId =
            decodeURIComponent(
                hash.replace(
                    "#meal=",
                    ""
                )
            );


        showMealDetails(
            mealId,
            false
        );

        return;

    }


    if (
        hash.startsWith(
            "#search="
        )
    ) {

        const query =
            decodeURIComponent(
                hash.replace(
                    "#search=",
                    ""
                )
            );


        searchInput.value =
            query;


        searchMeals(false);

        return;

    }


    showHomePage(false);

}


// ==================================================
// START APPLICATION
// ==================================================

loadCategories();