const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");
// console.log(client, 'client');

const createUser = async ({ username, password, name, location }) => {
  try {
    const {rows} = await client.query(
      `
      INSERT INTO users (username,password,name,location) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, password, name, location]);

    return rows;
  } catch (error) {   
    throw error;
  }
};



const getAllUsers = async () => {
  const { rows } = await client.query(`SELECT id, username, name, location FROM users`);
  // console.log("this is an log in getAllUsers.. awaiting");
  return rows;
};

const updateUser = async(id, fields = {}) => {
  // from testDb() updateUser is called with arguments of
  //  id = users[0].id , fields = {name: "newname sogood", location: "Lesterville, KY"}
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index+1}`
  ).join(', ');
    // 1. stored in a variable setString to be used as interpolation
    //  2. Object.keys () returns an array of an object's own (property names), 
    //     iterated in the same order that a normal loop would
    // 3. Object.keys ---> [fields.map(key"name", index)]
    // WHAT IS KEY / INDEX??
if(setString.length === 0) {
  return;
}

try {
  const {rows: [user]} = await client.query(`
    UPDATE users
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));

    return user
} catch (error) {
  console.log('error updating user');
  throw error
}

}


const createPost = async({authorId, title, content}) => {
  try {
    const {rows} = await client.query(
    `
    INSERT INTO users (authorId, title, content) 
    VALUES ($1, $2, $3)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
  `, [authorId, title, content]);
  
  return rows
  } catch (error) {
    throw error;
  }
};

module.exports = {
  client,
  createUser,
  getAllUsers,
  updateUser,
  createPost,
};
