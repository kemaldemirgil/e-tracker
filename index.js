// Init
const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require('figlet');
const colors = require('colors');
const emoji = require("node-emoji");
const {printTable} = require("console-table-printer");

// Connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '2930788',
    database: 'etrackerdb',
});
// Questions
const start = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?\n".green,
            name: "menu",
            choices: [
                "View all employees".yellow,
                "View all departments".yellow,
                "View all roles".yellow,
                "View all employees by manager".yellow,
                "View the total utilized budget of a department".yellow,
                "Add employee".cyan,
                "Add department".cyan,
                "Add role".cyan,
                "Update employee role".magenta,
                "Update employee manager".magenta,
                "Delete employee".red,
                "Delete department".red,
                "Delete role".red,
                "End".brightRed
            ]
        }
    ])
    // CRUD
    .then((response) => {
        switch (response.menu) {
        // View
        case "View all employees".yellow :
            viewE();
            break;
        case "View all departments".yellow :
            viewD();
            break;
        case "View all roles".yellow :
            viewR();
            break;        
        case "View all employees by manager".yellow :
            viewEM();
            break;
        case "View the total utilized budget of a department".yellow :
            viewTB();
            break;
        // Add
        case "Add employee".cyan :
            addE();
            break;
        case "Add department".cyan :
            addD();
            break;    
        case "Add role".cyan :
            addR();
            break;
        // Update
        case "Update employee role".magenta :
            updateER();
            break;                
        case "Update employee manager".magenta :
            updateEM();
            break;
        // Delete 
        case "Delete employee".red :
            deleteE();
            break;
        case "Delete department".red :
            deleteD();
            break;
        case "Delete role".red :
            deleteR();
            break;
        default :
            // Stop application...
            console.log("<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->".rainbow);
            console.log("                                                                                   ");
            console.log(figlet.textSync(" THANKS   FOR   USING ").brightGreen);
            console.log(figlet.textSync("       E - T R A C K E R        ").brightMagenta);
            console.log("                                                                                   " + "Created By: Kemal Demirgil".brightGreen)
            console.log("<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->\n\n".rainbow);
            connection.end();
        }     
    })
}
// Viewing All Employees
const viewE = () => {
    connection.query(
        `SELECT 
        a.employee_id AS Employee,
        a.first_name AS First,
        a.last_name AS Last,
        role.title AS Title,
        department.department_name AS Department,
        role.salary AS Salary,
        concat(b.first_name, ' ',b.last_name) as Manager
        FROM employee a 
        LEFT OUTER JOIN employee b ON a.manager_id = b.employee_id 
        INNER JOIN role ON (role.role_id = a.role_id) 
        INNER JOIN department ON (department.department_id = role.department_id) 
        ORDER BY a.employee_id;
        `, (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    });
}

// Viewing All Departments
const viewD = () => {
    connection.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    })
}

// Viewing All Roles
const viewR = () => {
    connection.query("SELECT title FROM role;", (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    })
}

// Viewing Employees by Manager
const viewEM = () => {
    connection.query(
        `SELECT 
        a.first_name AS First,
        a.last_name AS Last,
        concat(b.first_name, ' ',b.last_name) as Manager
        FROM employee a 
        LEFT OUTER JOIN employee b ON a.manager_id = b.employee_id 
        ORDER BY Manager;
        `, (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    })
}

// View the total utilized budget of a department
const viewTB = () => {
    connection.query(
    `SELECT role.department_id AS ID, 
    department.department_name AS Department,
    SUM(salary) AS Budget
    FROM  role  
    INNER JOIN department ON role.department_id = department.department_id 
    GROUP BY  role.department_id`, 
    (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    })
}

// Add employee
const addE = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's first name?".green,
            validate: (value) => {if (value){return true} else 
            {return console.log("Please enter a valid first name".red.dim)}}
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?".green,
            validate: (value) => {if (value){return true} else 
            {return console.log("Please enter a valid last name".red.dim)}}
        },
    ]).then(answer => {
        const newEmployeeData = [answer.firstName, answer.lastName]
        connection.query(`SELECT role.role_id, role.title FROM role`, (err, res) => {
            if (err) throw err;
            const roles = res.map(({ role_id, title}) => ({ name: title, value: role_id}));
            inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: "What is the employee's role?".green,
                    choices: roles
                }
            ]).then(element => {
                const role = element.role;
                newEmployeeData.push(role);
                connection.query(`SELECT * FROM employee`, (err, res) => {
                    if (err) throw err;
                    const managers = res.map(({ employee_id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: employee_id}));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the manager of this employee?".green,
                            choices: managers
                        }
                    ]).then(element => {
                        const manager = element.manager;
                        newEmployeeData.push(manager);
                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`, newEmployeeData, (err) => {
                                if (err) throw err;
                                console.log("Employee has been added...".brightGreen);
                                viewE();
                            }
                        )
                    })
                })
            })
        })
    })
}

// Add Department
const addD = () => {
    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "Please enter a new Department...".green,
            validate: (value) => {if (value){return true} else 
            {return console.log("Please enter a valid department name".red.dim)}}
        }
    ]).then((answer) => {
        connection.query("INSERT INTO department (department_name) VALUES (?)", answer.newDepartment, (err, res) => {
            if (err) throw err;
            console.log("Department added...".brightGreen)
            viewD();
        })
    })

}

// Add Role
const addR = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        let dNames = [];
        res.forEach((element) => {dNames.push(element.department_name);});
        dNames.push("Create a new Department");
        inquirer.prompt([
            {
                name: "departmentName",
                type: "list",
                message: "Which department does this role belong to?".green,
                choices: dNames
            }
        ]).then((answer) => {
            if(answer.departmentName === "Create a new Department") {
                addD();
            } else {
                resume(answer);
            }
        });
        const resume = (data) => {
            inquirer.prompt([
                {
                    name: "roleName",
                    type: "input",
                    message: "What is the name of the role?".green,
                    validate: (value) => {if (value){return true} else 
                    {return console.log("Please enter a valid role".red.dim)}}
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "What is the salary of the role?".green,
                    validate: (value) => {if (value){return true} else 
                    {return console.log("Please enter a valid salary".red.dim)}}
                }
            ]).then((answer) => {
                let departmentId;
                res.forEach((element) => {
                    if (data.departmentName === element.department_name) {
                        departmentId = element.department_id
                    };
                });
                connection.query(
                    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                    [answer.roleName, answer.roleSalary, departmentId], (err) => {
                    if (err) throw err;
                    console.log("Role has been added...".brightGreen);
                    viewR();
                });  
            });
        };
    });
};

// Update Employee Role
const updateER = () => {
    connection.query(
        `SELECT 
        employee.employee_id, 
        employee.first_name, 
        employee.last_name, 
        role.role_id
        FROM employee, role, department 
        WHERE department.department_id = role.department_id AND role.role_id = employee.role_id`,
    (err, response) => {
        if (err) throw err;
        let employeeNames = [];
        response.forEach((element) => {employeeNames.push(`${element.first_name} ${element.last_name}`);});
        connection.query(`SELECT role.role_id, role.title FROM role`, (err, res) => {
            if (err) throw err;
            let roles = [];
            res.forEach((element) => {roles.push(element.title);});
            inquirer.prompt([
                {
                    name: "selectedEmployee",
                    type: "list",
                    message: "Please select the employee with the new role...".green,
                    choices: employeeNames
                },
                {
                    name: "selectedRole",
                    type: "list",
                    message: "What is their new role?".green,
                    choices: roles
                }
            ]).then((answer) => {
                let newTitleId;
                let employeeId;
                res.forEach((element) => {
                    if (answer.selectedRole === element.title) {
                        newTitleId = element.role_id;
                    }
                });
                response.forEach((element) => {
                    if (answer.selectedEmployee === `${element.first_name} ${element.last_name}`) {
                        employeeId = element.employee_id;
                    }
                });
                connection.query(`UPDATE employee SET employee.role_id = ? WHERE employee.employee_id = ?`, [newTitleId, employeeId], (err) => {
                    if (err) throw err;
                    console.log("Employee updated...".brightGreen);
                    start()
                });
            });
        });
    });
};

// Update Employee Manager
const updateEM = () => {
    connection.query(
        `SELECT
        employee.employee_id,
        employee.first_name,
        employee.last_name,
        employee.manager_id
        FROM employee`
    , (err, res) => {
        if (err) throw err;
        let employeeNames = [];
        res.forEach((element) => {employeeNames.push(`${element.first_name} ${element.last_name}`);});
        inquirer.prompt([
            {
                name: "selectedEmployee",
                type: "list",
                message: "Which employee has a new manager?".green,
                choices: employeeNames
            },
            {
                name: "selectedManager",
                type: "list",
                message: "Who is the employee's new manager?".green,
                choices: employeeNames
            }
        ]).then((answer) => {
            let employeeId;
            let managerId;
            res.forEach((element) => {
                if (answer.selectedEmployee === `${element.first_name} ${element.last_name}`) {
                    employeeId = element.employee_id;
                }
                if (answer.selectedManager === `${element.first_name} ${element.last_name}`) {
                    managerId = element.employee_id;
                }
            });
            if (answer.selectedEmployee === answer.selectedManager) {
                console.log("INVALID MANAGER SELECTION".brightRed);
                start();
            } else {
                connection.query(`UPDATE employee SET employee.manager_id = ? WHERE employee.employee_id = ?`, [managerId, employeeId], (err) => {
                    if (err) throw err;
                    console.log("Employee manager updated...".brightGreen);
                    start();
                })
            }
        })
    })
}

// Delete Employee
const deleteE = () => {
    connection.query("SELECT * FROM employee;", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
        {
            name: "removeQuestion",
            type: "rawlist",
            message: "Please enter the first name of the employee you would like to remove...".green,
            choices: () => {
                let deleteArray = [];
                for (var i = 0; i < res.length; i++) {
                    deleteArray.push(res[i].first_name);
                }
                return deleteArray;
            }
        },
        ])
        .then((answer) => {
            connection.query("DELETE FROM employee WHERE first_name = ?", [answer.removeQuestion],
                (err) => {
                if (err) throw err;
                console.log("Employee removed...".brightGreen);
                start();
                }
            );
        });
    });
}

// Delete Department
const deleteD = () => {
    connection.query(`SELECT department.department_id, department.department_name FROM department`, (err, res) => {
        if (err) throw err;
        let departmentNames = [];
        res.forEach((element) => {departmentNames.push(element.department_name);});
        inquirer.prompt([
            {
                name: "selectedDepartment",
                type: "list",
                message: "Which department would you like to delete?".green,
                choices: departmentNames
            }
        ]).then((answer) => {
            let departmentId;
            res.forEach((element) => {
                if (answer.selectedDepartment === element.department_name) {
                    departmentId = element.department_id;
                }
            });
            connection.query(`DELETE FROM department WHERE department.department_id = ?`, [departmentId], (err) => {
                if (err) throw err;
                console.log("Department deleted...".brightGreen);
                viewD();
            })
        })
    })
}

// Delete Role
const deleteR = () => {
    connection.query(`SELECT role.role_id, role.title FROM role`, (err, res) => {
        if (err) throw err;
        let roleNames = [];
        res.forEach((element) => {roleNames.push(element.title);});
        inquirer.prompt([
            {
                name: "selectedRole",
                type: "list",
                message: "Which role would you like to delete?".green,
                choices: roleNames
            }
        ]).then((answer) => {
            let roleId;
            res.forEach((element) => {
                if (answer.selectedRole === element.title) {
                    roleId = element.role_id;
                }
            });
            connection.query(`DELETE FROM role WHERE role.role_id = ?`, [roleId], (err) => {
                if (err) throw err;
                console.log("Role deleted...".brightGreen);
                viewR();
            })
        })
    })
}

// Connection Listener
connection.connect((err) => {
    if (err) throw err;
    // console.log(`connected as id ${connection.threadId}\n`);
    console.log("<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->".rainbow);
    console.log("                                                                                   ");
    console.log(figlet.textSync(" E - T R A C K E R ", {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 200,
        whitespaceBreak: true
    }).gray);
    console.log("Made with", emoji.get('heart') , " &", emoji.get('peace_symbol') , "                                                             ".brightWhite + "Created By: Kemal Demirgil".brightGreen)
    console.log("<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->\n\n".rainbow);
    start();
});