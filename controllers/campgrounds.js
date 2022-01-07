const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
	const campground = new Campground(req.body.campground);
	//Map over the array of images and add it to the Campground Model
	campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	campground.author = req.user._id;
	await campground.save();
	req.flash('success', 'Successfully made new Campground!');
	res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({
			path     : 'reviews',
			populate : {
				path: 'author'
			}
		})
		.populate('author');
	if (!campground) {
		req.flash('error', 'Error: That Campground does not exist!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
}

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	await Campground.findByIdAndDelete(id);
	req.flash('success', `Successfully deleted ${campground.title} Campground!`);
	res.redirect('/campgrounds');
}

module.exports.renderEditForm = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash('error', 'Error: That Campground does not exist!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
	const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	await campground.save();
	
	if (req.body.deleteImages && req.body.deleteImages.length === campground.images.length) {
		req.flash('error', 'Campgrounds must have at least one image!');
		return res.redirect(`/campgrounds/${campground._id}`);
	}

	//If there are images to delete
	if (req.body.deleteImages) {
		//Delete the selected images from the campground
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
	}
	
	req.flash('success', 'Successfully updated Campground!');
	res.redirect(`/campgrounds/${campground._id}`);
}
