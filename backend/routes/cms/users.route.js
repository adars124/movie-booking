const { UserCTRL } = require('../../controllers');

const express = require('express');
const router = express.Router();

router.route('/')
      .get(UserCTRL.getAllUsers)


router.post('/create', UserCTRL.addUser)

router.route('/:id')
      .get(UserCTRL.getUserById)
      .put(UserCTRL.updateUser)
      .patch(UserCTRL.updateUser)
      .delete(UserCTRL.deleteUser)

module.exports = router;