const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let d = new Date();
let current_full_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

const reviewSchema = new Schema({
	body   : String,
	rating: Number,
	date: {
		type: Date,
		default: current_full_date
	}
});

module.exports = mongoose.model('Review', reviewSchema);
