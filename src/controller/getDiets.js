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

  const dietsApi = response.data.results //SE BUSCA LAS PROPIEDADES DIETAS
    ? response.data.results.map((diet) => diet.diets)
    : [];

  let allDiets = [];

  dietsApi.forEach((diet) => diet.forEach((dieta) => allDiets.push(dieta))); //SE TOMA EL VALOR DE CADA DIETA

  return allDiets;
};

const createDietsDB = async () => { // SE CREA CADA DIETA EB LA BASE DE DATOS
  const diets = await getDietsApi();
  diets.forEach(async (diet) => {
    await Diets.findOrCreate({
      where: {
        name: diet,
      },
    });
  });
};

const getAllDiet = async () => { //SOLICITAMOS TODAS LAS DIETAS
  await createDietsDB();
  const allDiets = await Diets.findAll();

  return allDiets;
};

const getDiets = async (req, res) => { //TOMAMOS EL "NAME" DE LAS DIETAS
  try {
    const diets = await getAllDiet();
    const dietsNames = diets.map((diet) => diet.name);

    return res.json(dietsNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getDiets };
