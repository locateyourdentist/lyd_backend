const express=require('express');
const router=express.Router();
const userController=require('../controller/userController')
//const upload =require('../file_uploadImage')
const auth=require('../middleware/auth')
require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const { upload,uploadToS3 } = require("../file_uploadImage");


router.post('/get_user_details',userController.getAllUserDetails)
//router.post('/user_register',  upload.fields([{ name: 'image', maxCount: 3 }, {name: 'certificates', maxCount: 3 },{name: 'logoImage', maxCount: 1 } ]), userController.userRegister);
router.post('/user_register',  upload.any(), userController.userRegister);
router.post('/delete_awsFile',userController.deleteAwsfile)
router.post('/login_user',userController.loginUser)
router.post('/switch_user',userController.switchUser)

router.post('/verifyRegistrationOtp',userController.verifyRegistrationOtp)
router.post('/resendRegistrationOtp',userController.resendRegistrationOtp)
router.post('/change_appLogo',auth,upload.single('appLogo'),userController.changeAppLogo)
router.get('/get_appLogo',userController.getAppLogo)

router.post('/get_all_branches',userController.getAllBranches)
router.post('/change_password',userController.changePassword)
router.post('/forgot_password',userController.forgotPassword)
router.post('/forgotChangePassword',userController.forgotChangePassword)
router.post('/verify_password',userController.verifyOtp)

router.post('/get_user_byId',userController.getUserbyId)
router.post("/upload_profileImage",upload.single('profileImages'),userController.uploadProfileImage)
router.post("/deactivate_user",userController.deactivateUser)
router.post('/create_email',userController.create_email)
router.post('/plan_email',userController.plan_email)
router.post('/job_email',userController.job_email)
router.post('/uploadImages', upload.single('posterImages'),userController.postImagesAdmin)
router.post('/get_upload_images',userController.getUploadImages)
router.post('/save_fcm_token',userController.saveFcmToken)


module.exports=router;