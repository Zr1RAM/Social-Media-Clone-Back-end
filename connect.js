const { Client } = require('pg');


//set the connection parameters 
const connectionString = 'postgresql://postgres:admin@localhost:5432/SocialMediaClone';

// Create a new Client
const db = new Client({
    connectionString: connectionString,
});

//Connect to the database
db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connection to the database', err))


module.exports = db;
