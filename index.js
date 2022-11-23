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



server.use(express.json())
const apiRouter = require('./api')
server.use('/api', apiRouter)
// console.log('----- / apiRouter / ------>', apiRouter);

const morgan = require ('morgan');
server.use(morgan('dev'));

/// no examples
// server.get('/background/:color', (req, res, next) => {
//     res.send(`
//       <body style="background: ${ req.params.color };">
//         <h1>Hello World</h1>
//       </body>
//     `);
//   });

//   server.get('/add/:first/to/:second', (req, res, next) => {
//     res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
//       Number(req.params.first) + Number(req.params.second)
//      }</h1>`);
//   });


server.use('/', (req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
  });
