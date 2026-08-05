const express=require('express');
const router=express.Router()
const serviceController=require('../controller/serviceController')
const {upload,uploadToS3}=require('../file_uploadImage')
const auth=require('../middleware/auth')

router.post('/create_service',auth,upload.array('serviceImage',3), serviceController.createServices)
router.post('/deactivate_services',auth,serviceController.deactivateServices)
router.post('/get_service_list',serviceController.getServicesList)
router.post('/get_service_listById',serviceController.getServicesById)
router.post('/get_sale_post_list',serviceController.get_sale_post_list)
router.get('/get_sale_post_byId/:id',serviceController.get_sale_post_byId)
router.post('/create_sale_post',auth,upload.array('salePostImage', 3), serviceController.create_sale_post)


module.exports=router