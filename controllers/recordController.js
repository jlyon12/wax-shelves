const Record = require('../models/record');
const Genre = require('../models/genre');
const Artist = require('../models/artist');
const { extname } = require('path');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const des = 'public/data/uploads/';
		fs.mkdirSync(des, { recursive: true });
		cb(null, des);
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + uuidv4() + extname(file.originalname));
	},
});
const upload = multer({ storage: storage });

exports.index = asyncHandler(async (req, res, next) => {
	const [
		recordCount,
		artistCount,
		genreCount,
		topArtists,
		topGenres,
		recentRecords,
	] = await Promise.all([
		Record.countDocuments({}).exec(),
		Artist.countDocuments({}).exec(),
		Genre.countDocuments({}).exec(),
		Record.aggregate([
			{
				$lookup: {
					from: 'artists',
					localField: 'artist',
					foreignField: '_id',
					as: 'artist',
				},
			},
			{
				$unwind: {
					path: '$artist',
					includeArrayIndex: 'string',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$sortByCount: '$artist',
			},
			{
				$limit: 5,
			},
		]),
		Record.aggregate([
			{
				$lookup: {
					from: 'genres',
					localField: 'genre',
					foreignField: '_id',
					as: 'genre',
				},
			},
			{
				$unwind: {
					path: '$genre',
					includeArrayIndex: 'string',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$sortByCount: '$genre',
			},
			{
				$limit: 5,
			},
		]),
		Record.find({})
			.populate('artist')
			.sort({ date_acquired: -1 })
			.limit(5)
			.exec(),
	]);
	res.render('index', {
		title: 'Collection',
		recordCount: recordCount,
		artistCount: artistCount,
		genreCount: genreCount,
		topArtists: topArtists,
		topGenres: topGenres,
		recentRecords: recentRecords,
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
	// Convert genre to an array
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === 'undefined') req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},
	upload.single('uploaded_cover'),

	body('title', 'Title can not be empty').trim().isLength({ min: 1 }).escape(),
	body('artist', 'Artist can not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('label')
		.optional({ values: 'falsy' })
		.trim()
		.isLength({ min: 1 })
		.withMessage(
			'Label is optional. If provided it must contain at least one character.'
		)
		.isLength({ max: 30 })
		.withMessage(
			'Label is optional. If provided it must contain fewer than 30 characters.'
		)
		.escape(),
	body('cat_number')
		.optional({ values: 'falsy' })
		.trim()
		.isLength({ min: 1 })
		.withMessage(
			'Catalog Number is optional. If provided it must contain at least one character.'
		)
		.isLength({ max: 30 })
		.withMessage(
			'Catalog Number is optional. If provided it must contain fewer than 30 characters.'
		)
		.escape(),
	body('release_date', 'Invalid Release Date')
		.optional({ values: 'falsy' })
		.isISO8601()
		.toDate(),
	body('genre.*').optional({ values: 'falsy' }).escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const record = new Record({
			title: req.body.title,
			artist: req.body.artist,
			label: req.body.label,
			cat_number: req.body.cat_number,
			release_date: req.body.release_date,
			genre: req.body.genre,
			date_acquired: req.body.date_acquired,
			imgURL: !req.file ? '' : `/data/uploads/${req.file.filename}`,
		});

		if (!errors.isEmpty()) {
			// If there are errors, delete the file uploaded before validation ran.
			if (req.file) {
				fs.unlink(path.join(__dirname, '..', req.file.path), (err) => {
					if (err) throw err;
				});
			}
			const [allArtists, allGenres] = await Promise.all([
				Artist.find({}, 'name').sort({ name: 1 }).exec(),
				Genre.find({}, 'name').sort({ name: 1 }).exec(),
			]);
			for (const genre of allGenres) {
				for (const record_g of record.genre) {
					if (genre._id.toString() === record_g._id.toString()) {
						genre.checked = 'true';
					}
				}
			}
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
	const record = await Record.findById(req.params.id)
		.populate('artist')
		.populate('genre')
		.exec();
	if (record === null) {
		res.redirect('/collection/records');
	}
	res.render('record_delete', {
		title: 'Delete',
		record: record,
		errors: undefined,
	});
});

exports.record_delete_post = [
	body('key', 'Invalid authentication')
		.trim()
		.matches(process.env.INTERNAL_ADMIN_KEY)
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req, res, next);
		const record = await Record.findById(req.params.id).exec();

		if (!errors.isEmpty()) {
			res.render('genre_delete', {
				title: 'Delete Genre',
				record: record,
				errors: errors.array(),
			});
		} else {
			await Record.findByIdAndRemove(req.params.id).exec();
			res.redirect('/collection/records');
		}
	}),
];

exports.record_edit_get = asyncHandler(async (req, res, next) => {
	const [allArtists, allGenres, record] = await Promise.all([
		Artist.find({}, 'name').sort({ name: 1 }).exec(),
		Genre.find({}, 'name').sort({ name: 1 }).exec(),
		Record.findById(req.params.id).populate('artist').populate('genre').exec(),
	]);

	if (record === null) {
		const err = new Error('Record not found');
		err.status = 404;
		next(err);
	}

	for (const genre of allGenres) {
		for (const record_g of record.genre) {
			if (genre._id.toString() === record_g._id.toString()) {
				genre.checked = 'true';
			}
		}
	}

	res.render('record_form', {
		title: 'Edit Record',
		record: record,
		artist_list: allArtists,
		genre_list: allGenres,
		errors: undefined,
	});
});

exports.record_edit_post = [
	// Convert genre to an array
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === 'undefined') req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},
	upload.single('uploaded_cover'),

	body('title', 'Title can not be empty').trim().isLength({ min: 1 }).escape(),
	body('artist', 'Artist can not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('label')
		.optional({ values: 'falsy' })
		.trim()
		.isLength({ min: 1 })
		.withMessage(
			'Label is optional. If provided it must contain at least one character.'
		)
		.isLength({ max: 30 })
		.withMessage(
			'Label is optional. If provided it must contain fewer than 30 characters.'
		)
		.escape(),
	body('cat_number')
		.optional({ values: 'falsy' })
		.trim()
		.isLength({ min: 1 })
		.withMessage(
			'Catalog Number is optional. If provided it must contain at least one character.'
		)
		.isLength({ max: 30 })
		.withMessage(
			'Catalog Number is optional. If provided it must contain fewer than 30 characters.'
		)
		.escape(),
	body('release_date', 'Invalid Release Date')
		.optional({ values: 'falsy' })
		.isISO8601()
		.toDate(),
	body('genre.*').optional({ values: 'falsy' }).escape(),
	body('key', 'Invalid authentication')
		.trim()
		.matches(process.env.INTERNAL_ADMIN_KEY)
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const oldRecord = await Record.findById(req.params.id).exec();
		// Is there a new album art uploaded for this record?
		// Did album art already exist?
		// If both true, delete the old album art file from storage and only maintain the new file in storage.
		if (req.file && oldRecord.imgURL) {
			fs.unlink(path.join(__dirname, '../public', oldRecord.imgURL), (err) => {
				if (err) throw err;
			});
		}

		const record = new Record({
			title: req.body.title,
			artist: req.body.artist,
			label: req.body.label,
			cat_number: req.body.cat_number,
			release_date: req.body.release_date,
			genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
			date_acquired: req.body.date_acquired,
			imgURL: !req.file
				? oldRecord.imgURL
				: `/data/uploads/${req.file.filename}`,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			// If there are errors, delete the file uploaded before validation ran.
			if (req.file) {
				fs.unlink(path.join(__dirname, '..', req.file.path), (err) => {
					if (err) throw err;
				});
			}
			const [allArtists, allGenres] = await Promise.all([
				Artist.find({}, 'name').sort({ name: 1 }).exec(),
				Genre.find({}, 'name').sort({ name: 1 }).exec(),
			]);

			for (const genre of allGenres) {
				for (const record_g of record.genre) {
					if (genre._id.toString() === record_g._id.toString()) {
						genre.checked = 'true';
					}
				}
			}
			res.render('record_form', {
				title: 'Edit Record',
				record: record,
				artist_list: allArtists,
				genre_list: allGenres,
				errors: errors.array(),
			});
		} else {
			const updatedRecord = await Record.findByIdAndUpdate(
				req.params.id,
				record,
				{}
			);
			res.redirect(updatedRecord.url);
		}
	}),
];

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
	const allRecords = await Record.find({}, 'title artist imgURL')
		.sort({ title: 1 })
		.populate('artist')
		.exec();

	res.render('record_list', {
		title: 'All Records',
		record_list: allRecords,
	});
});
