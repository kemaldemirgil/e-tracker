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

// Add an Employee
let managerArray = [];
let roleRes;
let newItem;
let firstN;
let lastN;
const addE = () => {
    connection.query(
    `SELECT role.title,
    role.role_id,
    department.department_name,
    department.department_id  
    FROM role 
    INNER JOIN department ON (department.department_id = role.department_id);
    `, (err, res) => {
        if (err) throw err;
        roleRes = res;
    });
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
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
        {
            name: 'role',
            type: 'rawlist',
            message: "What is the employee's role?",
            choices: function () {
                var roleArray = [];
                for (var i = 0; i < roleRes.length; i++) {
                    roleArray.push(roleRes[i].title);
                }
                return roleArray;
            }
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: "Who is the employee's manager?",
            choices() {
                res.forEach(({first_name, last_name}) => {
                    firstN = `${first_name}`;
                    lastN = `${last_name}`;
                    newItem = `${first_name} ${last_name}`;
                    managerArray.indexOf(newItem) === -1 ? managerArray.push(newItem) : 1 + 1;
                });
                return managerArray;
            },
        },
        ])
        .then((answer) => {
            let role_id;
            let manager_id = managerArray.indexOf(answer.manager);
            console.log("manager array = " + managerArray);
            console.log("manager id = " + manager_id);
            connection.query(`SELECT * FROM employee WHERE first_name = "${firstN}" AND last_name = "${lastN}";`, (err, res) => {
                if (err) throw err;
                console.log(answer.manager);
                }
            );
            for (var i = 0; i < roleRes.length; i++) {
                if (roleRes[i].title === answer.role) {
                    role_id = roleRes[i].role_id;
                }
            }
            connection.query(
            `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, 
            [
                answer.firstName,
                answer.lastName,
                role_id,
                manager_id
            ], (err) => {
                if (err) throw err;
                    console.log("Employee Added...");
                    console.table(answer);
                    start();
                }
            );
        });
    });
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
                let createdRole = answer.roleName;
                let departmentId;
                res.forEach((element) => {
                    if (data.departmentName === element.department_name) {
                        departmentId = element.id
                    };
                });
                connection.query(
                    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                    [createdRole, answer.salary, departmentId], (err) => {
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

}

// Update Employee Manager
const updateEM = () => {

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

}

// Delete Role
const deleteR = () => {

}






connection.connect((err) => {
    if (err) throw err;
    // console.log(`connected as id ${connection.threadId}\n`);
    start();
});
  