const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
	const campground = new Campground(req.body.campground);
	campground.author = req.user._id;
	await campground.save();
	req.flash('success', 'Successfully made new Campground!');
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
	if (!campground) {
		req.flash('error', 'Error: That Campground does not exist!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash('error', 'Error: That Campground does not exist!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isOwner, validateCampground, catchAsync(async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
	req.flash('success', 'Successfully updated Campground!');
	res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	await Campground.findByIdAndDelete(id);
	req.flash('success', `Successfully deleted ${campground.title} Campground!`);
	res.redirect('/campgrounds');
}));

module.exports = router;
