const express = require('express');
const router = express.Router();

/* Redirect to Collection page on GET index */
router.get('/', function (req, res, next) {
	res.redirect('/collection');
});

module.exports = router;
