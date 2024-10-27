const express = require("express");
const app = express();
const admin = require("firebase-admin");

 const credentials = require("./serviceAccountKey.json");
 

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

 
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const signupRouter = require("./routes/authUser/signup");
const loginRouter = require("./routes/authUser/login");
const getUserInfo = require("./routes/authUser/user_info");

const userRouter = require("./routes/user");
const userUpdateRouter = require("./routes/userUpdate");
const createTodoRouter = require("./routes/createTodo");
const getTodosRouter = require("./routes/getTodos");
const deleteTodoRouter = require("./routes/deleteTodo");
const updateTodoRouter = require("./routes/updateTodo");

//adding expnse

const addExpense = require("./routes/expenses/addExpense");
const category = require("./routes/expenses/categoryForProject");
const usersCategory = require("./routes/expenses/categoryForusers");


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/user_info', getUserInfo);

app.use('/user', userRouter);
app.use('/user/update', userUpdateRouter);
app.use('/user/createtodos', createTodoRouter);
app.use('/user/todos', getTodosRouter);
app.use('/user/todos', deleteTodoRouter);
// Use the updateTodo route
app.use('/user/todos', updateTodoRouter);

//adding expnse
app.use('/addExpense', addExpense);
app.use('/category', category);
app.use('/usersCategory', usersCategory);
//categoryForusers



// set PORT and listen for our request
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
});
