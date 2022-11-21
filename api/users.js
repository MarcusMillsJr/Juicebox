//// ROUTER FOR USERS ////
//// ROUTER FOR USERS ////
//// ROUTER FOR USERS ////
//// ROUTER FOR USERS ////

const express = require('express');
const {getAllUsers} = require('../db');
const usersRouter = express.Router();

// says anytime the user route is used, log this 
usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
// continuing to the next http method
    next();
})


// getting information back from get all users, then sending it to be seen in the window ??

/// {} destructuring getAllUsers from db so it can be called from within this users fil
/// ???????????????///
usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
    // console.log('users req', req);
// sending the retrieved data (response(res))back to the user??
    // sending a users object that has the data(users) from getAllUsers to access 
    res.send({
        users: users
    });

});


usersRouter.post('/login', async (req,res, next) => {
    console.log('response', res);

    res.end();
})

module.exports = usersRouter;
