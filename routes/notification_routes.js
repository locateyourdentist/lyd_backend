const express=require('express')
const app=express();
const router=express.Router();
const notificationController=require('../controller/notificationController')
const auth=require('../middleware/auth')
const {upload}=require('../file_uploadImage')
const Location = require("../model/state_district_model");

router.post('/create_notification',upload.single('notificationImage'),notificationController.createNotification)
router.get('/get_notification',auth,notificationController.getNotification)
router.get("/update_notification",auth,notificationController.updateNotification)
router.get('/get_indian_states',notificationController.getstates)
router.post('/districts',notificationController.getdistrict)
router.post('/subdistricts',notificationController.getsubdistricts)
router.post('/villages',notificationController.getvillages)

module.exports=router;