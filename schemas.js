const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
	campground : Joi.object({
		title       : Joi.string().required().min(3).max(128),
		price       : Joi.number().required().min(0),
		location    : Joi.string().required().min(2).max(128),
		description : Joi.string().required()
	}).required()
});

let d = new Date();
let current_full_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

// Pro-Tip for Joi Schema's:
//	Do NOT have required() and default() in the same field of a schema
//	You only need one or the other, having both will cause issues
module.exports.reviewSchema = Joi.object({
	review : Joi.object({
		rating : Joi.number().required().min(1).max(5),
		body   : Joi.string().required().min(3),
		date   : Joi.date().min(current_full_date).max(current_full_date).default(current_full_date)
	}).required()
});