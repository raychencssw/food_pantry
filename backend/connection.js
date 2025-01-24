const mysql = require('mysql2/promise');
require('dotenv').config();
//console.log(process.env)

let connection;

async function connectToDatabase(){
    try{
        connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
        });

        console.log('Connected to the MySQL database successfully.');
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    return connection;
}

//export the function without parantheses means only a reference to the function is exported; allowing the importing file to have a flexibility decide when to call the function and execute its logic
module.exports = connectToDatabase;