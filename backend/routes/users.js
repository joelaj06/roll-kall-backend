const express = require('express');
const {getUsers, addUser, updateUser, deleteUser} = require('../controllers/users_controller.js')

const router = express.Router();

router.route('/').get(getUsers).post(addUser);

router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;

