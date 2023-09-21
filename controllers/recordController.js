const Record = require('../models/record');
const Genre = require('../models/genre');
const Artist = require('../models/artist');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
	const [allArtists, allGenres] = await Promise.all([
		Artist.find({}, 'name').sort({ name: 1 }).exec(),
		Genre.find({}, 'name').sort({ name: 1 }).exec(),
	]);

	res.render('record_form', {
		title: 'Create Record',
		record: undefined,
		artist_list: allArtists,
		genre_list: allGenres,
		errors: undefined,
	});
});

exports.record_create_post = [
	// Concert genre to an array
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === 'undefined') req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},

	body('title', 'Title can not be empty').trim().isLength({ min: 1 }).escape(),
	body('artist', 'Artist can not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('label').trim().escape(),
	body('cat_number').trim().escape(),
	body('release_date').trim().escape(),
	body('genre.*').escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const record = new Record({
			title: req.body.title,
			artist: req.body.artist,
			label: req.body.label,
			cat_number: req.body.cat_number,
			release_date: req.body.release_date,
			genre: req.body.genre,
		});

		if (!errors.isEmpty()) {
			const [allArtists, allGenres] = await Promise.all([
				Artist.find({}, 'name').sort({ name: 1 }).exec(),
				Genre.find({}, 'name').sort({ name: 1 }).exec(),
			]);

			res.render('record_form', {
				title: 'Create Record',
				record: record,
				artist_list: allArtists,
				genre_list: allGenres,
				errors: errors.array(),
			});
		} else {
			await record.save();
			res.redirect(record.url);
		}
	}),
];

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
	const record = await Record.findById(req.params.id)
		.populate('artist')
		.populate('genre')
		.exec();

	res.render('record_detail', {
		title: 'Record',
		record: record,
	});
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
