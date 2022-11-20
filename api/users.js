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

/// {} destructuring getAllUsers from db so it can be called from within this users file


/// ???????????????///
/// ???????????????///
/// ???????????????///
// getting information back from get all users, then sending it to be seen in the window ??
usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
// sending the retrieved data (response(res))back to the user??
    // sending a users object that has the data(users) from getAllUsers to access 
    res.send({
        users: users
    });

});


module.exports = usersRouter;