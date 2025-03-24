const express = require("express");
const app = express();
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const connectDB = require('./db/connectdb');
const path = require('path');
const session = require('express-session');
const nocache = require('nocache')


app.use(nocache())
app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10000 * 60 * 60 * 24
    }
})),


    app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'hbs')
app.use(express.static("public"))


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/user', userRoute)
app.use('/admin', adminRoute)

connectDB();


app.listen(2000, () => {
    console.log("server start");

});