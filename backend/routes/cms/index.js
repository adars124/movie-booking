const express = require('express');
const userRoute = require('./users.route');
const movieRoute = require('./movies.route');

const router = express.Router();

router.use('/users', userRoute);
router.use('/movies', movieRoute);

router.get('/user/details', (req, res, next) => {
    return res.json(req.user);
});

module.exports = router;