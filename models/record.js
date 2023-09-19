const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
	title: { type: String, required: true },
	artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
	label: { type: String },
	cat_number: { type: String },
	release_date: { type: Date },
	genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
	date_acquired: { type: Date, default: new Date() },
});

RecordSchema.virtual('url').get(function () {
	return `/collection/record/${this.id}`;
});

module.exports = mongoose.model('Record', RecordSchema);
