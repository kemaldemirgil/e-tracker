DROP DATABASE IF EXISTS eTrackerDB;

CREATE DATABASE eTrackerDB;

USE eTrackerDB;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30),
  PRIMARY KEY (department_id)
);

CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (role_id),
  FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY (employee_id),
  FOREIGN KEY (role_id) REFERENCES role(role_id)
);


-- DROP DATABASE IF EXISTS eTrackerDB;

-- CREATE DATABASE eTrackerDB;

-- USE eTrackerDB;


--   CREATE TABLE department (
--   id INT NOT NULL AUTO_INCREMENT,
--   name VARCHAR(30),
--   PRIMARY KEY (id)
--   );
  
--     CREATE TABLE role (
--   id INT NOT NULL AUTO_INCREMENT,
--   title VARCHAR(30),
--   salary DECIMAL,
--   department_id INT,
--   PRIMARY KEY (id)
--   );

-- CREATE TABLE employee (
--   id INT NOT NULL AUTO_INCREMENT,
--   first_name VARCHAR(30),
--   last_name VARCHAR(30),
--   role_id INT,
--   manager_id INT NULL,
--   PRIMARY KEY (id)
--   );
  
  
-- INSERT INTO employee (first_name, last_name)
-- VALUES ("gam3", "fac3");
-- INSERT INTO employee (first_name, last_name)
-- VALUES ("p0k3r", "j03");
-- INSERT INTO employee (first_name, last_name)
-- VALUES ("d0lphin", "s34");