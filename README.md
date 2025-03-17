Backend Authentication & User Management API

Overview

This project is a simple authentication and user management API built using Node.js, Express.js, and MongoDB. It includes authentication using JWT and CRUD operations for managing user data.

Since this is a short project, we have focused only on creating APIs without additional frontend




Features

1 -> User Signup

2 -> User Login with JWT authentication

3 -> User Logout

4 -> CRUD operations for user management



How to Run the Project

1 -> Open the project folder in VS Code.

2 -> Open a terminal.

3 -> Navigate to the backend folder using: cd backend




Install dependencies:

1 -> npm install

2 -> Start the server:

    a. npm run start

3 -> Open Thunder Client or Postman to test the APIs.



4 -> API Endpoints

Authentication

POST /signup - http://localhost:5000/user/signup

POST /login - http://localhost:5000/user/login

GET /logout - http://localhost:5000/user/logout



User Management

GET /user/getuser/:id - Get user details.  -> http://localhost:5000/user/getuser/67d8924bff40b2e86c9addad

Patch /user/updateuser/:id - Update user details. -> http://localhost:5000/user/updateuser/67d8924bff40b2e86c9addad

DELETE /user/deleteuser/:id - Delete user. -> http://localhost:5000/user/deleteuser/67d8924bff40b2e86c9addad