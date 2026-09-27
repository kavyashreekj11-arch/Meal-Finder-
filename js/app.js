console.log("Meal Finder JavaScript connected!");

// Fetch meal categories from TheMealDB API

fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error fetching categories:", error);
    });