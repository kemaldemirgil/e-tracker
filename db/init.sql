INSERT INTO department(department_name) VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role(title, salary, department_id) VALUES
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Web Developer", 70000, 2),
("Penetration Tester", 200000, 2),
("Accountant", 90000, 3),
("Account Manager", 110000, 3),
("Lawyer", 180000, 4),
("Legal Team Lead", 220000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
("Elliot", "Alderson", 6, 1),
("Aia", "Snow", 1, 2),
("Kyle", "Zickerman", 2, 3),
("Merium", "Antt", 3, 4),
("Gon", "Freecss", 4, 1),
("Killua", "Zoldyck", 5, NULL),
("Biscuit", "Kites", 7, 1),
("Hans", "Top", 8, 1),
("Sion", "Wheelbarrel", 9, 1),
("Kindred", "Wolfie", 10, 1);