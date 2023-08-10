const axios = require("axios");
const { Recipe, Diets } = require("../db");
require("dotenv").config();
const { DB_API_KEY } = process.env;

const getRecipes = async (req, res) => {
  try {
    const response = await axios(
      `https://api.spoonacular.com/recipes/complexSearch?query=&`,
      {
        params: {
          apiKey: DB_API_KEY,
          number: 100,
          addRecipeInformation: true,  
        },
      }
    );

    const reciperResultsAPI = response.data.results;

    const recipesFromAPI = reciperResultsAPI.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        stepbystep: recipe.instructions,
        diets: recipe.diets,
    }))

    const recipesFromBD = await Recipe.findAll({
      include: {
        model: Diets,
        attributes: ["name"],
        through: { attributes: [] },
      },
    });

    const recipesResults = [...recipesFromAPI, ...recipesFromBD];

    res.json(recipesResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRecipes };
