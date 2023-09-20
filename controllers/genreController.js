const Genre = require('../models/genre');
const Record = require('../models/record');
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
	const [genre, recordsInGenre] = await Promise.all([
		Genre.findById(req.params.id).exec(),
		Record.find({ genre: req.params.id })
			.populate('artist')
			.sort({ title: 1 })
			.exec(),
	]);
	if (genre == null) {
		const err = new Error('Genre not found');
		err.status = 404;
		return next(err);
	}
	res.render('genre_detail', {
		title: 'Genre',
		genre: genre,
		genre_records: recordsInGenre,
	});
});

exports.genre_list = asyncHandler(async (req, res, next) => {
	const allGenres = await Genre.find({}, 'name').sort({ name: 1 }).exec();

	res.render('genre_list', {
		title: 'All Genres',
		genre_list: allGenres,
	});
});
