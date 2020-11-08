require('dotenv').config()
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var routing = express.Router();

/**
 * Configure the Facebook strategy for use by Passport
 */
passport.use(new Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/facebook/return'
}, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

// Configure Passport authenticated session persistence.
//

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Initialize Passport and restore authentication state, if any, from the
// session.

routing.use(passport.initialize());
routing.use(passport.session());


routing.get(['/', '/login'],
    passport.authenticate('facebook'));

routing.get('/return',
    passport.authenticate('facebook', { failureRedirect: '/facebook/login' }),
    function (req, res) {
        res.redirect('/facebook/profile');
    });

routing.get('/profile', require('connect-ensure-login').ensureLoggedIn('/'),
    function (req, res) {
        console.log(req.user);
        res.json({ user: req.user });
    });
module.exports = routing;