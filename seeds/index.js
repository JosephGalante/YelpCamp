const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useUnifiedTopology : true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database Connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		let price_unrounded = Math.floor(Math.random() * 30) + 10.99;
		let price_rounded = price_unrounded.toFixed(2);
		const camp = new Campground({
			location    : `${cities[random1000].city}, ${cities[random1000].state}`,
			title       : `${sample(descriptors)} ${sample(places)}`,
			image       : 'https://source.unsplash.com/collection/483251',
			description :
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem enim illum tenetur id inventore assumenda ex fugit fugiat, exercitationem quam reprehenderit! Dolorem, illo iure ad atque veniam esse nostrum adipisci?',
			price       : price_rounded
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
