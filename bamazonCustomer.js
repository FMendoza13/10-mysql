
var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
  
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bamazon'
});
 
connection.connect((err) => {
    if (err) throw err;
    console.log('Connection successful');

 });