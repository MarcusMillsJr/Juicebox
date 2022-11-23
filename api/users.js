//// ROUTER FOR USERS ////
//// ROUTER FOR USERS ////
//// ROUTER FOR USERS ////
//// ROUTER FOR USERS ////

const express = require('express');
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env;
const {getAllUsers, getUserByUsername, createUser} = require('../db');
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


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && user.password == password) {
        // create token & return to user

        const token = jwt.sign({id: user.id, username : user.username}, process.env.JWT_SECRET)
        res.send({ message: "you're logged in!", token:token});
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

  usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password,
        name,
        location,
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

module.exports = usersRouter;
