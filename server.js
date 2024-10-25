const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./serviceAccountKey.json");
const jwt = require("jsonwebtoken");  
const bcrypt = require("bcryptjs");  
const secretKey = "AwalsSecretKey";

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Import the signup route handler
const signupRouter = require("./routes/signup");
// Import the login route handler
const loginRouter = require("./routes/login");
// Import the user route handler
const userRouter = require("./routes/user");
// Import the userUpdate route handler
const userUpdateRouter = require("./routes/userUpdate");
// Import the createTodo route handler
const createTodoRouter = require("./routes/createTodo");
// Import the getTodos route handler
const getTodosRouter = require("./routes/getTodos");
// Import the deleteTodo route handler
const deleteTodoRouter = require("./routes/deleteTodo");
// Import the updateTodo route handler
const updateTodoRouter = require("./routes/updateTodo");
const getUserInfo = require("./routes/user_info");

app.use('/user_info', getUserInfo);

// Use the signup route
app.use('/signup', signupRouter);
// Use the login route
app.use('/login', loginRouter);
// Use the user route
app.use('/user', userRouter);
// Use the userUpdate route
app.use('/user/update', userUpdateRouter);
// Use the createTodo route
app.use('/user/createtodos', createTodoRouter);
// Use the getTodos route
app.use('/user/todos', getTodosRouter);
// Use the deleteTodo route
app.use('/user/todos', deleteTodoRouter);
// Use the updateTodo route
app.use('/user/todos', updateTodoRouter);




// set PORT and listen for our request
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
});
