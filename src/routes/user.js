const userRouter = require('express').Router();
const { login } = require('../controller/login');
const { newUser } = require('../controller/newUser');

userRouter.get('/', login);
userRouter.post('/', newUser);

module.exports = { userRouter }