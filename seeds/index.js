const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = 'pk.eyJ1IjoiamVnMTUwIiwiYSI6ImNreTR2OWw0dzAyYXYyenJ6aXQza3BrNXkifQ.9K4bZAFWce-jacKnvLomXw'
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
		const price_unrounded = Math.floor(Math.random() * 30) + 10.99;
		const price_rounded = price_unrounded.toFixed(2);

		const geoData = await geocoder.forwardGeocode({
			query: `${cities[random1000].city}, ${cities[random1000].state}`,
			limit: 1
		})
		.send();
		const coords = geoData.body.features[0].geometry.coordinates;

		const camp = new Campground({
			author      : '61d611d58e6a547c925c777d',
			location    : `${cities[random1000].city}, ${cities[random1000].state}`,
			title       : `${sample(descriptors)} ${sample(places)}`,
			description : 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem enim illum tenetur id inventore assumenda ex fugit fugiat, exercitationem quam reprehenderit! Dolorem, illo iure ad atque veniam esse nostrum adipisci?',
			price: price_rounded,
			images: [{
      			url: 'https://res.cloudinary.com/dlbgh2yop/image/upload/v1641597954/YelpCamp/yosemite_ulnhap.jpg',
      			filename: 'YelpCamp/duc2s3rlslzmvewaghzj'
			}],
			geometry: {
				type: "Point",
				coordinates: coords
			}
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
