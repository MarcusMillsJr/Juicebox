const jwt = require('jsonwebtoken');
const SECRET = '234709asefiaserh181349'; // NEVER store your secret in a file on the server.  It should be a "secret" in your environment. 

console.log('SECRET: ', SECRET);

const user = {
  "name": "Ada Lovelace",
  "claimToFame": "First Programmer",
  "lived": "10 December 1815 to 27 November 1852"
};
console.log('user: ', user);

let token = jwt.sign(user, SECRET);
console.log('token: ', token);

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRhIExvdmVsYWNlIiwiY2xhaW1Ub0ZhbWUiOiJGaXJzdCBQcm9ncmFtbWVyIiwibGl2ZWQiOiIxMCBEZWNlbWJlciAxODE1IHRvIDI3IE5vdmVtYmVyIDE4NTIiLCJpYXQiOjE2Njg3MzE4MDB9.IHL7Dv-nE5jqRxhqQ-573JZsyCNYJHlezcEsHXtIp9s'

const decrypted = jwt.verify(token, SECRET);
console.log('decrypted: ', decrypted);

/* 
  Playground - https://jwt.io/
  Use this Example JSON to create and verify a token.
  {
    "id": 1,
    "name": "Annie Position",
    "email": "annie@email.com",
    "password": "unsafe",
    "address": null
  }
*/