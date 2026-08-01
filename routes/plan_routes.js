const express=require('express')
const app=express();
const router=express.Router();
const auth=require('../middleware/auth')
const planController=require('../controller/plan_controller')


router.post('/create_plan',auth,planController.createPlan)
router.post('/create_addons_plan',auth,planController.addonsPlanCreate)
router.post('/create_job_plan',auth,planController.createJobPlan)
router.post('/create_webinar_plan',auth,planController.createWebinarPlan)
router.post('/create_poster_image_plan',auth,planController.createPostImagePlan)

router.post('/delete_plan',auth,planController.deletePlan)
router.post('/delete_addOnsPlan',auth,planController.deleteAddOnsPlan)
router.post('/delete_jobPlan',auth,planController.deleteJobPlan)

router.post('/get_PlanDetails',auth,planController.getPlanDetails)
router.post('/get_addOnsPlanDetails',auth,planController.getAddOnsPlanDetails)
router.post('/get_jobPlanDetails',auth,planController.getJobPlanDetails)
router.post('/get_webinarPlanDetails',auth,planController.getWebinarPlanDetails)
router.post('/get_postImagePlanDetails',auth,planController.getPosterImagePlanDetails)

router.post('/create_userPlan',planController.createUserPlan)
router.post('/create_addOnsUserPlan',auth,planController.createAddOnsUserPlan)
router.post('/create_JobUserPlan',auth,planController.createJobUserPlan)
router.post('/create_WebinarUserPlan',auth,planController.createWebinarUserPlan)
router.post('/create_posterImageUserPlan',auth,planController.createPosterImageUserPlan)
//router.post('/post_gst_details',auth,planController.gstDetails)

router.post('/check_planStatus',auth,planController.checkPlanStatus)
router.post('/getJobCountByUserId',auth,planController.getJobCounts)
router.post('/getPosterQuotaByUserId',auth,planController.getPosterQuotaByUserId)
router.post('/calculateIncome',auth,planController.calculateIncome_admin)

router.post('/add_expenses',auth,planController.addExpenses)
router.post('/get_expenses',auth,planController.getExpenses)
router.post('/update_expenses',auth,planController.updateExpenses)
router.post('/delete_expenses',auth,planController.deleteExpenses)

router.post('/getCompany_details',planController.getCompanyDetails);
router.post('/update_Company_details',auth,planController.updateCompany);
router.post('/update_gst_details',auth,planController.updateGst);
router.post('/getGst_details',auth,planController.getGst);

router.post('/calculate_tax',auth,planController.calculateTax);
router.post('/createInvoice', auth,planController.createInvoice);
router.get('/getInvoices',auth,planController. getInvoices);
router.get('/invoiceId',auth,planController.getInvoiceById);


module.exports=router;