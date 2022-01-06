const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');

// ALL OF THE CAMPGROUND ROUTE HANDLING IS IN THE
// ./controllers/campgrounds.js folder
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.renderEditForm));



module.exports = router;
