console.log("Meal Finder JavaScript connected!");

// Fetch meal categories from TheMealDB API

fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(response => response.json())
    .then(data => {

        const categories = data.categories;
        const categoriesContainer = document.getElementById("categoriesContainer");

        categories.forEach(category => {

            const categoryCard = document.createElement("div");

            categoryCard.classList.add("category-card");

            categoryCard.innerHTML = `
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <span>${category.strCategory}</span>
            `;

            categoriesContainer.appendChild(categoryCard);
        });

    })
    .catch(error => {
        console.error("Error fetching categories:", error);
    });