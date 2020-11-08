require('dotenv').config()
var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var routing = express.Router();

/**
 * Configure the Google strategy for use by Passport
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/google/return'
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
    passport.authenticate('google',{ scope: ['profile'] }));

routing.get('/return',
    passport.authenticate('google', { failureRedirect: '/google/login' }),
    function (req, res) {
        res.redirect('/google/profile');
    });

routing.get('/profile', require('connect-ensure-login').ensureLoggedIn('/'),
    function (req, res) {
        console.log(req.user);
        res.json({ user: req.user });
    });
module.exports = routing;