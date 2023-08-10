const axios = require("axios");
require("dotenv").config();
const { Diets } = require("../db");
const { DB_API_KEY } = process.env;

const getDietsApi = async () => {
  const response = await axios.get(
    "https://api.spoonacular.com/recipes/complexSearch?query=",
    {
      params: {
        number: 5222,
        apiKey: DB_API_KEY,
        addRecipeInformation: true,
      },
    }
  );

  const dietsApi = response.data.results
    ? response.data.results.map((diet) => diet.diets)
    : [];

  let allDiets = [];

  dietsApi.forEach((diet) => diet.forEach((dieta) => allDiets.push(dieta)));

  return allDiets;
};

const createDietsDB = async () => {
  const diets = await getDietsApi();
  diets.forEach(async (diet) => {
    await Diets.findOrCreate({
      where: {
        name: diet,
      },
    });
  });
};

const getAllDiet = async () => {
  await createDietsDB();
  const allDiets = await Diets.findAll();

  return allDiets;
};

const getDiets = async (req, res) => {
  try {
    const diets = await getAllDiet();
    const dietsNames = diets.map((diet) => diet.name);

    return res.json(dietsNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getDiets };
