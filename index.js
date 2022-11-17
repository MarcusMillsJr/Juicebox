const PORT = 3000;
const express = require('express');
const server = express();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT);
})



const apiRouter = require('./api')
server.use('/api', apiRouter)
// console.log('----- / apiRouter / ------>', apiRouter);

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });