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

//adding expnse

const addExpense = require("./routes/expenses/addExpense");
const category = require("./routes/expenses/categoryForProject");
const usersCategory = require("./routes/expenses/categoryForusers");


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/user_info', getUserInfo);


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
