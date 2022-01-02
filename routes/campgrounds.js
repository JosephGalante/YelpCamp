const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

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

router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get('/:id', catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews');
		res.render('campgrounds/show', { campground });
	})
);

router.get('/:id/edit', catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/edit', { campground });
	})
);

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete('/:id', catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	})
);

module.exports = router;