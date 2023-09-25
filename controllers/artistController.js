const Artist = require('../models/artist');
const Record = require('../models/record');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.artist_create_get = asyncHandler(async (req, res, next) => {
	res.render('artist_form', {
		title: 'Create Artist',
		artist: undefined,
		errors: undefined,
	});
});

exports.artist_create_post = [
	body('name', 'Artist name can not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const artist = new Artist({ name: req.body.name });

		if (!errors.isEmpty()) {
			res.render('artist_form', {
				title: 'Create Artist',
				artist: artist,
				errors: errors.array(),
			});
		} else {
			const artistExists = await Artist.findOne({ name: req.body.name })
				.collation({ locale: 'en', strength: 2 })
				.exec();
			if (artistExists) {
				res.redirect(artistExists.url);
			} else {
				await artist.save();
				res.redirect(artist.url);
			}
		}
	}),
];

exports.artist_delete_get = asyncHandler(async (req, res, next) => {
	const [artist, recordsInArtist] = await Promise.all([
		Artist.findById(req.params.id).exec(),
		Record.find({ artist: req.params.id }).sort({ title: 1 }).exec(),
	]);
	if (artist == null) {
		const err = new Error('Artist not found');
		err.status = 404;
		return next(err);
	}
	res.render('artist_delete', {
		title: 'Delete',
		artist: artist,
		artist_records: recordsInArtist,
		errors: undefined,
	});
});

exports.artist_delete_post = [
	body('key', 'Invalid authentication')
		.trim()
		.matches(process.env.INTERNAL_ADMIN_KEY)
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const [artist, recordsInArtist] = await Promise.all([
			Artist.findById(req.params.id).exec(),
			Record.find({ artist: req.params.id }).sort({ title: 1 }).exec(),
		]);

		if (recordsInArtist.length > 0) {
			res.render('artist_delete', {
				title: 'Delete Artist',
				artist: artist,
				artist_records: recordsInArtist,
				errors: undefined,
			});
		} else if (!errors.isEmpty()) {
			res.render('artist_delete', {
				title: 'Delete Artist',
				artist: artist,
				artist_records: recordsInArtist,
				errors: errors.array(),
			});
		} else {
			await Artist.findByIdAndRemove(req.params.id).exec();
			res.redirect('/collection/artists');
		}
	}),
];

exports.artist_edit_get = asyncHandler(async (req, res, next) => {
	const artist = await Artist.findById(req.params.id).exec();

	res.render('artist_form', {
		title: 'Edit Artist',
		artist: artist,
		errors: undefined,
	});
});

exports.artist_edit_post = [
	body('name', 'Artist name can not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('key', 'Invalid authentication')
		.trim()
		.matches(process.env.INTERNAL_ADMIN_KEY)
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const artist = new Artist({ name: req.body.name, _id: req.params.id });

		if (!errors.isEmpty()) {
			res.render('artist_form', {
				title: 'Edit Artist',
				artist: artist,
				errors: errors.array(),
			});
		} else {
			const updatedArtist = await Artist.findByIdAndUpdate(
				req.params.id,
				artist,
				{}
			);
			res.redirect(updatedArtist.url);
		}
	}),
];

exports.artist_detail = asyncHandler(async (req, res, next) => {
	const [artist, recordsInArtist] = await Promise.all([
		Artist.findById(req.params.id).exec(),
		Record.find({ artist: req.params.id }).sort({ title: 1 }).exec(),
	]);
	if (artist == null) {
		const err = new Error('Artist not found');
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
