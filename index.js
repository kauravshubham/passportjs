var express = require("express");
var app = express();
var passport = require('passport');


app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

var fbAuth=require('./strategies/facebook');

app.all('/', (req, res) => {
    console.log("/",req.cookies);
    res.sendFile('welcome.html',{root:__dirname})
})

// Configure Passport authenticated session persistence.
//

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use("/facebook",fbAuth);

var server = app.listen(3000, () => {
    var host = server.address().address
    var port = server.address().port

    console.log("Passport app listening at http://%s:%s", host, port)
})