const express = require('express');
const {getUsers, 
    addUser,
     updateUser, 
    deleteUser,
    loginUser,
    getUser,
} = require('../controllers/users_controller.js');
const {protect} = require('../middleware/auth_middleware')

const router = express.Router();

router.route('/').get(getUsers).post(addUser);

router.route('/:id').put(updateUser).delete(deleteUser);

router.get('/user',protect,getUser);
router.post('/login', loginUser);

module.exports = router;

