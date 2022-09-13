const express = require('express');
const {protect} = require('../middleware/auth_middleware');
const {checkPermission} = require('../middleware/permission_middleware')
const {getTeams, addTeam, updateTeam, deleteTeam} = require('../controllers/teams_controller')

const router = express.Router();

router.post('/',protect, checkPermission('CanCreateTeam'), addTeam);
router.get('/:id?', protect, checkPermission('CanViewTeams'),getTeams);
router.route('/:id').put(protect, checkPermission('CanUpdateTeam'), updateTeam)
.delete(protect, checkPermission('CanDeleteTeam'), deleteTeam);


module.exports = router;