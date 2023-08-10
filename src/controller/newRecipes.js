const { Recipe, Diets } = require('../db');

const newRecipes = async (req, res) => {
  const { title, image, summary, healthScore, step_by_step, selectedDiets } = req.body;

  if (!title || !image || !summary || !healthScore || !step_by_step || !selectedDiets || selectedDiets.length === 0) {
    return res.status(400).json({ message: "Invalid or missing data. Please provide all required fields, including at least one diet." });
  }

  try {
    const newRecipe = await Recipe.create({
      title: title,
      image: image,
      summary: summary,
      healthScore: healthScore,
      step_by_step: step_by_step,
    });

    const diets = await Diets.findAll({
      where: {
        name: selectedDiets
      }
    });

    await newRecipe.addDiets(diets);

    const allNewRecipe = await Recipe.findAll({
      where: { id: newRecipe.id },
      include: Diets,
    });

    return res.status(200).json(allNewRecipe);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { newRecipes };
