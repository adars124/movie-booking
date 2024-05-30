const cmsRoute = require('./cms');
const bookingRoute = require('./booking');
const commonRoute = require('./common');
const { LoginCTRL } = require('../controllers');
const { auth, isLoggedIn } = require('../lib');
const express = require('express');

const router = express.Router();

router.use('/cms', auth, cmsRoute);
router.use('/common', commonRoute);

//TODO: add the isLoggedIn function here as the middleware (in booking)
router.use('/booking', isLoggedIn, bookingRoute);
router.post('/register', LoginCTRL.createUser);
router.post('/login', LoginCTRL.check);

router.get('/images/:filename', (req, res, next) => {
    res.sendFile(`images/${req.params.filename}`, { root: './' })
});

module.exports = router;