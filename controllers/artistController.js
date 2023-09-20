const Artist = require('../models/artist');
const asyncHandler = require('express-async-handler');

exports.artist_create_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on artist_create');
});

exports.artist_create_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on artist_create');
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
	res.send('NOT IMPLEMENTED - GET on artist_detail');
});

exports.artist_list = asyncHandler(async (req, res, next) => {
	const allArtists = await Artist.find({}, 'name').sort({ name: 1 }).exec();

	res.render('artist_list', {
		title: 'All Artists',
		artist_list: allArtists,
	});
});
