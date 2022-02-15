if (process.env.NODE_ENV !== "production") {
	require('dotenv').config()
}

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb:localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
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
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'Secret Agent Randy Beans';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on('error', function (err) {
	console.log("Session Store Error", err);
})

const sessionConfig = {
	store,
	name              : 'session',
	secret            : secret,
	resave            : false,
	saveUninitialized : true,
	cookie            : {
 		httpOnly: true,
		// secure: true,
		//That product is 1 week (7 days)
		expires  : Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge   : 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));
app.use(flash());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://ka-f.fontawesome.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dlbgh2yop/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dlbgh2yop/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
	"https://res.cloudinary.com/dlbgh2yop/",
	"https://use.fontawesome.com/",
	"https://ka-f.fontawesome.com"
];
const fontSrcUrls = [
	"https://res.cloudinary.com/dlbgh2yop/",
	"https://ka-f.fontawesome.com",
	"https://kit.fontawesome.com",
	"https://kit.fontawesome.com/"
];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            "default-src" : [],
            "connect-src" : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            "img-src"     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dlbgh2yop/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				"https://images.unsplash.com/",
				
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dlbgh2yop/" ],
            childSrc   : [ "blob:" ]
        }
    })
);

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

// Navigates to YelpCamp Home
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});