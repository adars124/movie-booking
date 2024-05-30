const { MovieCTRL, BookingCTRl } = require('../../controllers');

const express = require('express');
const router = express.Router();

router.get('/listMovies', MovieCTRL.getAllMovies);
router.get('/getMovieById/:id', MovieCTRL.getMovieById);
router.get('/seats/:id', BookingCTRl.fetchSeats);
router.get('/showtimes/:id', BookingCTRl.fetchShowtimes);
router.get('/user/details', (req, res, next) => {
    return res.json(req.user);
})

module.exports = router;