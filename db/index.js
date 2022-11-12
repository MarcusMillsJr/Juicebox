const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");
// console.log(client, 'client');

const getAllUsers = async () => {
  const { rows } = await client.query(`SELECT id, username FROM users`);
  console.log("this is an log in getAllUsers.. awaiting");
  return rows;
};

const createUser = async ({ username, password }) => {
  try {
    const {rows} = await client.query(
      `
      INSERT INTO users (username,password) 
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, ['sandra', 'glamgal']);

    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  client,
  getAllUsers,
  createUser,
};
