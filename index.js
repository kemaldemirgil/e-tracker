const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: '',
});

const start = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "menu",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View all roles",
                "Add Role",
                "Remove Role"
            ]
        }
    ])
    .then(function({menu}) {
        switch (menu) {
        case "View all employees" :
            // do something
            break;
        case "View all employees by department" :
            // do something
            break;        
        case "View all employees by manager" :
            // do something
            break;                
        case "Add Employee" :
            // do something
            break;           
        case "Remove Employee" :
            // do something
            break;
        case "Update Employee Role" :
            // do something
            break;                
        case "Update Employee Manager" :
            // do something
            break;                
        case "View all roles" :
            // do something
            break;
        case "Add Role" :
            // do something
            break;
        default :
            // remove role
            // do something
        }        
    })
}









start();

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    createProduct();
});
  