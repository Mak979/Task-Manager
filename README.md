This Project is built on Node with server created with express.
Library used:

    1. Express - for creating server
    2. Nodemon - devDependencies

Endpoints:

    1. "/":
        Method - GET
        description - Entry point of the app
    2. "/tasks":
        Method - GET
        description - Get all the tasks
    3. "/tasks/:id"
        Method - GET
        description - Get task with task id provided
    4. "/tasks/priority/:level"
        Method - GET
        description - Get all the tasks with provided priority level
    5. "/tasks"
        Method - POST
        description - Create a new task
    6. "/tasks/:id"
        Method - PUT
        description - Edit the task with provided task id
    7. "/tasks/:id"
        Method - DELETE
        description - Delete the task with provided task id

