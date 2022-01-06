const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Second parameter does two things:
//      -Makes login case insensitive
//      -Ensures no users can have same username but different capitalization schemes
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);