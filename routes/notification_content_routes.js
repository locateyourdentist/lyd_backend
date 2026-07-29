const express = require('express');
const router = express.Router();
const ctrl = require('../controller/notificationContentController');
const auth = require('../middleware/auth');
const superAdminAuth = require('../middleware/superAdminAuth');

router.get('/get_notification_contents', auth, superAdminAuth, ctrl.getContents);
router.get('/get_notification_content_byId/:id', auth, superAdminAuth, ctrl.getContentById);
router.post('/create_notification_content', auth, superAdminAuth, ctrl.createContent);
router.post('/update_notification_content/:id', auth, superAdminAuth, ctrl.updateContent);
router.post('/delete_notification_content/:id', auth, superAdminAuth, ctrl.deleteContent);

module.exports = router;
