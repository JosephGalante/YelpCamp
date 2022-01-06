const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { isLoggedIn, validateReview, isReviewOwner } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', `Successfully reviewed ${campground.title}!`);
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewOwner,catchAsync(async (req, res) => {

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