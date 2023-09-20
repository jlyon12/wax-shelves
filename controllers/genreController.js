const Genre = require('../models/genre');
const Record = require('../models/record');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.genre_create_get = asyncHandler(async (req, res, next) => {
	res.render('genre_form', {
		title: 'Create Genre',
		genre: undefined,
		errors: undefined,
	});
});

exports.genre_create_post = [
	body('name', 'Genre must contain at least 3 characters')
		.trim()
		.isLength({ min: 3 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const genre = new Genre({ name: req.body.name });

		if (!errors.isEmpty()) {
			res.render('genre_form', {
				title: 'Create Genre',
				genre: genre,
				errors: errors.array(),
			});
		} else {
			const genreExists = await Genre.findOne({ name: req.body.name })
				.collation({ locale: 'en', strength: 2 })
				.exec();
			if (genreExists) {
				res.redirect(genreExists.url);
			} else {
				await genre.save();
				res.redirect(genre.url);
			}
		}
	}),
];

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
