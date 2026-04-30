const express=require('express');
const app=express();
const router=express.Router();
const jobController=require('../controller/jobController')
router.use(express.json()); 
const auth=require('../middleware/auth')
const {upload,uploadToS3}=require('../file_uploadImage')

router.post('/createJobAdmin',upload.single('jobImage'),jobController.createEditJobs)
router.get('/viewJobsAdminList',auth,jobController.viewJobsAdminList)
router.post('/viewJobSeekerList',jobController.viewJobSeekerList)
router.post('/deactivate_job',auth,jobController.deactivateJobs)
router.post('/createWebinarAdmin',upload.single('webinarImage'),jobController.createEditWebinars)
router.post('/viewWebinarListJobseekers',jobController.viewWebinarListJobseekers)
router.get('/viewWebinarAdminList',auth,jobController.viewWebinarAdminList)
router.post('/applyJobs_JobSeekers',auth,jobController.applyJobs)
router.post('/JobSeekers_apply_jobList',auth,jobController.viewJobSeekerApplyList)
router.get('/getJobById/:jobId',jobController.getJobById)
router.post('/getWebinarById',jobController.getwebinarById)
router.post('/getJobById_ApplicationList',auth,jobController.getJobByIdApplicationList)
router.post('/getWebinarById_ApplicationList',auth,jobController.getWebinarByIdApplicationList)
router.post('/applyWebinar_JobSeekers',auth,jobController.applyWebinars)
router.post('/update_status_Jobs',auth,jobController.updateJobStatus)
router.post('/updateApplication_Status',auth,jobController.updateApplicationStatus)
router.post('/updateWebinarStatus',auth,jobController.updateWebinarStatus)

router.post('/create_job_category',auth,jobController.addJobCategory)
router.post('/get_job_category',jobController.getJobCategories)
router.post('/update_job_category',auth,jobController.updateJobCategory)
router.post('/delete_job_category',auth,jobController.deleteJobCategory)



module.exports=router;