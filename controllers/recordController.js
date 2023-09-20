const Record = require('../models/record');
const Genre = require('../models/genre');
const Artist = require('../models/artist');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
	const [recordCount, artistCount, genreCount] = await Promise.all([
		Record.countDocuments({}).exec(),
		Artist.countDocuments({}).exec(),
		Genre.countDocuments({}).exec(),
	]);

	res.render('index', {
		title: 'Summary',
		recordCount: recordCount,
		artistCount: artistCount,
		genreCount: genreCount,
	});
});

exports.record_create_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on record_create');
});

exports.record_create_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on record_create');
});

exports.record_delete_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on record_delete');
});

exports.record_delete_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on record_delete');
});

exports.record_edit_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on record_edit');
});

exports.record_edit_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on record_edit');
});
exports.record_detail = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on record_detail');
});

exports.record_list = asyncHandler(async (req, res, next) => {
	const allRecords = await Record.find({}, 'title artist')
		.sort({ title: 1 })
		.populate('artist')
		.exec();

	res.render('record_list', {
		title: 'All Records',
		record_list: allRecords,
	});
});
