const axios = require("axios");
const { Recipe, Diets } = require("../db");
require("dotenv").config();
const { DB_API_KEY } = process.env;

const getDetails = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({ message: "Missing recipe id!" });
  }

  const isApiId = /^\d+$/.test(id);

  try {
    if (isApiId) {
      // Es un ID de API
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: {
            includeNutrition: false,
            apiKey: DB_API_KEY,
          },
        }
      );

      const responseData = response.data;

      if (responseData) {
        const detailAPI = {
          id: responseData.id,
          title: responseData.title,
          image: responseData.image,
          summary: responseData.summary,
          healthScore: responseData.healthScore,
          stepbystep: responseData.instructions,
          diets: responseData.diets,
        };

        return res.json(detailAPI);
      }
    } else {
      const dbRecipe = await Recipe.findOne({
        where: {
          id: id,
        },
        include: Diets,
      });

      if (dbRecipe) {
        const detailDB = {
          id: dbRecipe.id,
          title: dbRecipe.title,
          image: dbRecipe.image,
          summary: dbRecipe.summary,
          healthScore: dbRecipe.healthScore,
          stepbystep: dbRecipe.step_by_step,
          diets: dbRecipe.Diets.map((diet) => diet.name)
        };

        return res.json(detailDB);
      }
    }

    return res.status(404).json({ message: "Recipe not found." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { getDetails };
