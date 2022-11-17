const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);
// console.log('----- / usersRouter / ------>', usersRouter);

module.exports = apiRouter;

