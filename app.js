const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

// Navigates to YelpCamp Home (Not home page that we use)
app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	// res.send('404 Error')
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { status = 500, message = 'Something went wrong' } = err;
	if (!err.message) {
		err.message = 'Something went wrong. Stupid';
	}
	res.status(status).render('error', { err });
});

app.listen(3000, () => {
	console.log('Serving on port 3000');
});
