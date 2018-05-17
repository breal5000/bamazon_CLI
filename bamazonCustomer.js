var mysql = require("mysql");
var inquirer = require("inquirer");
//var Table = require('cli-table');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",


  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("bamazon is running");
  
});

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a number.';
	}
}


function promptUserPurchase() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Please enter the ID of the item you want to buy',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {
		

		var item = input.id;
		var quantity = input.quantity;
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {id: item}, function(err, data) {
			if (err) throw err;

			;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productData = data[0];

				
				if (quantity <= productData.stock) {
					console.log('The product you requested is in stock.');

					// updating query string
					var updateQueryStr = 'UPDATE products SET stock = ' + (productData.stock - quantity) + ' WHERE id = ' + item;
					

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');

						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock,');
					console.log('Please change your order.');

					displayInventory();
				}
			}
		})
	})
}


function displayInventory() {
	
	queryStr = 'SELECT * FROM products';

	// db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('-\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("-\n");

	  	promptUserPurchase();
	})
}

function runBamazon() {

	displayInventory();
}

runBamazon();