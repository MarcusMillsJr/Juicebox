//// MAIN ROUTER //// //// MAIN ROUTER //// //// MAIN ROUTER ////
//// MAIN ROUTER //// //// MAIN ROUTER //// //// MAIN ROUTER ////
//// MAIN ROUTER //// //// MAIN ROUTER //// //// MAIN ROUTER ////


const apiRouter = require('express').Router();
const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');


apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);



// console.log('----- / usersRouter / ------>', usersRouter);

module.exports = apiRouter;

