const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const passport = require('passport');


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useUnifiedTopology : true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database Connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
	secret            : 'Secret Agent Randy Beans',
	resave            : false,
	saveUninitialized : true,
	cookie            : {
		httpOnly : true,
		//That product is 1 week (7 days)
		expires  : Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge   : 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// KEEP THESE FLASH MESSAGES LOWER-CASED!
app.use((req, res, next) => {
	if (!['/login', '/', '/register'].includes(req.originalUrl)) {
		req.session.previousReturnTo = req.session.returnTo; // store the previous url
		req.session.returnTo = req.originalUrl; // assign a new url
	}
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// Navigates to YelpCamp Home (Not home page that we use)
app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	req.session.returnTo = req.session.previousReturnTo;
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) {
		err.message = 'Something went wrong.';
	}
	res.status(status).render('error', { err });
});

app.listen(3000, () => {
	console.log('Serving on port 3000');
});