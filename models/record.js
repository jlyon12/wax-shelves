const { DateTime } = require('luxon');
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

RecordSchema.virtual('release_date_formatted').get(function () {
	return this.release_date
		? DateTime.fromJSDate(this.release_date).toLocaleString(
				DateTime.DATE_MED_WITH_WEEKDAY
		  )
		: '';
});
RecordSchema.virtual('date_acquired_formatted').get(function () {
	return this.date_acquired
		? DateTime.fromJSDate(this.date_acquired).toLocaleString(DateTime.DATE_MED)
		: '';
});

module.exports = mongoose.model('Record', RecordSchema);
