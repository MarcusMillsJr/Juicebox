///// INITIALIZE CLIENT ////////// INITIALIZE CLIENT ////////// INITIALIZE CLIENT ////////// INITIALIZE CLIENT
const { Client } = require("pg");

const {DATABASE_URL = 'postgres://localhost:5433/juicebox-dev'} = process.env

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : undefined,
});
// console.log(client, 'client');

///////////////// USER STUFF ////////////// USER STUFF ///////////////////// USER STUFF //////////

/////CREATE USER /////
/////CREATE USER /////
/////CREATE USER /////

const createUser = async ({ username, password, name, location }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
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
  // console.log("fields from update user", fields);
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  // console.log(
  //   "object.keys(fields)",
  //   Object.keys(fields)
  //     .map((key, index) => `"${key}"=$${index + 1}`)
  //     .join(", ")
  // );

  // converts an array into a string
  
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
      `
    );
    // console.log("this is an log in getAllUsers.. awaiting");
    return rows;
  } catch (error) {
    throw error;
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

    user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
};

///////////////// POST STUFF ////////////// POST STUFF ///////////////////// POST STUFF //////////

/// CREATE POST ////
/// CREATE POST ////
/// CREATE POST ////

const createPost = async ({ authorId, title, content, tags = [] }) => {
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

    const tagList = await createTags(tags);
    // console.log("rows: [post] from create post", post);
    return await addTagsToPost(post.id, tagList)
  } catch (error) {
    throw error;
  }
};

//// UPDATE POST //////
//// UPDATE POST //////
//// UPDATE POST //////

const updatePost = async (postId, fields = {}) => {
  // from testDb() updateUser is called with arguments of
  //  id = users[0].id , fields = {name: "newname sogood", location: "Lesterville, KY"}
  const {tags} = fields;
  delete fields.tags;

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // 1. stored in a variable setString to be used as interpolation
  //  2. Object.keys () returns an array of an object's own (property names),
  //     iterated in the same order that a normal loop would
  // 3. Object.keys ---> [fields.map(key"name", index)]
  // WHAT IS KEY / INDEX??

  try {
    if (setString.length > 0) {
      await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id =${ postId }
        RETURNING *;
      `, Object.values(fields));
    }

    if (tags === undefined) {
      return await getPostById(postId);
    }

    const tagList = await createTags(tags);
    const tagListIdString = tagList.map(
      tag => `${ tag.id }`
    ).join(', ');
  
    await client.query(`
      DELETE FROM post_tags
      WHERE "tagId"
      NOT IN (${ tagListIdString })
      AND "postId"=$1;
    `, [postId]);

    await addTagsToPost(postId, tagList);

    return await getPostById(postId);
  } catch (error) {
    throw error
  }
};

///// GET ALL POST ///////
///// GET ALL POST ///////
///// GET ALL POST ///////

const getAllPosts = async () => {
  try {
    const { rows:postIds } = await client.query(`
    SELECT id
    FROM posts
    `);

    const posts = await Promise.all(postIds.map(
      post => getPostById(post.id)
      ))

    // console.log("posts in get All Posts", posts);
    return posts;
  } catch (error) {
    throw error;
  }
};

///// GET POSTS BY USER /////
///// GET POSTS BY USER /////
///// GET POSTS BY USER /////

const getPostsByUser = async (userId) => {
  try {
    const { rows:postIds } = await client.query(`
      SELECT id 
      FROM posts
      WHERE "authorId"= ${userId};
    `);

    const posts = await Promise.all(postIds.map(
      post => getPostById( post.id)
    ))

    // console.log('posts by user', posts);
    return posts;
  } catch (error) {
    throw error;
  }
};

////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF
////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF
////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF ////////// TAG STUFF

////// CREATE TAGS ////////
////// CREATE TAGS ////////
////// CREATE TAGS ////////

const createTags = async (tagList) => {
  // console.log('tagList', tagList);
  ///// check
  if (tagList.length === 0) {
    return;
  }
  ////check
  const insertValues = tagList.map((_, index) => `$${index + 1}`).join("), (");
  // console.log("insert values", insertValues);
  const selectValues = tagList.map((_, index) => `$${index + 1}`).join(", ");
  // console.log("select values", selectValues);
  //// check

  // console.log("it works until this try");
  // console.log('tagList', tagList);
  try {
    await client.query(
      `
            INSERT INTO tags(name)
            VALUES (${insertValues})
            ON CONFLICT (name) DO NOTHING;`,
      tagList
    );

    // console.log("Is it still working");
    const { rows } = await client.query(
      `
            SELECT * FROM tags
            WHERE name
            IN (${selectValues});`,
      tagList
    );

    // console.log("Is it really still working");
    return rows;
  } catch (error) {
    throw error;
  }
};

////// CREATE POST TAGS //////
////// CREATE POST TAGS //////
////// CREATE POST TAGS //////

const createPostTag = async (postId, tagId) => {
  try {
    await client.query(
      `
      INSERT INTO post_tags("postId","tagId")
      VALUES ($1, $2)
      ON CONFLICT ("postId","tagId") DO NOTHING;
    `,
      [postId, tagId]
    );
  } catch (error) {
    // console.log("error in creating post tag");
    throw error;
  }
};

////// GET POST BY ID ///////
////// GET POST BY ID ///////
////// GET POST BY ID ///////

const getPostById = async (postId) => {

  // console.log('postId', postId);

  try {
    const {
      rows: [post],
    } = await client.query(
      `
      SELECT *
      FROM posts
      WHERE id=$1;
    `,
      [postId]
    );

    // console.log('these post', post);

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN post_tags ON tags.id=post_tags."tagId"
      WHERE post_tags."postId"=$1;
    `,
      [postId]
    );

    const {
      rows: [author],
    } = await client.query(
      `
      SELECT id, username, name, location
      FROM users
      WHERE id=$1;
    `,
      [post.authorId]
    );

    post.tags = tags;
    post.author = author;

    delete post.authorId;

    return post;
  } catch (error) {
    throw error;
  }


  console.log();
  console.log();
};

////// GET POST BY TagName ///////
////// GET POST BY TagName ///////
////// GET POST BY TagName ///////

const getPostsByTagName = async (tagName) => {
  try {
    const { rows: postIds } = await client.query(`
      SELECT posts.id
      FROM posts
      JOIN post_tags ON posts.id=post_tags."postId"
      JOIN tags ON tags.id=post_tags."tagId"
      WHERE tags.name=$1;
    `, [tagName]);

    return await Promise.all(postIds.map(
      post => getPostById(post.id)
    ));

  } catch (error) {
    throw error;
  }
}



////// ADD TAGS TO POST /////
////// ADD TAGS TO POST /////
////// ADD TAGS TO POST /////

const addTagsToPost = async (postId, tagList) => {
  try {
    const createPostTagPromises = tagList.map((tag) => {
      return createPostTag(postId, tag.id);
    });

    await Promise.all(createPostTagPromises);
    
    return await getPostById(postId);
  } catch (error) {
    throw error;
  }
};


//// GET ALL TAGS /////
//// GET ALL TAGS /////
//// GET ALL TAGS /////

const getAllTags = async () => {
  try {
    const {rows} = await client.query(
      `SELECT * FROM tags;
      `
      );

      return rows;
  } catch (error) {
    console.log('error selecting tags');
    throw error
  }
}

////////// EXPORTS //////// EXPORTS ///////// EXPORTS //////// EXPORTS //////////

module.exports = {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  addTagsToPost,
  updatePost,
  getAllPosts,
  createTags,
  getPostsByTagName,
  getPostsByUser,
  getAllTags
};
