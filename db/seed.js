const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  createTags,
  getPostsByUser,
} = require("./index");
//the built-in require function is the easiest way to include modules that exist in separate files.
//require reads a JavaScript file, execute what's in that file, and then proceeds to return the exports object
// which in this case are the client object, and the getAllUsers function

///// DROP TABLES ///// DROP TABLES ///// DROP TABLES ///// DROP TABLES ///// DROP TABLES
///// DROP TABLES ///// DROP TABLES ///// DROP TABLES ///// DROP TABLES ///// DROP TABLES
const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("Error dropping tables!");
    throw error;
  }
};

///// CREATE TABLES ///// CREATE TABLES  ///// CREATE TABLES ///// CREATE TABLES ///// CREATE TABLES
///// CREATE TABLES ///// CREATE TABLES  ///// CREATE TABLES ///// CREATE TABLES ///// CREATE TABLES

const createTables = async () => {
  try {
    console.log("Starting to create tables");

    await client.query(`
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
    );
    
        CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );

            CREATE TABLE tags(
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) UNIQUE NOT NULL
            );

              CREATE TABLE post_tags(
                "postId" INTEGER REFERENCES posts(id),
                "tagId" INTEGER REFERENCES tags(id),
                UNIQUE("postId","tagId")
              );
        `);

    console.log("Finsihed creating tables!");
  } catch (error) {
    console.log("Error creating tables!");
    throw error;
  }
};

///// CREATE INITIAL USERS ///// CREATE INITIAL USERS ///// CREATE INITIAL USERS ///// CREATE INITIAL USERS
///// CREATE INITIAL USERS ///// CREATE INITIAL USERS ///// CREATE INITIAL USERS ///// CREATE INITIAL USERS

const createInitialUsers = async () => {
  try {
    console.log("Starting to create initial users");

    await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Sandra Bullock",
      location: "Humble, Texas",
    });
    await createUser({
      username: "albert",
      password: "bertie99",
      name: "Alberto Vega",
      location: "Austin, Texas",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Lauren Smith",
      location: "Dallas, Texas",
    });

    console.log("Finished creating initial users");
  } catch (error) {
    console.error("Error creating intitial users");
    throw error;
  }
};

///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS
///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS ///// CREATE INITIAL POSTS

const createInitialPosts = async () => {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("creating initial posts");
    await createPost({
      authorId: sandra.id,
      title: "My first post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love reading them.",
    });

    await createPost({
      authorId: albert.id,
      title: "Dog house",
      content: "I didn't know the dog house would be so miserbale.",
    });

    await createPost({
      authorId: glamgal.id,
      title: "GlamVlog Episode 30",
      content:
        "Hey glamies!! During epsiode thirty you were finally learn my dirtiest glam secret.",
    });
    console.log("finished creating posts");
  } catch (error) {
    console.error("error creating intial posts", error);
    throw error;
  }
};

/////// CREATE INITIAL TAGS ////////  CREATE INITIAL TAGS //////// CREATE INITIAL TAGS //////// CREATE INITIAL TAGS //////// 

const createInitialTags = async() =>{
try {
console.log('Starting to create tags');
////check
const [happy, sad, inspo, catman] = await createTags([
  '#happy', 
  '#worst-day-ever', 
  '#youcandoanything',
  '#catmandoeverything'
]);
//// check



const [postOne, postTwo, postThree] = await getAllPosts();

    await addTagsToPost(postOne.id, [happy, inspo]);
    await addTagsToPost(postTwo.id, [sad, inspo]);
    await addTagsToPost(postThree.id, [happy, catman, inspo]);
console.log('creating posts with tags');

  console.log('Finished creating tags');
} catch (error) {
  console.log('Error creating tags');
  throw error
}
}



///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB
///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB ///// REBUILD DB

const rebuildDb = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialTags();
  } catch (error) {
    throw error;
  }
};

///// TEST DB ///// TEST DB ///// TEST DB  ///// TEST DB  ///// TEST DB  ///// TEST DB  ///// TEST DB
///// TEST DB ///// TEST DB ///// TEST DB  ///// TEST DB  ///// TEST DB  ///// TEST DB  ///// TEST DB

const testDB = async () => {
  try {
    //// START
    console.log("Starting to test database...");

    ////// get all users
    console.log("calling getAllUsers");
    const users = await getAllUsers();
    console.log("results from calling getAllUsers()", users);

    ///// update user
    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[1].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });

    console.log("updateUserResult", updateUserResult);

    ///// get all post
    console.log("calling getAllPosts");
    const posts = await getAllPosts();
    console.log("getAllPosts result:", posts);

    ///// update posts
    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    ///// getUserById
    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    /////createTags
    // await createTags(['#hey', "#yeah", "#another"])
    ///FINSIH
    console.log("Finished database tests!");
  } catch (error) {
    console.log(error, "error testing database!");
  }
};

rebuildDb()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
