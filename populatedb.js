#! /usr/bin/env node
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
// This script has been modified from the original script provided by the MDN project
// source article: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// source code: https://raw.githubusercontent.com/mdn/express-locallibrary-tutorial/main/populatedb.js

console.log(
	'This script populates the database and tests the defined schemas for Records, Artists, and Genres. Specified database as argument - e.g.: node populatedb "connection_string"'
);

const userArgs = process.argv.slice(2);

const Record = require('./models/record');
const Artist = require('./models/artist');
const Genre = require('./models/genre');

const genres = [];
const artists = [];
const records = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await createGenres();
	await createArtists();
	await createRecords();
	console.log('Debug: Closing mongoose');

	mongoose.connection.close();
}

async function genreCreate(index, name) {
	const genre = new Genre({ name: name });
	await genre.save();
	genres[index] = genre;
	console.log(`Added genre: ${name}`);
}

async function artistCreate(index, name) {
	const artist = new Artist({ name: name });
	await artist.save();
	artists[index] = artist;
	console.log(`Added artist: ${name}`);
}

async function recordCreate(
	index,
	title,
	artist,
	label,
	cat_number,
	release_date,
	genre,
	date_acquired
) {
	const recordDetail = {
		title: title,
		artist: artist,
		date_acquired: date_acquired,
	};
	if (label !== false) recordDetail.label = label;
	if (cat_number !== false) recordDetail.cat_number = cat_number;
	if (release_date !== false) recordDetail.release_date = release_date;
	if (genre !== false) recordDetail.genre = genre;

	const record = new Record(recordDetail);
	await record.save();
	records[index] = record;
	console.log(`Added record: ${title}`);
}

async function createGenres() {
	console.log('Adding Genres...');
	await Promise.all([
		genreCreate(0, 'Rock'),
		genreCreate(1, 'Metal'),
		genreCreate(2, 'Jazz'),
		genreCreate(3, 'Country'),
		genreCreate(4, 'Alternative'),
		genreCreate(5, 'Electronic'),
		genreCreate(6, 'Hip-hop'),
		genreCreate(7, 'Avant-garde'),
	]);
}

async function createArtists() {
	console.log('Adding Artists...');
	await Promise.all([
		artistCreate(0, 'Phish'),
		artistCreate(1, 'Black Sabbath'),
		artistCreate(2, 'Swans'),
		artistCreate(3, 'Mobb Deep'),
		artistCreate(4, 'Tycho'),
		artistCreate(5, 'STS9'),
		artistCreate(6, 'MF Doom'),
		artistCreate(7, 'Electric Wizard'),
		artistCreate(8, 'Sleep'),
		artistCreate(9, 'Miles Davis'),
	]);
}

async function createRecords() {
	console.log('Adding Records...');
	await Promise.all([
		recordCreate(0, 'Junta', artists[0], 'Jemp', 'JEMP1057', '2012-04-21', [
			genres[0],
		]),
		recordCreate(
			1,
			'Story of the Ghost',
			artists[0],
			'Elektra',
			'62297-1',
			'1998-10-27',
			[genres[0]]
		),
		recordCreate(
			2,
			'Master of Reality',
			artists[1],
			'Warner Bros. Records',
			'BS 2562',
			'1971',
			[genres[1]]
		),
		recordCreate(
			3,
			'Children of God',
			artists[2],
			'Young God Records',
			'YG64',
			'2020-12-01',
			[genres[0], genres[7]]
		),
		recordCreate(
			4,
			'The Infamous',
			artists[3],
			'Loud Records',
			'07863 66480-1',
			'1995-04-25',
			[genres[6]]
		),
		recordCreate(5, 'Weather', artists[4], 'Mom + Pop', 'MP427', '2019-07-21', [
			genres[5],
		]),
		recordCreate(
			6,
			'Artifact',
			artists[5],
			'1320 Records',
			'1320-SSA006V',
			false,
			[genres[5]]
		),
		recordCreate(
			7,
			'MM..Food',
			artists[6],
			'Rhymesayers Entertainment',
			false,
			false,
			[genres[6]]
		),
		recordCreate(
			8,
			'Dopethrone',
			artists[7],
			'Rise Above Records',
			false,
			false,
			[genres[1]]
		),
		recordCreate(9, 'Dopesmoker', artists[0], false, false, false, [genres[0]]),
		recordCreate(10, 'Bitches Brew', artists[0], false, false, false, [
			genres[0],
		]),
	]);
}
