const express = require('express');
const router = express.Router();
const ctrl = require('../controller/whatsappTemplateController');
const auth = require('../middleware/auth');
const superAdminAuth = require('../middleware/superAdminAuth');
const { upload } = require('../file_uploadImage');

router.get('/get_whatsapp_templates', auth, superAdminAuth, ctrl.getTemplates);
router.get('/get_whatsapp_template_byId/:id', auth, superAdminAuth, ctrl.getTemplateById);
router.post('/create_whatsapp_template', auth, superAdminAuth, upload.single('whatsappTemplateMedia'), ctrl.createTemplate);
router.post('/update_whatsapp_template/:id', auth, superAdminAuth, upload.single('whatsappTemplateMedia'), ctrl.updateTemplate);
router.post('/autosave_whatsapp_template/:id', auth, superAdminAuth, ctrl.autoSaveTemplate);
router.post('/duplicate_whatsapp_template/:id', auth, superAdminAuth, ctrl.duplicateTemplate);
router.post('/delete_whatsapp_template/:id', auth, superAdminAuth, ctrl.deleteTemplate);
router.post('/submit_whatsapp_template_meta/:id', auth, superAdminAuth, ctrl.submitToMeta);
router.post('/restore_whatsapp_template_version/:id', auth, superAdminAuth, ctrl.restoreVersion);

module.exports = router;
