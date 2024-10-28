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
const recoverPassword = require("./routes/authUser/recoverPassword");

//adding expnse

const addExpense = require("./routes/expenses/expense");
const category = require("./routes/expenses/categoryForProject");
const usersCategory = require("./routes/expenses/categoryForusers");
const deleteUserData = require("./routes/deleteUserData");

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/recoverPassword', recoverPassword);
app.use('/user_info', getUserInfo);
app.use('/deleteUserData', deleteUserData);

//adding expnse
app.use('/expense', addExpense);
app.use('/category', category);
app.use('/usersCategory', usersCategory);



// set PORT and listen for our request
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
});
