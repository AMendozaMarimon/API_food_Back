const axios = require("axios");
const { Op } = require("sequelize");
const { Recipe, Diets } = require("../db");
require("dotenv").config();
const { DB_API_KEY } = process.env;

const getRecipeByName = async (req, res) => {
  try {
    const { name } = req.query;

    const response = await axios(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          apiKey: DB_API_KEY,
          query: name,
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
      where: {
        title: {
          [Op.iLike]: `%${name}%`,
        },
      },
      include: {
        model: Diets,
        attributes: ["name"],
        through: { attributes: [] }, //NO TRAER NADA DE LA TABLA INTERMEDIA
      },
    });

    const recipesAPIandDB = [ ...recipesFromAPI, ...recipesFromBD,];

    return res.json(recipesAPIandDB);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getRecipeByName };
