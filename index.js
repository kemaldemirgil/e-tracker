const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '2930788',
    database: 'etrackerdb',
});

const start = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "menu",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "View all employees by manager",
                "View the total utilized budget of a department",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee role",
                "Update employee manager",
                "Delete employee",
                "Delete department",
                "Delete role",
                "End"
            ]
        }
    ])
    .then((response) => {
        switch (response.menu) {
        ////////
        case "View all employees" :
            viewE();
            break;
        case "View all departments" :
            viewD();
            break;
        case "View all roles" :
            viewR();
            break;        
        case "View all employees by manager" :
            viewEM();
            break;
        case "View the total utilized budget of a department" :
            viewTB();
            break;
        ////////                
        case "Add employee" :
            addE();
            break;
        case "Add department" :
            addD();
            break;    
        case "Add role" :
            addR();
            break;
        //////// 
        case "Update employee role" :
            updateER();
            break;                
        case "Update employee manager" :
            updateEM();
            break;                
        case "Delete employee" :
            deleteE();
            break;
        case "Delete department" :
            deleteD();
            break;
        case "Delete role" :
            deleteR();
            break;
        default :
            console.log("Thanks for using E-Tracker!");
            connection.end();
            // end
        }     
    })
}

const viewE = () => {
    const employeeArray = [];
    connection.query(
        `SELECT 
        a.employee_id,
        a.first_name,
        a.last_name,
        role.title,
        department.department_name,
        role.salary,
        concat(b.first_name, ' ',b.last_name) as 'Manager_Name' 
        FROM employee a 
        LEFT OUTER JOIN employee b ON a.manager_id = b.employee_id 
        INNER JOIN role ON (role.role_id = a.role_id) 
        INNER JOIN department ON (department.department_id = role.department_id) 
        ORDER BY a.employee_id;
        `, (err, res) => {
        if (err) throw err;
        res.forEach(({ employee_id, first_name, last_name, title, department_name, salary, Manager_Name }) => {
            employeeArray.push([employee_id, first_name, last_name, title, department_name, salary, Manager_Name]);
        });
        console.table(["ID", "First Name", "Last Name", "Title", "Department", "Salary", "Manager"], employeeArray);
        start();
    });
}

// Viewing All Departments
const viewD = () => {
    connection.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// Viewing All Roles
const viewR = () => {
    connection.query("SELECT title FROM role;", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// Viewing Employees by Manager
const viewEM = () => {
    connection.query(
        `SELECT 
        a.first_name,
        a.last_name,
        concat(b.first_name, ' ',b.last_name) as 'Manager_Name' 
        FROM employee a 
        LEFT OUTER JOIN employee b ON a.manager_id = b.employee_id 
        ORDER BY Manager_Name;
        `, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// View the total utilized budget of a department
const viewTB = () => {
    connection.query(
    `SELECT role.department_id AS id, 
    department.department_name AS department,
    SUM(salary) AS budget
    FROM  role  
    INNER JOIN department ON role.department_id = department.department_id 
    GROUP BY  role.department_id`, 
    (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// Add employee
const addE = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?",
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
                    message: "What is the employee's role?",
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
                            message: "Who is the manager of this employee?",
                            choices: managers
                        }
                    ]).then(element => {
                        const manager = element.manager;
                        newEmployeeData.push(manager);
                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`, newEmployeeData, (err) => {
                                if (err) throw err;
                                console.log("Employee has been added.");
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
            message: "Please enter a new Department...",
            // validate:
        }
    ]).then((answer) => {
        connection.query("INSERT INTO department (department_name) VALUES (?)", answer.newDepartment, (err, res) => {
            if (err) throw err;
            console.log("Department added...")
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
                message: "Which department does this role belong to?",
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
                    message: "What is the name of the role?",
                //  validate:
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "What is the salary of the role?",
                //  validate:
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
                    console.log("Role has been added.");
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
                    message: "Please select the employee with the new role...",
                    choices: employeeNames
                },
                {
                    name: "selectedRole",
                    type: "list",
                    message: "What is their new role?",
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
                    console.log("Employee updated...");
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
                message: "Which employee has a new manager?",
                choices: employeeNames
            },
            {
                name: "selectedManager",
                type: "list",
                message: "Who is the employee's new manager?",
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
                console.log("INVALID MANAGER SELECTION");
                start();
            } else {
                connection.query(`UPDATE employee SET employee.manager_id = ? WHERE employee.employee_id = ?`, [managerId, employeeId], (err) => {
                    if (err) throw err;
                    console.log("Employee manager updated...");
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
            message: "Please enter the first name of the employee you would like to remove...",
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
                console.log("Employee removed...");
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
                message: "Which department would you like to delete?",
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
                console.log("Department deleted.");
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
                message: "Which role would you like to delete?",
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
                console.log("Role deleted.");
                viewR();
            })
        })
    })
}



connection.connect((err) => {
    if (err) throw err;
    // console.log(`connected as id ${connection.threadId}\n`);
    start();
});
  