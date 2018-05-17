DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price INT default 0,
  stock INT default 10,
  PRIMARY KEY (item_id)
);
INSERT INTO products (item_id, product_name, department, price, stock)
VALUES ("Nissan GTR", "automobiles", 119000, 2);

INSERT INTO products (item_id, product_name, department, price, stock)
VALUES ("Porsche 911 GT3", "automobiles", 199000, 1);

INSERT INTO products (item_id, product_name, department, price, stock)
VALUES ("Porsche Cayman GT4", "automobiles", 89000, 4);

INSERT INTO products (item_id, product_name, department, price, stock)
VALUES ("Audi R10", "automobiles", 129000, 3);

INSERT INTO products (item_id, product_name, department, price, stock)
VALUES ("Toyota Supra", "automobiles", 67000, 8);

INSERT INTO products (product_name, department, price, stock)
VALUES ("Ferrari 488 Pista", "automobiles", 256000, 2);

INSERT INTO products (product_name, department, price, stock)
VALUES ("Subaru WRX STI", "automobiles", 37000, 22);

INSERT INTO products (id, product_name, department, price, stock)
VALUES ("Ford Shelby GT350", "automobiles", 67000, 3);

INSERT INTO products (id, product_name, department, price, stock)
VALUES ("Chevrolet Corvette Z01", "automobiles", 126000, 6);

INSERT INTO products (id, product_name, department, price, stock)
VALUES ("Mercedes E63 AMG", "automobiles", 107000, 2);

INSERT INTO products (product_name, department, price, stock)
VALUES ("Ford Raptor", "automobiles", 57000, 10);