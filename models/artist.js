const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
	name: { type: String, required: true, minLength: 1 },
});

ArtistSchema.virtual('url').get(function () {
	return `/collection/artist/${this._id}`;
});

module.exports = mongoose.model('Artist', ArtistSchema);
