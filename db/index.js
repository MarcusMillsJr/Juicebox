///// INITIALIZE CLIENT ////////// INITIALIZE CLIENT ////////// INITIALIZE CLIENT ////////// INITIALIZE CLIENT
const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");
// console.log(client, 'client');

///////////////// USER STUFF ////////////// USER STUFF ///////////////////// USER STUFF //////////

/////CREATE USER /////
/////CREATE USER /////
/////CREATE USER /////
const createUser = async ({ username, password, name, location }) => {
  try {
    const { rows: [user] } = await client.query(
      `
      INSERT INTO users (username,password,name,location) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
};

///// UPDATE USER /////
///// UPDATE USER /////
///// UPDATE USER /////

const updateUser = async (id, fields = {}) => {

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
    UPDATE users
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
};

///// GET ALL USERS /////
///// GET ALL USERS /////
///// GET ALL USERS /////

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(
      `SELECT id, username, name, location, active 
      FROM users;
      `);
    // console.log("this is an log in getAllUsers.. awaiting");
    return rows;
  } catch (error) {
    throw error
  }
};


///// GET USER BY ID /////
///// GET USER BY ID /////
///// GET USER BY ID /////

const getUserById = async (userId) => {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT id username, name, location, active
    FROM users
    WHERE id =${userId}
    `);

    if (!user) {
      return null;
    }

    user.posts = await getPostsByUser(userId)

    return user;
  } catch (error) {
    throw error;
  }
};

///////////////// POST STUFF ////////////// POST STUFF ///////////////////// POST STUFF //////////

/// CREATE POST ////
/// CREATE POST ////
/// CREATE POST ////

const createPost = async ({ authorId, title, content }) => {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
    INSERT INTO posts ("authorId", title, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
      [authorId, title, content]
    );

    return post;
  } catch (error) {
    throw error;
  }
};

//// UPDATE POST //////
//// UPDATE POST //////
//// UPDATE POST //////

const updatePost = async (id, fields = {}) => {
  // from testDb() updateUser is called with arguments of
  //  id = users[0].id , fields = {name: "newname sogood", location: "Lesterville, KY"}
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // 1. stored in a variable setString to be used as interpolation
  //  2. Object.keys () returns an array of an object's own (property names),
  //     iterated in the same order that a normal loop would
  // 3. Object.keys ---> [fields.map(key"name", index)]
  // WHAT IS KEY / INDEX??
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [post],
    } = await client.query(
      `
    UPDATE posts
    SET ${setString}
    WHERE id =${id}
    RETURNING *;
    `,
      Object.values(fields)
    );

    return post;
  } catch (error) {
    throw error;
  }
};

///// GET ALL POST ///////
///// GET ALL POST ///////
///// GET ALL POST ///////

const getAllPosts = async () => {
  try {
    const { rows } = await client.query(`
    SELECT * 
    FROM posts
    `);
    // console.log("this is an log in getAllUsers.. awaiting");
    return rows;
  } catch (error) {
    throw error;
  }
}

///// GET POSTS BY USER /////
///// GET POSTS BY USER /////
///// GET POSTS BY USER /////

const getPostsByUser = async (userId) => {
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM posts
      WHERE "authorId"= ${userId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
};

////////// EXPORTS //////// EXPORTS ///////// EXPORTS //////// EXPORTS //////////
module.exports = {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
};
