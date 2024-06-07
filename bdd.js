// bdd.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.1.1',
    user: 'root',
    password: '',
    database: 'UsuarioValentineStore'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;
