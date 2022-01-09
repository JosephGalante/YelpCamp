const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');

// Verifies that there is a user logged-in in the session
module.exports.isLoggedIn = (req, res, next) => {  
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// Ensures that the logged in user is the owner of the campground
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Ensures that the logged in user is the owner of the review
module.exports.isReviewOwner = async (req, res, next) => {
	const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Validates the New Campground submission
module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((element) => element.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

//Middleware to validate the Campground Review submission
module.exports.validateReview = async (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	const { id: campId } = req.params;
	
	//=====================================================
	//Prevent a user from reviewing a place more than once
	const campground = await Campground.findById(campId).populate({
		path: 'reviews',
		populate: {
			path: 	'author',
		},
		match: {author: {$eq: req.user.id}}
	});
	
	if (campground.reviews.length) {
		req.flash('error', 'You have already reviewed this Campground!');
		return res.redirect(`/campgrounds/${campId}`)
	}
	//=====================================================
	
	if (error && error.details[0].type === 'number.min') {
		req.flash('error', 'You must provide a rating!');
		return res.redirect(`/campgrounds/${campId}`)
	}
	else if (error) {
		const message = error.details.map((element) => element.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};