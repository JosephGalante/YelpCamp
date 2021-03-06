const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
	campground : Joi.object({
		title       : Joi.string().required().min(3).max(128).escapeHTML(),
		price       : Joi.number().required().min(0),
		location    : Joi.string().required().min(2).max(128).escapeHTML(),
		description : Joi.string().required().escapeHTML()
	}).required(),
	deleteImages: Joi.array()
});

let d = new Date();
let current_full_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

// Pro-Tip for Joi Schema's:
//	Do NOT have required() and default() in the same field of a schema
//	You only need one or the other, having both will cause issues
module.exports.reviewSchema = Joi.object({
	review : Joi.object({
		rating : Joi.number().required().min(1).max(5),
		body   : Joi.string().required().min(3).escapeHTML(),
		date   : Joi.date().min(current_full_date).max(current_full_date).default(current_full_date)
	}).required()
});