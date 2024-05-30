const { MovieCTRL } = require('../../controllers');
const multer = require('multer');
const path = require('path');

const express = require('express');
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, 'images/');
      },
      filename: function (req, file, cb) {
            cb(null, `img-${Date.now()}${path.extname(file.originalname)}`);
      }
});

const upload = multer({ storage });

router.route('/')
      .get(MovieCTRL.getAllMovies)

router.post('/create', upload.single('image'), MovieCTRL.addMovie);
router.post('/showtime/create', MovieCTRL.createShowtime);
router.get('/getShowtimes', MovieCTRL.listShowtime);

router.route('/:id')
      .get(MovieCTRL.getMovieById)
      .put(upload.single('image'), MovieCTRL.updateMovie)
      .delete(MovieCTRL.deleteMovie)

module.exports = router;