const express = require('express');
const {addLeave,
    getUserLeaves, 
    updateLeave,
     getLeaves,
      deleteLeave,
      getLeaveRequest
    }
 = require('../controllers/leaves_controller');
const {protect} = require('../middleware/auth_middleware');
const {checkPermission} = require('../middleware/permission_middleware');

const router = express.Router();

router.get('/leave_requests',protect, checkPermission('CanViewLeavesRequest'), getLeaveRequest)
router.get('/:id?',protect, checkPermission('CanViewLeaves'), getLeaves)
router.post('/',protect, checkPermission('CanCreateLeave'), addLeave);
router.route('/:id').put(protect, checkPermission('CanUpdateLeave'), updateLeave).
delete(protect, checkPermission('CanDeleteLeave'), deleteLeave);
router.get('/user/:id',protect, checkPermission('CanViewUserLeaves'), getUserLeaves)


module.exports = router;
