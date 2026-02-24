"use server"
const MealDb_Base = "https://www.themealdb.com/api/json/v1/1";

export async function getRecipeOfTheDay() {
    try {
        const response = await fetch(`${MealDb_Base}/random.php`, {
            next: { revalidate: 86400 },

        })
        if (!response.ok) {
            throw new Error("Failed to fetch the recipe of the day")
        }
        const data = await response.json()
        return {
            success: true,
            recipe: data.meals[0]
        }
    } catch (error) {
        console.error("Error in fetching the recipe of the day:", error);
        throw new Error(error.message || "Failed to load the recipe")
    }
}
export async function getCategories() {
    try {
        const response = await fetch(`${MealDb_Base}/list.php?c=list`, {
            next: { revalidate: 604800 }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories")
        }
        const data = await response.json();

        return {
            success: true,
            category: data.meals || []
        }

    } catch (error) {
        console.error("Error in fetching the categories", error);
        throw new Error(error.message || "Failed to load the categories")
    }
}


export async function getAreas() {
    try {
        const response = await fetch(`${MealDb_Base}/list.php?a=list`, {
            next: { revalidate: 86400 }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch areas")
        }
        const data = await response.json();

        return {
            success: true,
            category: data.meals || []
        }

    } catch (error) {
        console.error("Error in fetching the areas", error);
        throw new Error(error.message || "Failed to load the areas")
    }
}


export async function getMealsByCategory(category) {
    try {
        const response = await fetch(`${MealDb_Base}/filter.php?c=${category}`, {
            next: { revalidate: 86400 }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch meals")
        }
        const data = await response.json();

        return {
            success: true,
            meals: data.meals || []
        }

    } catch (error) {
        console.error("Error in fetching the meals", error);
        throw new Error(error.message || "Failed to load the meals")
    }
}

export async function getMealsByArea(area) {
    try {
        const response = await fetch(`${MealDb_Base}/filter.php?a=${area}`, {
            next: { revalidate: 86400 }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch meals")
        }
        const data = await response.json();

        return {
            success: true,
            meals: data.meals || []
        }

    } catch (error) {
        console.error("Error in fetching the areas", error);
        throw new Error(error.message || "Failed to load the meals")
    }
}
