
var mysql = require('mysql');
var inquirer = require('inquirer');
var chalk = require('chalk');


var connection = mysql.createConnection({
  
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});
 
connection.connect((err) => {
    if (err) throw err;
    console.log('Connection successful');

    displayItems() 
});

// Global Variables

var itemsList = [];
var chosenItem = [];

// Functions

var resetCart = function() {
    chosenItem = [];
}
 var displayItems = function() {
    connection.query(`SELECT * FROM products`, (err, res) => {
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            itemsList.push(res[i]);
            console.log(chalk.blue.bold(`\n\tItem ID: ${res[i].item_id}\n\tProduct Name: ${res[i].product_name}\n\tPrice: $${res[i].price}\n\n--------------------------------`));
        }
        aksForID();
    });
};

var aksForID = function() {
    inquirer.prompt({
        name: 'itemID',
        type: 'input',
        message:'Enter the ID of the item you would like to purchase:',
        validate: (value) => {
            if (!isNaN(value) && (value > 0 && value <= 10)) {
                return true;
            } else {
                console.log(chalk.red(' => Please enter a number from 1-10'));
                return false;
            }
        }
    }).then ((answer) => {
        connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?', { item_id: answer.itemID }, (err, res) => {

            confirmItem(res[0].product_name, res);
        });
    });
    };

    var confirmItem = function(product, object) {
            inquirer.prompt ({
                name: 'confirmItem',
                type: 'confirm', 
                message: `you chose` + chalk.blue.bold (` '${product}'. `) + `Is this correct?`
            }).then ((answer) => {
            if (answer.confirmItem) {
                chosenItem.push(object);
                askHowMany(chosenItem[0][0].item_id);
            }
            else {
                askForID();
            
            }
        });
    };


    var askHowMany = function(chosenID) {
        inquirer.prompt({
            name: 'howMany',
            type: 'input',
            message: 'How many would you like to purchase?',
            validate: (value) => {
                if (!isNaN(value) && value > 0) {
                    return true;
                } else {
                    console.log(chalk.red(' => Oops, please enter a number greater than 0'));
                    return false;
                }
            }
        }).then((answer) => {
            connection.query('SELECT stock_quantity FROM products WHERE ?', { item_id: chosenItem[0][0].item_id }, (err, res) => {
                // if there are not enough products in stock
                if (res[0].stock_quantity < answer.howMany) {
                    console.log(chalk.blue.bold('Sorry, insufficient quantity in stock!'));
                    // confirm if user would still like to buy this product
                    inquirer.prompt({
                        name: 'proceed',
                        type: 'confirm',
                        message: 'Would you still like to purchase this product?'
                    }).then((answer) => {
                        if (answer.proceed) {
                            askHowMany(chosenItem[0][0].item_id);
                        } else {
                            console.log(chalk.blue.bold('Thanks for visiting! We hope to see you again soon.'));
                            connection.end();
                        }
                    });
                // if there are enough products in stock for purchase to go through
                } else {
                    chosenItem.push(answer.howMany);
                    console.log(chalk.blue.bold('Order processing...'));
                    // console.log(chosenItem);
    
                    // update database to reflect new stock quantity after sale
                    connection.query('UPDATE products SET ? WHERE ?', [
                        {
                            stock_quantity: chosenItem[0][0].stock_quantity - answer.howMany
                        },
                        {
                            item_id: chosenItem[0][0].item_id
                        }
                    ], (err, res) => {
                        console.log(chalk.blue.bold(`Order confirmed!!! Your total was $${(chosenItem[0][0].price * chosenItem[1]).toFixed(2)}.`));
                        // ask if user would like to make another purchase
                        promptNewPurchase();
                    });
                }
            });
        });
    }
    
    // function to ask if user would like to make another purchase
    var promptNewPurchase = function() {
        inquirer.prompt({
            name: 'newPurchase',
            type: 'confirm',
            message: 'Would you like to make another purchase?'
        }).then((answer) => {
            if (answer.newPurchase) {
                resetCart();
                askForID();
            } else {
                console.log(chalk.blue.bold('We appreciate your business. Have a great day!'));
                connection.end();
            }
        });
    };