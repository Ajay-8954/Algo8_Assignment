Backend Authentication & User Management API

Overview

This project is a simple authentication and user management API built using Node.js, Express.js, and MongoDB. It includes authentication using JWT and CRUD operations for managing user data.

Since this is a short project, we have focused only on creating APIs without additional frontend or middleware.




Features

1 -> User Signup

2 -> User Login with JWT authentication

3 -> User Logout

4 -> CRUD operations for user management



How to Run the Project

1 -> Open the project folder in VS Code.

2 -> Open a terminal.

3 -> Navigate to the backend folder using:

4 -> cd backend




Install dependencies:

1 -> npm install

2 -> Start the server:

    a) npm run start


3 -> Open Thunder Client or Postman to test the APIs.


4 -> API Endpoints

Authentication

POST /signup - Register a new user.

POST /login - Login and get JWT token.

GET /logout - Logout user.



User Management

GET /user/:id - Get user details.

PUT /user/:id - Update user details.

DELETE /user/:id - Delete user.