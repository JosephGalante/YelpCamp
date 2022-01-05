const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas.js');
const { findById } = require('../models/review');

//Middleware to validate the Campground Review submission
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map((element) => element.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

router.post('/', validateReview, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', `Successfully reviewed ${campground.title}!`);
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {

	// Note (Not sure if this is set in stone or I'm doing something wrong): 
	// When destructuring req.params, the variable names MUST BE the same as
	// The keys in req.params for some reason
	const { id, reviewId } = req.params;
	const campground = await Campground.findById(id);

	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', `Successfully deleted review for ${campground.title}`);
	res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;