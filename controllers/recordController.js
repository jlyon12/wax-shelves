const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
	res.render('index', { title: 'Wax Shelf' });
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
	res.send('NOT IMPLEMENTED - GET on record_list');
});
