const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('Success', `Welcome to YelpCamp, ${registeredUser.username}!`);
        res.redirect('/campgrounds');
    }
    catch (err) {
        req.flash('Error', err.message);
        res.redirect('register')
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('Success', `Welcome back to YelpCamp!`);
    res.redirect('/campgrounds');
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('Success', 'Goodbye!');
    res.redirect('/campgrounds');
})

module.exports = router;