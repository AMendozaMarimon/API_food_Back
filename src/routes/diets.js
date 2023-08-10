const dietsRouter = require('express').Router();
const { getDiets } = require('../controller/getDiets');

dietsRouter.get('/', getDiets);

module.exports = { dietsRouter };