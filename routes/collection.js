const express = require('express');
const router = express.Router();

// Require controllers
const recordController = require('../controllers/recordController');
const artistController = require('../controllers/artistController');
const genreController = require('../controllers/genreController');

// -----RECORD ROUTES-----

// GET collection home page
router.get('/', recordController.index);
// GET request for creating a new record
router.get('/record/create', recordController.record_create_get);
// POST request for creating a new record
router.post('/record/create', recordController.record_create_post);
// GET request for deleting a record
router.get('/record/:id/delete', recordController.record_delete_get);
// POST request for deleting a record
router.post('/record/:id/delete', recordController.record_delete_post);
// GET request for editing a record
router.get('/record/:id/edit', recordController.record_edit_get);
// POST request for editing a record
router.post('/record/:id/edit', recordController.record_edit_post);
// GET request for single record detail
router.get('/record/:id/detail', recordController.record_detail);
// GET request for list of all records
router.get('/records', recordController.record_list);

// -----ARTIST ROUTES-----

// GET request for creating a new artist
router.get('/artist/create', artistController.artist_create_get);
// POST request for creating a new artist
router.post('/artist/create', artistController.artist_create_post);
// GET request for deleting a artist
router.get('/artist/:id/delete', artistController.artist_delete_get);
// POST request for deleting a artist
router.post('/artist/:id/delete', artistController.artist_delete_post);
// GET request for editing a artist
router.get('/artist/:id/edit', artistController.artist_edit_get);
// POST request for editing a artist
router.post('/artist/:id/edit', artistController.artist_edit_post);
// GET request for single artist detail
router.get('/artist/:id/detail', artistController.artist_detail);
// GET request for list of all artists
router.get('/artists', artistController.artist_list);

// -----GENRE ROUTES-----

// GET request for creating a new genre
router.get('/genre/create', genreController.genre_create_get);
// POST request for creating a new genre
router.post('/genre/create', genreController.genre_create_post);
// GET request for deleting a genre
router.get('/genre/:id/delete', genreController.genre_delete_get);
// POST request for deleting a genre
router.post('/genre/:id/delete', genreController.genre_delete_post);
// GET request for editing a genre
router.get('/genre/:id/edit', genreController.genre_edit_get);
// POST request for editing a genre
router.post('/genre/:id/edit', genreController.genre_edit_post);
// GET request for single genre detail
router.get('/genre/:id/detail', genreController.genre_detail);
// GET request for list of all genres
router.get('/genres', genreController.genre_list);

module.exports = router;
