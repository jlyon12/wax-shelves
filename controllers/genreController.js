const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');

exports.genre_create_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on genre_create');
});

exports.genre_create_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on genre_create');
});

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on genre_delete');
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on genre_delete');
});

exports.genre_edit_get = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on genre_edit');
});

exports.genre_edit_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - POST on genre_edit');
});
exports.genre_detail = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED - GET on genre_detail');
});

exports.genre_list = asyncHandler(async (req, res, next) => {
	const allGenres = await Genre.find({}, 'name').sort({ name: 1 }).exec();

	res.render('genre_list', {
		title: 'All Genres',
		genre_list: allGenres,
	});
});
