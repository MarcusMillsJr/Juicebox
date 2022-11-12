const { client, getAllUsers, createUser, updateUser } = require("./index");
//the built-in require function is the easiest way to include modules that exist in separate files.
//require reads a JavaScript file, execute what's in that file, and then proceeds to return the exports object
// which in this case are the client object, and the getAllUsers function

// !!!!!! THIS IS WHERE YOU LEFT OFF 12:45am 11-9-2022 !!!!!!!
const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("Error dropping tables!");
    throw error;
  }
};

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
    `);

    await client.query(`
        CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);


    console.log("Finsihed creating tables!");
  } catch (error) {
    console.log("Error creating tables!");
    throw error;
  }
};

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

    console.log("Finished creating user");
  } catch (error) {
    console.error("Error creating intitial users");
    throw error;
  }
};

const testDB = async () => {
  try {
    console.log("Starting to test database...");

    console.log("calling getAllUsers");
    const users = await getAllUsers();
    console.log("results from calling getAllUsers()", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[1].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });

    console.log("updateUserResult", updateUserResult);

    console.log("Finished database tests!");
  } catch (error) {
    console.log(error, "error testing database!");
  }
};

const rebuildDb = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
};

rebuildDb()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
