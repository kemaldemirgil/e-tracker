<h1 align = "center"> E-Tracker <br> Employee Managment Application </h1>
<p align = "center">
  <img src="https://img.shields.io/npm/v/npm?color=red&logo=npm"/>
  <img src="https://img.shields.io/node/v/jest"/>
  <img src="https://img.shields.io/github/license/kemaldemirgil/e-tracker?color=cyan&label=License&logo=github&logoColor=cyan"/>
  <img src="https://img.shields.io/github/issues/kemaldemirgil/e-tracker?color=yellow&label=Issues&logo=github&logoColor=yellow">
  <img src="https://img.shields.io/github/last-commit/kemaldemirgil/e-tracker?color=orange&label=Last%20Commit&logo=git&logoColor=orange">
</p>

<p align = "center" ><img src="/images/start-eTracker.PNG"/></p>

## About:
This application was created to organize and plan businesses, it allows the user to easily store data about their employee's, departments and roles. This application is an example of a `CRUD` operation, while applying additional features on top of it.\
Since this application was mainly created to practice `MySQL` by creating a simple **C**ontent **M**anagement **S**ystem, it is only functional on `Node.js` therefore, it doesn't have a front end.
Demo
:-------------------------:
![](/images/demo.gif)

## Notes:
*E-tracker* is my first `MySQL` application, it also uses `inquirer.js` to run it however, at first it was really challenging trying to structure the foundation of it. At first, I tried creating separate files for each of the function to implement the ideal `OOP` structure but, I had too many errors and I didn't want to spend too much time on the aesthetics, so I wrote the whole program in a single file.\
Even though the code is a bit too much and repetitive, it does the job and that is what I'll be focusing for this project. In the future, I have better ideas to create a program like this in a much neater approach.

## Usage:
E-tracker allows the user to;
- `View all employees`
- `View all departments`
- `View all roles`
- `View all employees by manager`
- `View the total utilized budget of a department`
- `Add employee`
- `Add department`
- `Add role`
- `Update employee role`
- `Update employee manager`
- `Delete employee`
- `Delete department`
- `Delete role`

After installing the dependencies, please simply run;
```bash
node index.js
```
Follow along the prompts;
Menu
:-------------------------:
![](/images/menu.gif)

## Installation & Dependencies:
Please run;
```bash
npm install
```
to install the dependencies.

Dependencies    
:-------------------------:
![](/images/dependencies.PNG)

## Images:

View All Employees            |  View Employees By Manager
:-------------------------:|:-------------------------:
![](/images/employees.PNG)  |  ![](/images/manager.PNG)


View All Roles             |  View All Departments     |  View Total Budget For Departments          
:-------------------------:|:-------------------------:|:-------------------------:
![](/images/roles.PNG)  |  ![](/images/department.PNG) |  ![](/images/budget.PNG)



## Improvements:
Unfortunately, this isn't the perfect *bug free* application, it has some issues with it but can be solved with some more extra time spent on it. Besides that, for future improvement, a lot more options can be added for example; grouping multiple employees and doing `CRUD` operations on them, creating a schedule for each employee, adding a *first day* date for each employee, adding an address input for each employee and much more!

> Please contact me for any contributions or any input about this application, I would love to get some feedback and improve this simple project.

<h3 align = "center">Connect with me!</h3>
<p align="center">
  <a href="https://www.linkedin.com/in/kemaldemirgil/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=plastic&logo=linkedin&logoColor=white"/></a>
  <a href="mailto: kemal.demirgil@hotmail.com" target="_blank"><img src="https://img.shields.io/badge/Gmail-D14836?style=plastic&logo=gmail&logoColor=white"/></a>
</p>

## License:
Copyright © Kemal Demirgil. All rights reserved.
Licensed under the [MIT](https://github.com/kemaldemirgil/e-tracker/blob/main/LICENSE) license.
