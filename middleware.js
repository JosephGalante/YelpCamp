module.exports.isLoggedIn = (req, res, next) => {
    console.log(`Req.user is...${req.user}`);
    if (!req.isAuthenticated()) {
        req.flash('Error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

