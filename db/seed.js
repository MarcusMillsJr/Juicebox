const {client, getAllUsers, createUser} = require('./index')
//the built-in require function is the easiest way to include modules that exist in separate files.
//require reads a JavaScript file, execute what's in that file, and then proceeds to return the exports object
            // which in this case are the client object, and the getAllUsers function 


            // !!!!!! THIS IS WHERE YOU LEFT OFF 12:45am 11-9-2022 !!!!!!!
const dropTables = async () => {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE users
        `)

        console.log("Finished dropping tables!");
    } catch (error) {
        console.log('Error dropping tables!');
        throw error;
    }
}

const createTables = async() => {
    try {
        console.log('Starting to create tables');

        await client.query(
            `
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
            `);
            console.log('Finsihed creating tables!');
    } catch (error) {
        console.log('Error creating tables!');
        throw error;
    }
}

const createInitialUsers = async() => {
    try {
        console.log("Starting to create initial users");
         
        const sandra = await createUser({username: 'sandra', password: 'glamgal'})

        console.log('Finished creating user');
        return sandra
    } catch (error) {
        console.error('Error creating intitial users');
        throw error
    }
}

const rebuildDb = async() => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        throw error;
    }
}


const testDB = async () => {
    try {
        console.log("Starting to test database...");
   
        const users = await getAllUsers();
        console.log('getAllUsers()', users );
      
        console.log('Finished database tests!');
    } catch (error) {
        console.log(error, 'error testing database!')
    }
}



rebuildDb()
    .then(testDB)
    .catch(console.error)
    .finally(()=> client.end())