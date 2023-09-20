const Artist = require('../models/artist');
const Record = require('../models/record');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.artist_create_get = asyncHandler(async (req, res, next) => {
	res.render('artist_form', {
		title: 'Create Artist',
		artist: undefined,
	});
});

exports.artist_delete_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on artist_delete');
});

exports.artist_delete_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on artist_delete');
});

exports.artist_edit_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on artist_edit');
});

exports.artist_edit_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on artist_edit');
});
exports.artist_detail = asyncHandler(async (req, res, next) => {
	const [artist, recordsInArtist] = await Promise.all([
		Artist.findById(req.params.id).exec(),
		Record.find({ artist: req.params.id }).sort({ title: 1 }).exec(),
	]);
	if (artist == null) {
		const err = new Error('Genre not found');
		err.status = 404;
		return next(err);
	}
	res.render('artist_detail', {
		title: 'Artist',
		artist: artist,
		artist_records: recordsInArtist,
	});
});

exports.artist_list = asyncHandler(async (req, res, next) => {
	const allArtists = await Artist.find({}, 'name').sort({ name: 1 }).exec();

	res.render('artist_list', {
		title: 'All Artists',
		artist_list: allArtists,
	});
});
