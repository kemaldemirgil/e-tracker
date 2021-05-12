DROP DATABASE IF EXISTS eTrackerDB;

CREATE DATABASE eTrackerDB;

USE eTrackerDB;

CREATE TABLE department (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT
);

CREATE TABLE employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT
);


-- DROP DATABASE IF EXISTS eTrackerDB;

-- CREATE DATABASE eTrackerDB;

-- USE eTrackerDB;

-- CREATE TABLE department (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   department_name VARCHAR(30) NOT NULL,
-- );

-- CREATE TABLE role (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   title VARCHAR(30) NOT NULL,
--   salary DECIMAL NOT NULL,
--   department_id INT,
--   FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
-- );

-- CREATE TABLE employee (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   first_name VARCHAR(30) NOT NULL,
--   last_name VARCHAR(30) NOT NULL,
--   role_id INT,
--   manager_id INT,
--   FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
--   FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
-- );