// const { Client } = require('pg');


//set the connection parameters 
// const connectionString = 'postgresql://postgres:admin@localhost:5432/SocialMediaClone';

// Create a new Client
// const db = new Client({
//     connectionString: connectionString,
// });

//Connect to the database
// db.connect()
//     .then(() => console.log('Connected to the database'))
//     .catch(err => console.error('Error connection to the database', err))
//.finally(() => client.end());
//testing pg query basic funtionality
/*
const usernameToCheck = 'zr1ram';
const q = 'SELECT * FROM social.users1 WHERE username = $1';
db.query(q, [usernameToCheck]).then(result => {
    console.log('success');
    console.log(result);
}).catch(err => {
    console.log('i will send you to jesus');
    console.log(err)
});
*/

//module.exports = db;
// If this were done using mysql
/*
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Lamadev123",
    database: "social"
});

module.export = db;
*/