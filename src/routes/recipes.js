const recipesRouter = require('express').Router();
const { getDetails } = require('../controller/getDetails');
const { getRecipes } = require('../controller/getRecipes');
const { newRecipes } = require('../controller/newRecipes');
const { getRecipeByName } = require('../controller/getRecipesByName');

recipesRouter.post('/', newRecipes);
recipesRouter.get('/', getRecipes);
recipesRouter.get('/search', getRecipeByName);
recipesRouter.get('/:id', getDetails);

module.exports = { recipesRouter };