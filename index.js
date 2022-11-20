///// SERVER ///// SERVER ///// SERVER ///// SERVER 
///// SERVER ///// SERVER ///// SERVER ///// SERVER 
///// SERVER ///// SERVER ///// SERVER ///// SERVER 
///// SERVER ///// SERVER ///// SERVER ///// SERVER 


const PORT = 3000;
const express = require('express');

// THIS ALLOWS US TO USE EXPRESS ANYWHERE WITH THE REQUIRE
const server = express();
// THIS ESTABLISHES SERVER AS 
const { client } = require('./db/index.js')
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT);
})



const apiRouter = require('./api')
server.use('/api', apiRouter)
// console.log('----- / apiRouter / ------>', apiRouter);

const morgan = require ('morgan');
server.use(morgan('dev'));


server.use(express.json())

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });
