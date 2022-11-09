const {client, getAllUsers} = require('./index')
//the built-in require function is the easiest way to include modules that exist in separate files.
//require reads a JavaScript file, execute what's in that file, and then proceeds to return the exports object
            // which in this case are the client object, and the getAllUsers function 


            // !!!!!! THIS IS WHERE YOU LEFT OFF 12:45am 11-9-2022 !!!!!!!
const dropTables = async () => {
    try {
        await client.query(`
        DROP TABLE users
        `)
    } catch (error) {
        throw error;
    }
}


const testDB = async () => {
    try {
        client.connect();
        const result = await client.query(`SELECT * FROM users;`);
        const users = await getAllUsers();
        console.log('getAllUsers()', users );
        console.log( 'result', result);
    } catch (error) {
        console.log(error, 'error connecting client to database')
    } finally {
        client.end()
    }
}



testDB()