const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');

// ALL OF THE CAMPGROUND ROUTE HANDLING IS IN THE
// ./controllers/campgrounds.js folder
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCampground));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground));

module.exports = router;
