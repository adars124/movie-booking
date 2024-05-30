const { showError } = require('../lib');
const pool = require('../db');
const { formatDate } = require('../lib');
const { unlinkSync } = require('node:fs');

class MovieController {
    // READ
    getAllMovies = async (req, res, next) => {
        try {
            const sql = "SELECT * FROM movies ORDER BY title";
            const movies = await pool.query(sql);

            return res.status(200).json({
                message: "OK",
                movies: movies.rows
            }); unlinkSync
        } catch (err) {
            showError(err, next);
        }
    };

    // CREATE
    addMovie = async (req, res, next) => {
        const client = await pool.connect();
        try {
            const { title, description, genre, status, featured, released_date } = req.body;

            if (!title || !description || !genre || !status || !featured || !released_date) {
                return res.status(422).json({
                    message: "Fields cannot be empty!"
                });
            }
            const img = req.file ? req.file.filename : '';

            const sql = "INSERT INTO movies (title, description, poster_url, genre, status, featured, released_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
            const query = await client.query(sql, [title, description, img, genre, status, featured, released_date]);

            if (query.rows.length !== 0) {
                return res.status(201).json({
                    message: "Movie added successfully!",
                    movie: query.rows[0]
                });
            } else {
                throw Error('Error while adding movie!');
            }

        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        } finally {
            client.release();
        }
    }

    // UPDATE
    updateMovie = async (req, res, next) => {
        try {
            const movie_id = req.params.id;
            const { title, description, genre, status, featured, released_date } = req.body;

            if (!title || !description || !genre || !status || !featured || !released_date) {
                return res.status(422).json({
                    message: "Fields cannot be empty!"
                });
            }

            const check = "SELECT * FROM movies WHERE movie_id = ($1)";
            const found = await pool.query(check, [movie_id]);

            if (found.rowCount === 1 && found.rows.length !== 0) {
                let img;

                if (req.file) {
                    img = req.file.filename;
                    if (found.rows[0].poster_url.length) {
                        console.log('here');
                        unlinkSync(`images/${found.rows[0].poster_url}`);
                    }
                } else {
                    img = found.rows[0].poster_url;
                }

                const sql = "UPDATE movies SET title = ($1), description = ($2), genre = ($3), poster_url = ($4), status = ($5), featured = ($6), released_date = ($7) WHERE movie_id = ($8) RETURNING *";
                const query = await pool.query(sql, [title, description, genre, img, status, featured, released_date, movie_id]);

                if (query.rows.length !== 0) {
                    return res.status(201).json({
                        message: "Movie updated successfully!",
                        movie: query.rows[0]
                    });
                }
            } else {
                return res.status(404).json({
                    message: "Movie not found!"
                });
            }

            return res.status(404).json({
                message: "Movie not found with associated ID!"
            });
        } catch (err) {
            showError(err, next);
        }
    }

    // READ by ID
    getMovieById = async (req, res, next) => {
        try {
            const movie_id = req.params.id;

            const sql = "SELECT * FROM movies WHERE movie_id = ($1)";
            const data = await pool.query(sql, [movie_id]);

            if (data.rowCount == 1 && data.rows.length !== 0) {
                return res.status(200).json({
                    message: "OK",
                    movie: data.rows
                });
            }

            return res.status(404).json({
                message: "Movie not found with associated ID!"
            });
        } catch (err) {
            showError(err, next);
        }
    }

    // DELETE
    deleteMovie = async (req, res, next) => {
        try {

            const movie_id = req.params.id;
            const query = await pool.query("SELECT * FROM movies WHERE movie_id = ($1)", [movie_id]);

            if (query.rows.length !== 0) {
                const img = query.rows[0].poster_url;
                unlinkSync(`images/${img}`);
            }

            const sql = "DELETE FROM movies WHERE movie_id = ($1)";
            const data = await pool.query(sql, [movie_id]);

            if (data.rowCount === 1) {
                return res.json({
                    message: "Movie deleted successfully!"
                });
            }

            return res.status(404).json({
                message: "Movie not found with associated ID!"
            });

        } catch (err) {
            showError(err, next);
        }
    }

    // CREATE SHOWTIME
    createShowtime = async (req, res, next) => {
        const client = await pool.connect();
        try {
            const { movie_id, start_time } = req.body;

            if (!movie_id || !start_time) {
                return res.status(422).json({
                    message: 'Fields cannot be empty!'
                });
            }

            const time = formatDate(start_time);

            await client.query("BEGIN");

            const sql = "INSERT INTO showtimes (movie_id, start_time) VALUES ($1, $2) RETURNING *";
            const query = await client.query(sql, [movie_id, time]);

            if (query.rows.length !== 0) {
                const seats = "INSERT INTO seats (showtime_id, seat_number) VALUES ($1, generate_series(1, 20)) RETURNING *";
                const addedSeats = await client.query(seats, [query.rows[0].showtime_id]);

                if (addedSeats.rows.length !== 0) {
                    await client.query("COMMIT");
                    return res.status(201).json({
                        message: 'Showtime successfully created!',
                        showtime: query.rows[0]
                    })
                } else {
                    throw Error('Error generating seats for the showtime!');
                }
            } else {
                throw Error('Error while adding showtime!');
            }

        } catch (err) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                message: err.message
            });
        } finally {
            client.release();
        }
    }

    // LIST SHOWTIME
    listShowtime = async (req, res, next) => {
        try {
            const sql = "SELECT * FROM showtimes";
            const data = await pool.query(sql);

            if (data.rowCount == 1 && data.rows.length !== 0) {
                return res.status(200).json({
                    message: "OK",
                    showtimes: data.rows
                });
            }

            return res.status(404).json({
                message: "Showtime could not be fetched!"
            });
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }
};

module.exports = new MovieController;