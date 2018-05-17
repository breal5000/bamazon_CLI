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

  console.log("bamazon mamager is running");
  
});

function promptManagerAction() {

	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {

		if (input.option ==='sale') {
			displayInventory();
		} else if (input.option === 'lowInventory') {
			displayLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			createNewProduct();
		} else {
			
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}


function displayInventory() {
	
	queryStr = 'SELECT * FROM products';

	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department + '  //  ';
			strOut += 'Price: $' + data[i].price + '  //  ';
			strOut += 'Quantity: ' + data[i].stock + '\n';

			console.log(strOut);
		}

	  	console.log("-----------------------\n");

		connection.end();
	})
}

function displayLowInventory() {
	
	queryStr = 'SELECT * FROM products WHERE stock < 100';

	
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Low Inventory Items (below 100): ');
		console.log('...........................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department + '  //  ';
			strOut += 'Price: $' + data[i].price + '  //  ';
			strOut += 'Quantity: ' + data[i].stock + '\n';

			console.log(strOut);
		}

	  	console.log("-------------------------\n");

		connection.end();
	})
}


function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a number.';
	}
}

function validateNumeric(value) {
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a number for the unit price.'
	}
}


function addInventory() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Please enter the Item ID for stock_count update.',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {

		var item = input.id;
		var addQuantity = input.quantity;

		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();

			} else {
				var productData = data[0];

				console.log('Updating Inventory...');

				
				var updateQueryStr = 'UPDATE products SET stock = ' + (productData.stock + addQuantity) + ' WHERE id = ' + item;

				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock + addQuantity) + '.');
					console.log("\n-------------------------\n");

				
					connection.end();
				})
			}
		})
	})
}

function createNewProduct() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'product',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock',
			message: 'How many items are in stock?',
			validate: validateInteger
		}
	]).then(function(input) {
	

		console.log('Adding New Item: \n    product = ' + input.product + '\n' +  
									   '    department = ' + input.department + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock = ' + input.stock);

		
		var queryStr = 'INSERT INTO products SET ?';

		
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n-------------------------------------------\n");

			
			connection.end();
		});
	})
}


function runBamazon() {
	
	promptManagerAction();
}

runBamazon();