const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");
// console.log(client, 'client');

const getAllUsers = async () => {
  const { rows } = await client.query(`SELECT id, username FROM users`);
//   console.log(rows, 'this is rows');
  return rows;
};

// getAllUsers()

module.exports = {
  client,
  getAllUsers,
};
