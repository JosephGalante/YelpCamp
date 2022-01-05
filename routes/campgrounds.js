const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

//Middleware to validate the New Campground submission
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((element) => element.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

router.get('/', catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('Success', 'Successfully made new Campground!');
		res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews');
		if (!campground) {
			req.flash('Error', 'Error: That Campground does not exist!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash('Error', 'Error: That Campground does not exist!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
		req.flash('Success', 'Successfully updated Campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		await Campground.findByIdAndDelete(id);
		req.flash('Success', `Successfully deleted ${campground.title} Campground!`);
		res.redirect('/campgrounds');
	})
);

module.exports = router;
