const express = require('express');
const {addOrganization, getOrganization, updateOrganization} = require('../controllers/organization_controller');
const {protect} = require('../middleware/auth_middleware');
const {checkPermission} = require('../middleware/permission_middleware');

const router = express.Router();

router.get('/', protect, checkPermission('CanViewOrganization'), getOrganization);
router.post('/', protect, checkPermission('CanCreateOrganization'), addOrganization);
router.put('/:id', protect, checkPermission('CanUpdateOrganization'), updateOrganization);

module.exports = router;