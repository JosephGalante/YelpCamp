const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title       : String,
	image       : String,
	price       : Number,
	description : String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews     : [
		{
			type : Schema.Types.ObjectId,
			ref  : 'Review'
		}
	]
});


// This deletes all of the reviews associated with a Campground 
// When a client deletes a campground
CampgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		})
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
