
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

 USE bamazon;

 CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name TEXT NOT NULL,
    department_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
('Snake Oil', 'Health-Medicine', 23.99, 23),
('Moonshine', 'Spirits', 14.00, 56),
('Samurai Sword', 'Cutlery', 99.99, 200),
('Double-Action Revolver - Gold', 'Guns & Ammo', 269.95, 48),
('Bandolier', 'Armor & Accessories', 19.49, 143),
('Derby Hat', 'Bamazon Fashion', 21.99, 78),
('Long Johns - White', 'Amazon Fashion', 9.99, 56),
('Bowie Knife', 'Cutlery', 35.99, 30),
('Leather Saddle - Chestnut Brown', 'Sports & Outdoors', 62.99, 77),
('Double Barrel Sawed-Off Shotgun', 'Guns & Ammo', 109.99, 60);