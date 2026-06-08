const express=require('express')
const mongoose=require('mongoose')
const planModel=require('../model/plan_model')
const userPlanModel=require('../model/plan_user_model')
const planIdModel=require('../model/planId_model')
const addOnsIdModel=require('../model/addons_id_model')
const addOnsModel=require('../model/add_ons_filter')
const addOnsUserModel=require('../model/addOns_user_model')
const userModel=require('../model/user')
const jobPlanIdModel=require('../model/job_plan_id')
const jobPlanModel=require('../model/job_plan_model')
const jobPlanUserModel=require('../model/job_plan_user_model')
const jobModel = require('../model/jobModel')
const webinarPlanIdModel=require('../model/webinarIdModel')
const webinarPlanModel=require('../model/webinar_plan_model')
const postImagesIdmodel=require('../model/post_images_plad_id_model')
const postImagesmodel=require('../model/postImagesModel')
const webinarPlanuserModel=require('../model/webinarPlan_userModel')
const postImagesuserModel=require('../model/post_images_user_model')
const expenseModel=require('../model/expenses')
const companyModel=require('../model/address_company')
const addGstModel=require('../model/add_gst_details_state')
//const Company = mongoose.model('Company'); 
const taxModel=require('../model/tax_company_model')
const Invoice = require("../model/invoice_model");
const InvoiceIds=require('../model/invoiceId_model')

exports.createPlan=async(req,res)=>{
    const{planId,userType,planName,duration,details,price,features}=req.body;
try{
if(!planId||!userType||!planName||!duration||!details||!price||!features){
    return res.send({status:"error",message:"missing fields"})
}

if(planId=="0"||planId==0){
const newPlanIdObj = await planIdModel.findOneAndUpdate(
{ id: "planId" },{ $inc: { planId: 1 } },{ upsert: true, new: true });

const planCreate=new planModel({planId:newPlanIdObj.planId,userType,planName,duration,details,price,features})
const savePlan=await planCreate.save();
return res.send({status:"success",data:savePlan})
}
else{
const updateFields = {};
if (planId) updateFields.planId = planId;
if(userType) updateFields.userType=userType;
if (planName) updateFields.planName = planName;
if (duration) updateFields.duration=duration;
if (details) updateFields.details = details;
if(price) updateFields.price=price;
if(features) updateFields.features=features;
updateFields.updatedDate = new Date;

const updatedUser = await planModel.findOneAndUpdate({ planId }, { $set: updateFields }, { new: true });
return res.json({ status: "success", message: "plan updated successfully", data: updatedUser });
 }
}
catch(error){
return res.send({status:"error",message:`plan not created${error.message}`})
}
}

exports.addonsPlanCreate=async(req,res)=>{
const{addOnsPlanId,userType,price,addOnsPlanName,duration,details,features}=req.body;
try{
    if(!addOnsPlanId||!userType||!addOnsPlanName||!duration||!details||!features||!price){
    return res.send({status:"error",message:"missing fields"})
}

if(addOnsPlanId=="0"||addOnsPlanId==0){
const addOnsIds = await addOnsIdModel.findOneAndUpdate(
{ id: "addOnsPlanId" },{ $inc: { addOnsPlanId: 1 } },{ upsert: true, new: true });

const planCreate=new addOnsModel({addOnsPlanId:addOnsIds.addOnsPlanId,userType:userType,addOnsPlanName,duration,details,features,price})
const savePlan=await planCreate.save();
return res.send({status:"success",data:savePlan})
}
else{
const updateFields = {};
if (addOnsPlanId) updateFields.addOnsPlanId = addOnsPlanId;
if(price) updateFields.price=price;
if(userType) updateFields.userType=userType;
if (addOnsPlanName) updateFields.addOnsPlanName = addOnsPlanName;
if (duration) updateFields.duration=duration;
if (details) updateFields.details = details;
if (features) updateFields.features = features;
updateFields.updatedDate = new Date;

const updatedUser = await addOnsModel.findOneAndUpdate({ addOnsPlanId }, { $set: updateFields }, { new: true });
return res.json({ status: "success", message: "plan updated successfully", data: updatedUser });
 }
}
catch(error){
return res.send({status:"error",message:`plan not created${error.message}`})
}
}

exports.createJobPlan=async(req,res)=>{
const{jobPlansId,userType,jobPlanName,price,count,duration,details,features}=req.body;
try{
    if(!jobPlansId||!userType||!jobPlanName||!count||!duration||!details||!features||!price){
    return res.send({status:"error",message:"missing fields"})
}

if(jobPlansId=="0"||jobPlansId==0){
const jobPlanId = await jobPlanIdModel.findOneAndUpdate(
{ id: "jobPlansId" },{ $inc: { jobPlansId: 1 } },{ upsert: true, new: true });

const planCreate=new jobPlanModel({jobPlansId:jobPlanId.jobPlansId,userType,jobPlanName,duration:duration,details,features,price,count})
const savePlan=await planCreate.save();
return res.send({status:"success",data:savePlan})
}
else{
const updateFields = {};
if (jobPlansId) updateFields.jobPlansId = jobPlansId;
if(userType) updateFields.userType=userType;
if (jobPlanName) updateFields.jobPlanName = jobPlanName;
if (price) updateFields.price=price;
if (count) updateFields.count = count;
if (duration) updateFields.duration=duration;
if (details) updateFields.details = details;
if (features) updateFields.features = features;
updateFields.updatedDate = new Date;

const updatedUser = await jobPlanModel.findOneAndUpdate({ jobPlansId }, { $set: updateFields }, { new: true });
return res.json({ status: "success", message: "plan updated successfully", data: updatedUser });
 }
}
catch(error){
return res.send({status:"error",message:`plan not created${error.message}`})
}
}

exports.createWebinarPlan=async(req,res)=>{
const{webinarPlanId,userType,webinarPlanName,price,duration,details}=req.body;
try{
   if (webinarPlanId === undefined||!userType ||!webinarPlanName ||!price || !duration ||!details ) 
{
  return res.send({status: "error", message: "Missing fields"});
}
if(webinarPlanId=="0"||webinarPlanId==0){
const counter = await webinarPlanIdModel.findOneAndUpdate(
  { id: "webinarPlanId" },
  { $inc: { webinarPlanId: 1 } },
  { upsert: true, new: true }
);
console.log(counter.webinarPlanId)
const planCreate=new webinarPlanModel({webinarPlanId:counter.webinarPlanId,userType,webinarPlanName,duration:duration,details,price})
const savePlan=await planCreate.save();
return res.send({status:"success",data:savePlan})
}
else{
const updateFields = {};
if (webinarPlanId) updateFields.webinarPlanId = webinarPlanId;
if (userType) updateFields.userType=userType;
if (webinarPlanName) updateFields.webinarPlanName = webinarPlanName;
if (price) updateFields.price=price;
if (duration) updateFields.duration=duration;
if (details) updateFields.details = details;
// if (features) updateFields.features = features;
updateFields.updatedDate = new Date;
const updatedUser = await webinarPlanModel.findOneAndUpdate({ webinarPlanId }, { $set: updateFields }, { new: true });
return res.json({ status: "success", message: "plan updated successfully", data: updatedUser });
}
}
catch(error){
return res.send({status:"error",message:`plan not created${error.message}`})
}
}

exports.createPostImagePlan=async(req,res)=>{
const{postImagesPlanId,userType,postPlanName,price,duration,details,features}=req.body;
try{
    if(  postImagesPlanId === undefined ||!userType||!postPlanName||!duration||!price){
    return res.send({status:"error",message:"missing fields"})
}
if(postImagesPlanId=="0"||postImagesPlanId==0){
const postImagesPlansId = await postImagesIdmodel.findOneAndUpdate(
{ id: "postImagesId" },{ $inc: { postImagesId: 1 } },{ upsert: true, new: true });

const planCreate=new postImagesmodel({postImagesPlanId:postImagesPlansId.postImagesId,userType,postPlanName,duration:duration,details,features,price})
const savePlan=await planCreate.save();
return res.send({status:"success",data:savePlan})
}
else{
const updateFields = {};
if (postImagesPlanId) updateFields.postImagesPlanId = postImagesPlanId;
if (userType) updateFields.userType=userType;
if (postPlanName) updateFields.postPlanName = postPlanName;
if (price) updateFields.price=price;
if (duration) updateFields.duration=duration;
if (details) updateFields.details = details;
if (features) updateFields.features = features;
updateFields.updatedDate = new Date;
const updatedUser = await postImagesmodel.findOneAndUpdate({ postImagesPlanId }, { $set: updateFields }, { new: true });
return res.json({ status: "success", message: "plan updated successfully", data: updatedUser });
}
}
catch(error){
return res.send({status:"error",message:`plan not created${error.message}`})
}
}

exports.deletePlan = async (req, res) => {
try {
const { planId } = req.body; 

if (!planId) {
return res.send({ status: "error", message: "missing field" });
}
const deletePlans = await planModel.findOneAndUpdate({ planId}, {isActive: false });
 if (!deletePlans || deletePlans.length === 0) {
 return res.send({ status: "error", message: "no active plan found" });
}
return res.send({ status: "success", data: deletePlans });
} catch (error) {
console.error(error);
return res.send({ status: "error", message: "plan error", error: error.message });
}
};

exports.deleteJobPlan = async (req, res) => {
try {
const { jobPlansId } = req.body; 

if (!jobPlansId) {
return res.send({ status: "error", message: "missing field" });
}
const deletePlans = await jobPlanModel.findOneAndUpdate({ jobPlansId}, {isActive: false });
 if (!deletePlans || deletePlans.length === 0) {
 return res.send({ status: "error", message: "no active plan found" });
}
return res.send({ status: "success", data: deletePlans });
} catch (error) {
console.error(error);
return res.send({ status: "error", message: "plan error", error: error.message });
}
};

exports.deleteAddOnsPlan = async (req, res) => {
try {
const { addOnsId } = req.body; 

if (!addOnsId) {
return res.send({ status: "error", message: "missing field" });
}
const deletePlans = await addOnsModel.findOneAndUpdate({ addOnsId}, {isActive: false });
 if (!deletePlans || deletePlans.length === 0) {
 return res.send({ status: "error", message: "no active plan found" });
}
return res.send({ status: "success", data: deletePlans });
} catch (error) {
console.error(error);
return res.send({ status: "error", message: "plan error", error: error.message });
}
};

exports.getPlanDetails=async(req,res)=>{  
  const{userType}=req.body;
try{
const getPlans=await planModel.find({userType:userType,isActive:true})
if(!getPlans){
return res.send({status:"error",message:"no plans found"})
}
else{
return res.send({status:"success",data:getPlans})
}
}
catch(error){
return res.send({status:"error",message:"no plans found"})
}
}

exports.getAddOnsPlanDetails=async(req,res)=>{
    const{userType}=req.body;
try{
const getPlans=await addOnsModel.find({userType:userType,isActive:true})
if(!getPlans){
return res.send({status:"error",message:"no plans found"})
}
else{
return res.send({status:"success",data:getPlans})
}
}
catch(error){
return res.send({status:"error",message:"no plans found"})
}
}

exports.getJobPlanDetails=async(req,res)=>{
    const{userType}=req.body;
try{
const getPlans=await jobPlanModel.find({userType:userType,isActive:true})
console.log(`JOB LENGTH${getPlans.length}`)
if(!getPlans){
return res.send({status:"error",message:"no plans found"})
}
else{
return res.send({status:"success",data:getPlans})
}
}
catch(error){
return res.send({status:"error",message:"no plans found"})
}
}

exports.getWebinarPlanDetails=async(req,res)=>{
const{userType}=req.body;
try{
const getPlans=await webinarPlanModel.find({userType:userType,isActive:true})
if(!getPlans){
return res.send({status:"error",message:"no plans found"})
}
else{
return res.send({status:"success",data:getPlans})
}
}
catch(error){
return res.send({status:"error",message:"no plans found"})
}
}
exports.getPosterImagePlanDetails=async(req,res)=>{
const{userType}=req.body;
try{
const getPlans=await postImagesmodel.find({userType:userType,isActive:true})
if(!getPlans){
return res.send({status:"error",message:"no plans found"})
}
else{
return res.send({status:"success",data:getPlans})
}
}
catch(error){
return res.send({status:"error",message:"no plans found"})
}
}

exports.createUserPlan=async(req,res)=>{
    const{userId,planId,planName,price,startDate,endDate, imageCount, imageSize, videoCount, videoSize}=req.body;
try{
  if(!userId||!planId||!planName||!startDate||!endDate||imageCount||imageSize||videoCount||videoSize){
  return res.send({status:"error",message:"missing fields"})
  }
const checkAlreadyPlan=await  userPlanModel.findOneAndUpdate({userId:userId}, { $set: { isActive: false } },
  { new: true })

// console.log(`ls${checkAlreadyPlan}`)
// if(checkAlreadyPlan.length>0){
// return res.send({status:"error",message:"you are plan already activated"})
// }

//else{
const newPlanIdObj = await planIdModel.findOneAndUpdate(
{ id1: "planUserId" },{ $inc: { planUserId: 1 } },{ upsert: true, new: true });
console.log(newPlanIdObj.planUserId)

const planCreate=new userPlanModel({userId,planUserId:newPlanIdObj.planUserId,planId,planName,startDate,endDate,price:price,imageCount:imageCount, imageSize:imageSize, videoCount:videoCount, videoSize:videoSize})
const savePlan=await planCreate.save();
const checkPlanIdExists=await planModel.findOne({planId:planId,isActive:true})
console.log(checkPlanIdExists.details)
 await userModel.findOneAndUpdate(
  { userId: userId, isActive: true },
  {
    $set: {
      "details.plan.basePlan.details": checkPlanIdExists.details||"",
      "details.plan.basePlan.isActive": true,
      "details.plan.basePlan.startDate": startDate,
      "details.plan.basePlan.endDate": endDate,
      "details.plan.basePlan.name": planName,
      "details.plan.basePlan.imageCount": imageCount,
      "details.plan.basePlan.imageSize": imageSize,
      "details.plan.basePlan.videoCount": videoCount,
      "details.plan.basePlan.videoSize": videoSize
 }
  },
  { new: true }
);
if(!planCreate){
    return res.send({status:"error",message:"plan not created"})
}
return res.send({status:"success",data:savePlan})
}
//}
catch(error){
return res.send({status:"error",message:`plan not created ${error.message}`})
}
}

exports.createAddOnsUserPlan=async(req,res)=>{
//const{userId,planId,addOnsPlanId,addOnsPlanName,startDate,endDate}=req.body;
const{userId,addOnsPlanId,addOnsPlanName,price,startDate,endDate}=req.body;
try{
if(!userId||!addOnsPlanId||!addOnsPlanName|| !startDate||!endDate){
    return res.send({status:"error",message:"missing fields"})
}
// const checkBasePlanActive=await userPlanModel.find({userId:userId,isActive:true})
// if(checkBasePlanActive.length==0){
//   return res.send({status:"error",message:"your base plan is not activated.please buy plan"})
// }
const checkAlreadyPlan=await  addOnsUserModel.findOneAndUpdate({userId:userId}, { $set: { isActive: false } },
  { new: true })
// console.log(`ls${checkAlreadyPlan}`)
// if(checkAlreadyPlan.length>0){
// return res.send({status:"error",message:"you are plan already activated"})
// }
//else{
const newPlanIdObj = await addOnsIdModel.findOneAndUpdate(
{ id1: "addOnsUserId" },{ $inc: { addOnsUserId: 1 } },{ upsert: true, new: true });
console.log(newPlanIdObj.addOnsUserId)

const planCreate=new addOnsUserModel({userId,addOnsPlanId,addOnsUserId:newPlanIdObj.addOnsUserId,addOnsPlanName,startDate,endDate,price:price})
const savePlan=await planCreate.save();
//const user=await userModel.findOneAndUpdate({userId:userId},{$set:{details:details}})
const checkPlanIdExists=await addOnsModel.findOne({addOnsPlanId:addOnsPlanId,isActive:true})
console.log(checkPlanIdExists.details)
await userModel.findOneAndUpdate(
  { userId: userId, isActive: true },
  {
    $set: {
      "details.plan.addonsPlan.details": checkPlanIdExists.details,
      "details.plan.addonsPlan.isActive": true,
      "details.plan.addonsPlan.startDate": startDate,
      "details.plan.addonsPlan.endDate": endDate,
      "details.plan.addonsPlan.name": addOnsPlanName
 }
  },
  { new: true }
);
if(!planCreate){
    return res.send({status:"error",message:"plan not created"})
}
return res.send({status:"success",data:savePlan})
//}
}
catch(error){
return res.send({status:"error",message:`plan not created ${error.message}`})
}
}

exports.createJobUserPlan=async(req,res)=>{
    const{userId,jobPlansId,jobPlansName,price,startDate,endDate}=req.body;
try{
if(!userId||!jobPlansId||!jobPlansName||!startDate||!endDate||!price){
    return res.send({status:"error",message:"missing fields"})
}

// const checkBasePlanActive=await userPlanModel.find({userId:userId,isActive:true})
// if(checkBasePlanActive.length==0){
//   return res.send({status:"error",message:"your base plan is not activated.please buy plan"})
// }
const checkAlreadyPlan=await  jobPlanUserModel.findOneAndUpdate({userId:userId}, { $set: { isActive: false } },
  { new: true })
// console.log(`ls${checkAlreadyPlan}`)
// if(checkAlreadyPlan.length>0){
// return res.send({status:"error",message:"you are plan already activated"})
// }
//else{
const newPlanIdObj = await jobPlanIdModel.findOneAndUpdate(
{ id1: "jobPlansUserId" },{ $inc: { jobPlansUserId: 1 } },{ upsert: true, new: true });
console.log(newPlanIdObj.jobPlansUserId)
const planCreate=new jobPlanUserModel({userId,jobPlansId,jobPlansUserId:newPlanIdObj.jobPlansUserId,jobPlansName,startDate,endDate,price:price})
const savePlan=await planCreate.save();
const checkPlanIdExists=await jobPlanModel.findOne({jobPlansId:jobPlansId,isActive:true})
console.log(checkPlanIdExists)
await userModel.findOneAndUpdate(
  { userId: userId, isActive: true },
  {
    $set: {
      "details.plan.jobPlan.details": checkPlanIdExists.details,
      "details.plan.jobPlan.isActive": true,
      "details.plan.jobPlan.count": checkPlanIdExists.count,
      "details.plan.jobPlan.startDate": startDate,
      "details.plan.jobPlan.endDate": endDate,
      "details.plan.jobPlan.name": jobPlansName,

}
  },
  { new: true }
);
//const user=await userModel.findOneAndUpdate({userId:userId},{$set:{details:details}})

if(!savePlan){
    return res.send({status:"error",message:"plan not activated"})
}
return res.send({status:"success",data:savePlan})
//}
}
catch(error){
return res.send({status:"error",message:`plan not created ${error.message}`})
}
}
exports.createWebinarUserPlan=async(req,res)=>{
const{userId,webinarPlanId,webinarUserPlansName,price,startDate,endDate}=req.body;
try{
if(!userId||!webinarPlanId||!webinarUserPlansName||!startDate||!endDate||!price){
    return res.send({status:"error",message:"missing fields"})
}

// const checkPlanActive=await userPlanModel.find({userId:userId,isActive:true})
// if(checkPlanActive.length==0){
//   return res.send({status:"error",message:"your plan is not activated.please buy plan"})
// }
const checkAlreadyPlan=await  webinarPlanuserModel.findOneAndUpdate({userId:userId}, { $set: { isActive: false } },
  { new: true })
//console.log(`ls${checkAlreadyPlan}`)
// if(checkAlreadyPlan.length>0){
// return res.send({status:"error",message:"you are plan already activated"})
// }
//else{
const newPlanIdObj = await webinarPlanIdModel.findOneAndUpdate(
{ id1: "webinarPlanUserId" },{ $inc: { webinarPlanUserId: 1 } },{ upsert: true, new: true });
console.log(newPlanIdObj.webinarPlanUserId)
const planCreate=new webinarPlanuserModel({userId,webinarPlanUserId:newPlanIdObj.webinarPlanUserId,webinarUserPlansName,startDate,endDate,price:price})
const savePlan=await planCreate.save();
const checkPlanIdExists=await webinarPlanModel.findOne({webinarPlanId:webinarPlanId,isActive:true})
console.log(checkPlanIdExists)
await userModel.findOneAndUpdate(
  { userId: userId, isActive: true },
  {
    $set: {
      "details.plan.webinarPlan.details": checkPlanIdExists.details,
      "details.plan.webinarPlan.isActive": true,
      // "details.plan.webinarPlan.count": checkPlanIdExists.count,
      "details.plan.webinarPlan.startDate": startDate,
      "details.plan.webinarPlan.endDate": endDate,
      "details.plan.webinarPlan.name": webinarUserPlansName,
} },
  { new: true }
);
//const user=await userModel.findOneAndUpdate({userId:userId},{$set:{details:details}})
if(!planCreate){
 return res.send({status:"error",message:"plan not activated"})
}
return res.send({status:"success",data:savePlan})
//}
}
catch(error){
return res.send({status:"error",message:`plan not created ${error.message}`})
}
}

exports.createPosterImageUserPlan=async(req,res)=>{
const{userId,postImagesPlanId,postPlanName,price,startDate,endDate}=req.body;
try{
if(!userId||!postImagesPlanId||!postPlanName||!startDate||!endDate){
    return res.send({status:"error",message:"missing fields"})
}
// const checkPlanActive=await userPlanModel.find({userId:userId,isActive:true})
// if(checkPlanActive.length==0){
//   return res.send({status:"error",message:"your base plan is not activated.please buy plan"})
// }
const checkAlreadyPlan=await  postImagesuserModel.findOneAndUpdate({userId:userId}, { $set: { isActive: false } },
  { new: true })
//console.log(`ls${checkAlreadyPlan}`)
// if(checkAlreadyPlan.length>0){
// return res.send({status:"error",message:"you are plan already activated"})
// }
//else{
const newPlanIdObj = await postImagesIdmodel.findOneAndUpdate(
{ id1: "postImageUserId" },{ $inc: { postImageUserId: 1 } },{ upsert: true, new: true });
console.log(newPlanIdObj.postImageUserId)
const planCreate=new postImagesuserModel({userId,postImagesPlanId,
  // postImagesPlanUserId:newPlanIdObj.postImageUserId,
  postImageUserId: newPlanIdObj.postImageUserId, 
  postPlanName,startDate,endDate,price:price})
const savePlan=await planCreate.save();
const checkPlanIdExists=await postImagesmodel.findOne({postImagesPlanId:postImagesPlanId,isActive:true})
console.log(checkPlanIdExists)
await userModel.findOneAndUpdate(
  { userId: userId, isActive: true },
  {
    $set: {
      "details.plan.posterPlan.details": checkPlanIdExists.details,
      "details.plan.posterPlan.isActive": true,
      // "details.plan.webinarPlan.count": checkPlanIdExists.count,
      "details.plan.posterPlan.startDate": startDate,
      "details.plan.posterPlan.endDate": endDate,
      "details.plan.posterPlan.name": postPlanName,}
  },
  { new: true }
);
//const user=await userModel.findOneAndUpdate({userId:userId},{$set:{details:details}})

if(!planCreate){
    return res.send({status:"error",message:"plan not activated"})
}
return res.send({status:"success",data:savePlan})
//}
}
catch(error){
return res.send({status:"error",message:`plan not created ${error.message}`})
}
}

exports.checkPlanStatus=async(req,res)=>{
const{userId}=req.body;
try{
if(!userId){
return res.send({status:"error",message:"missing field"})
}
await deactivateBasePlansForUser();
await deactivateAddOnsPlansForUser();
await deactivateJobPlansForUser();
await deactivateWebinarPlansForUser();
await deactivatePostImagePlansForUser();
const checkPlan=await userPlanModel.find({userId:userId,isActive:true})

if(!checkPlan){
    res.send({status:"error",message:"no plan found"})
}
 else{
const checkPlan=await userModel.find({userId:userId},{"details.plan":1,_id:0})
res.send({status:"success",data:checkPlan})
}
}
catch(error){
return res.send({status:"error",message:`plan error ${error.message}`})
}
}


function parseDate(dateString) {
  if (!dateString) return null;

  // Expected format: DD-MM-YYYY
  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(Date.UTC(year, month, day)); 
}

const deactivateBasePlansForUser = async () => {
  const users = await userModel.find({
    "details.plan.basePlan": { $exists: true }
  });
console.log(`safgg${users}`)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const user of users) {
    const basePlan = user.details?.plan?.basePlan;
    if (!basePlan?.endDate) continue;

    // Ensure endDate is a Date object
    let endDate = basePlan.endDate;
    if (typeof endDate === "string") {
      endDate = new Date(endDate);
    }

    if (isNaN(endDate)) {
      console.log(`Invalid endDate for user ${user.userId}:`, basePlan.endDate);
      continue;
    }

    endDate.setUTCHours(0, 0, 0, 0);

    if (today > endDate && basePlan.isActive === true) {
      // Deactivate expired plan
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            "details.plan.basePlan.isActive": false,
            updatedDate: new Date()
          }
        }
      );
    console.log(`sssf${user.userId}`)
    console.log("Querying:", { userId: user.userId, isActive: true });
    const updatedPlan = await userPlanModel.findOneAndUpdate(
  { userId: user.userId, isActive: true }, 
  { $set: { isActive: false, updatedDate: new Date() } },
  { new: true, useFindAndModify: false } 
);

  if (!updatedPlan) {
  console.log(`No active plan found for user ${user.userId}`);
  } else {
  console.log(`Plan deactivated for user ${user.userId}`);
  }
  console.log(`BasePlan deactivated for user ${user.userId}`);
    }
  }
};

const deactivateAddOnsPlansForUser = async () => {
  const users = await userModel.find({
    "details.plan.addonsPlan.isActive": true
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const user of users) {
    const addonsPlan = user.details?.plan?.addonsPlan;
    if (!addonsPlan?.endDate) continue;

    const endDate = parseDate(addonsPlan.endDate);
    if (!endDate) continue;

    endDate.setUTCHours(0, 0, 0, 0);

    if (today > endDate) {
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            "details.plan.addonsPlan.isActive": false
          }
        }
      );

      console.log(`addons plan deactivated for user ${user.userId}`);
    }
  await addOnsUserModel.updateMany(
  { userId: user.userId, isActive: true },
  { $set: { isActive: false, updatedDate: new Date() } });

  }
};

 const deactivateJobPlansForUser = async () => {
//   const activePlans = await jobPlanUserModel.find({ isActive: true });
//   const today = new Date();
//   today.setUTCHours(0, 0, 0, 0);

//   const deactivatedPlans = [];

//   for (let plan of activePlans) {
//     let endDate = parseDate(plan.endDate);

//     if (!endDate) {
//       console.log("Invalid endDate:", plan.endDate);
//       continue;
//     }
//     endDate.setUTCHours(0, 0, 0, 0);
//     console.log(`Plan ${plan.planId} → Today: ${today}, End: ${endDate}`);

//     if (today > endDate) {
//       plan.isActive = false;
//       plan.updatedDate = new Date();
//       await plan.save();
//       deactivatedPlans.push(plan);
//       console.log(` Deactivated Plan ${plan.planId}`);
//     }
//   }
// for (let plan of deactivatedPlans) {
//     const userId = plan.userId;
  
//    // Deactivate job plan
//     await userModel.findOneAndUpdate(
//       { userId: userId, isActive: true },
//       {
//         $set: {
//           "details.plan.jobPlan.isActive": false
//         }
//       }
//     );
//     await jobPlanUserModel.findOneAndUpdate({userId:userId,isActive:true},
//     {
//         $set: {
//           isActive: false
//         }
//       }
//   )
//   }
//   console.log("Deactivated plans:", deactivatedPlans);
   const users = await userModel.find({
    "details.plan.addonsPlan.isActive": true
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const user of users) {
    const jobPlan = user.details?.plan?.jobPlan;
    if (!jobPlan?.endDate) continue;

    const endDate = parseDate(jobPlan.endDate);
    if (!endDate) continue;

    endDate.setUTCHours(0, 0, 0, 0);

    if (today > endDate) {
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            "details.plan.jobPlan.isActive": false
          }
        }
      );

      console.log(`jobPlan  deactivated for user ${user.userId}`);
    }
  await jobPlanUserModel.updateMany(
  { userId: user.userId, isActive: true },
  { $set: { isActive: false, updatedDate: new Date() } });

  }
};


 const deactivateWebinarPlansForUser = async () => {
  // const activePlans = await webinarPlanuserModel.find({ isActive: true });
  // const today = new Date();
  // today.setUTCHours(0, 0, 0, 0);

  // const deactivatedPlans = [];

  // for (let plan of activePlans) {
  //   let endDate = parseDate(plan.endDate);

  //   if (!endDate) {
  //     console.log("Invalid endDate:", plan.endDate);
  //     continue;
  //   }
  //   endDate.setUTCHours(0, 0, 0, 0);
  //   console.log(`Plan ${plan.planId} → Today: ${today}, End: ${endDate}`);

  //   if (today > endDate) {
  //     plan.isActive = false;
  //     plan.updatedDate = new Date();
  //     await plan.save();
  //     deactivatedPlans.push(plan);
  //     console.log(` Deactivated Plan ${plan.planId}`);
  //   }
  // }
  // for (let plan of deactivatedPlans) {
  //   const userId = plan.userId;
  
  //   await userModel.findOneAndUpdate(
  //     { userId: userId, isActive: true },
  //     {
  //       $set: {
  //         "details.plan.webinarPlan.isActive": false
  //       }
  //     }
  //   );
  //   await webinarPlanuserModel.findOneAndUpdate({userId:userId,isActive:true},
  //   {
  //       $set: {
  //         isActive: false
  //       }
  //     }
  // )
  const users = await userModel.find({
    "details.plan.webinarPlan.isActive": true
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const user of users) {
    const webinarPlan = user.details?.plan?.webinarPlan;
    if (!webinarPlan?.endDate) continue;

    const endDate = parseDate(webinarPlan.endDate);
    if (!endDate) continue;

    endDate.setUTCHours(0, 0, 0, 0);

    if (today > endDate) {
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            "details.plan.webinarPlan.isActive": false
          }
        }
      );

    console.log(`jobPlan  deactivated for user ${user.userId}`);
    }
  await webinarPlanuserModel.updateMany(
  { userId: user.userId, isActive: true },
  { $set: { isActive: false, updatedDate: new Date() } });

  }
  
  //return deactivatedPlans;
};

const deactivatePostImagePlansForUser = async () => {
   const users = await userModel.find({
    "details.plan.posterPlan.isActive": true
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const user of users) {
    const posterPlan = user.details?.plan?.posterPlan;
    if (!posterPlan?.endDate) continue;

    const endDate = parseDate(posterPlan.endDate);
    if (!endDate) continue;

    endDate.setUTCHours(0, 0, 0, 0);

    if (today > endDate) {
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            "details.plan.posterPlan.isActive": false
          }
        }
      );

    console.log(`jobPlan  deactivated for user ${user.userId}`);
    }
  await postImagesuserModel.updateMany(
  { userId: user.userId, isActive: true },
  { $set: { isActive: false, updatedDate: new Date() } });

  }
  //return deactivatedPlans;
  // const activePlans = await postImagesuserModel.find({ isActive: true });
  // const today = new Date();
  // today.setUTCHours(0, 0, 0, 0);

  // const deactivatedPlans = [];

  // for (let plan of activePlans) {
  //   let endDate = parseDate(plan.endDate);

  //   if (!endDate) {
  //     console.log("Invalid endDate:", plan.endDate);
  //     continue;
  //   }
  //   endDate.setUTCHours(0, 0, 0, 0);
  //   console.log(`Plan ${plan.planId} → Today: ${today}, End: ${endDate}`);

  //   if (today > endDate) {
  //     plan.isActive = false;
  //     plan.updatedDate = new Date();
  //     await plan.save();
  //     deactivatedPlans.push(plan);
  //     console.log(` Deactivated Plan ${plan.planId}`);
  //   }
  // }
  // for (let plan of deactivatedPlans) {
  //   const userId = plan.userId;
  
  //   await userModel.findOneAndUpdate(
  //     { userId: userId, isActive: true },
  //     {
  //       $set: {
  //         "details.plan.posterPlan.isActive": false
  //       }
  //     }
  //   );
  //   await postImagesuserModel.findOneAndUpdate({userId:userId,isActive:true},
  //   {
  //       $set: {
  //         isActive: false
  //       }
  //     }
  // )
  // }
  // console.log("Deactivated plans:", deactivatedPlans);
  // return deactivatedPlans;
};
// exports.getJobCounts=async(req,res)=>{
//     const{userId}=req.body;
// try{
// const getPlans=await jobPlanUserModel.find({userId:userId,isActive:true})
//     console.log("Plans found:", getPlans);
// if(getPlans.length==0){
// return res.send({status:"error",message:"no plans found"})
// }
// else{
//    const startDateStr=getPlans.startDate;
//    const endDateStr=getPlans.endDate;
//    const startDate = new Date(`${startDateStr}T00:00:00.000Z`);
//    const endDate   = new Date(`${endDateStr}T23:59:59.999Z`);
//    const jobPlansId=getPlans.jobPlansId;
//    const getCount=await jobPlanModel.find({jobPlansId:jobPlansId})
//    const JobCounts = parseInt(getCount.count?.jobCount ?? 0, 10) || 0;
//    const jobPostCounts=await jobModel.find({ userId: userId, createdDate: {
//     $gte: startDate,
//     $lte: endDate,},});
//     const jobPostCount=jobPostCounts.length;
//     const remaingCount=JobCounts-jobPostCount;

//   return res.send({status:"success",counts:remaingCount})
 
// }
// }
// catch(error){
// return res.send({status:"error",message:error.message})
// }
// }
  exports.getJobCounts = async (req, res) => {
  const { userId } = req.body;

  try {
    const getPlans = await jobPlanUserModel.find({ userId: userId, isActive: true });
    console.log("Plans found:", getPlans);

    if (getPlans.length === 0) {
      return res.send({ status: "error",planActive:false, message: "no plans found" });
    }
    const plan = getPlans[0];
    function parseDDMMYYYY(dateStr) {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const startDate = parseDDMMYYYY(plan.startDate);
    const endDate   = parseDDMMYYYY(plan.endDate);
    endDate.setHours(23, 59, 59, 999);

    const getCount = await jobPlanModel.findOne({ jobPlansId: plan.jobPlansId });
    const JobCounts = parseInt(getCount?.count?.jobCount ?? 0, 10) || 0;
    console.log(`planjob Count${JobCounts}`)

    const jobPostCounts = await jobModel.find({
      userId: userId,
      createdDate: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const jobPostCount = jobPostCounts.length;
    console.log(`jobPost Count${jobPostCount}`)
    const remainingCount = JobCounts - jobPostCount;
    return res.send({ status: "success",planActive:true, counts: remainingCount });
   } catch (error) {
    console.error(error);
    return res.send({ status: "error", planActive:false,message: error.message });
  }
};

//   exports.calculateIncome_admin = async (req, res) => {
//   try {
//     const { fromDate, toDate } = req.body;

//     const dateFilter = {};
//     if (fromDate && toDate) {
//       dateFilter.createdDate = {
//         $gte: new Date(fromDate),
//         $lte: new Date(toDate),
//       };
//     }

//     const posterPlans = await postImagesuserModel.find(dateFilter,{ price: 1, _id: 0 });
//     const basePlans = await userPlanModel.find(dateFilter,{ price: 1, _id: 0 } );
//     const addOns = await addOnsUserModel.find(dateFilter,{ price: 1, _id: 0 });
//     const jobPlans = await jobPlanUserModel.find(dateFilter, { price: 1, _id: 0 });
//     const webinars = await webinarPlanuserModel.find(dateFilter,{ price: 1, _id: 0 } );

//     const sumPrices = (arr) =>arr.reduce((sum, item) => sum + Number(item.price || 0), 0);

//     const posterIncome = sumPrices(posterPlans);
//     const basePlanIncome = sumPrices(basePlans);
//     const addOnsIncome = sumPrices(addOns);
//     const jobIncome = sumPrices(jobPlans);
//     const webinarIncome = sumPrices(webinars);

//     const totalIncome =
//       posterIncome +
//       basePlanIncome +
//       addOnsIncome +
//       jobIncome +
//       webinarIncome;

//       const data = {
//       posterActiveUsers: await postImagesuserModel.countDocuments({
//         ...dateFilter,
//         isActive: true,
//       }),
//       basePlanActiveUsers: await userPlanModel.countDocuments({
//         ...dateFilter,
//         isActive: true,
//       }),
//       addOnsActiveUsers: await addOnsUserModel.countDocuments({
//         ...dateFilter,
//         isActive: true,
//       }),
//       jobPlanActiveUsers: await jobPlanUserModel.countDocuments({
//         ...dateFilter,
//         isActive: true,
//       }),
//       webinarActiveUsers: await webinarPlanuserModel.countDocuments({
//         ...dateFilter,
//         isActive: true,
//       }),
//     };

//     res.status(200).json({
//       status: "success",
//       data: {
//         total: totalIncome,
//         posterIncome,
//         basePlanIncome,
//         addOnsIncome,
//         jobIncome,
//         webinarIncome,
//         data,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
const calculateIncomeByState = async (Model, state, dateFilter = {}) => {
  const pipeline = [
    { $match: dateFilter },

    {
      $lookup: {
        from: "users", 
        localField: "userId",
        foreignField: "userId",
        as: "user"
      }
    },
    { $unwind: "$user" },
  ];

  // ✅ Add state filter ONLY if state is provided
  if (state && state.trim() !== "") {
    pipeline.push({
      $match: {
        "user.address.state": new RegExp(`^${state.trim()}$`, "i")
      }
    });
  }

  pipeline.push({
    $group: {
      _id: null,
      totalIncome: { $sum: { $toDouble: "$price" } },
      activeUsers: {
        $sum: {
          $cond: [{ $eq: ["$isActive", true] }, 1, 0]
        }
      }
    }
  });

  const result = await Model.aggregate(pipeline);

  return {
    income: result[0]?.totalIncome || 0,
    activeUsers: result[0]?.activeUsers || 0
  };
};

//   exports.calculateIncome_admin = async (req, res) => {
//   try {
//     const { fromDate, toDate, state } = req.body;

//     const dateFilter = {};
//     if (fromDate && toDate) {
//       dateFilter.createdDate = {
//         $gte: new Date(fromDate),
//         $lte: new Date(toDate),
//       };
//     }

//     const poster = await calculateIncomeByState(postImagesuserModel, state, dateFilter);
//     const basePlan = await calculateIncomeByState(userPlanModel, state, dateFilter);
//     const addOns = await calculateIncomeByState(addOnsUserModel, state, dateFilter);
//     const jobPlan = await calculateIncomeByState(jobPlanUserModel, state, dateFilter);
//     const webinar = await calculateIncomeByState(webinarPlanuserModel, state, dateFilter);

//     const totalIncome =
//       poster.income +
//       basePlan.income +
//       addOns.income +
//       jobPlan.income +
//       webinar.income;

//     res.status(200).json({
//       status: "success",
//       data: {
//         total: totalIncome,
//         posterIncome: poster.income,
//         basePlanIncome: basePlan.income,
//         addOnsIncome: addOns.income,
//         jobIncome: jobPlan.income,
//         webinarIncome: webinar.income,
//         activeUsers: {
//           poster: poster.activeUsers,
//           basePlan: basePlan.activeUsers,
//           addOns: addOns.activeUsers,
//           jobPlan: jobPlan.activeUsers,
//           webinar: webinar.activeUsers
//         }
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

exports.calculateIncome_admin = async (req, res) => {
  try {

    const { fromDate, toDate, state } = req.body;

    const dateFilter = {};

    if (fromDate && toDate) {
      dateFilter.createdDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }

    const poster = await calculateIncomeByState(postImagesuserModel, state, dateFilter);
    const basePlan = await calculateIncomeByState(userPlanModel, state, dateFilter);
    const addOns = await calculateIncomeByState(addOnsUserModel, state, dateFilter);
    const jobPlan = await calculateIncomeByState(jobPlanUserModel, state, dateFilter);
    const webinar = await calculateIncomeByState(webinarPlanuserModel, state, dateFilter);

    res.send({
      status: "success",
      data: {
        posterIncome: poster,
        basePlanIncome: basePlan,
        addOnsIncome: addOns,
        jobIncome: jobPlan,
        webinarIncome: webinar
      }
    });

  } catch (error) {
    res.send({
      status: "error",
      message: error.message
    });
  }
};

exports.addExpenses= async (req, res) => {
try {
  const { title, amount, category, userId, month, year,state } = req.body;
    const expense = new expenseModel({
      title,
      amount,
      category,state,
      userId, month, year,
    });
    await expense.save();
    res.send({ status: "success", data: expense });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { month, year, state } = req.body;
    const now = new Date();

    const selectedMonth = month ? Number(month) : now.getMonth() + 1;
    const selectedYear = year ? Number(year) : now.getFullYear();

    const filter = {
      month: selectedMonth,
      year: selectedYear,
    };

    if (state) filter.state = state.trim();

    const expenses = await expenseModel.find(filter).sort({ createdDate: -1 });

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const stateWiseExpense = await expenseModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$state",
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $project: {
          state: "$_id",
          totalExpense: 1,
          _id: 0,
        },
      },
    ]);

    res.send({
      status: "success",
      data: {
        month: selectedMonth,
        year: selectedYear,
        state: state || null,
        total,
        stateWiseExpense,
        expenses,
      },
    });

  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.send({
      status: "error",
      message: error.message,
    });
  }
};
// exports.getExpenses = async (req, res) => {
//   try {
//     console.log("Logged-in user type:", req.user.userType);
//     console.log("Logged-in userId:", req.user.userId);

//     let { month, year, state } = req.body;
//     const now = new Date();

//     month = month ? Number(month) : now.getMonth() + 1;
//     year = year ? Number(year) : now.getFullYear();

//     let filter = {};

//     if (month) filter.month = month;
//     if (year) filter.year = year;
//     if (state) filter.state = state;

//     // if (req.user.userType.toLowerCase() === "superadmin") {
//     //   if (state && state.trim() !== "") {
//     //     const usersInState = await userModel.find(
//     //       { "address.state": new RegExp(`^${state.trim()}$`, "i") },
//     //       { userId: 1 }
//     //     );

//     //     const userIds = usersInState.map(u => u.userId);
//     //     filter.userId = userIds.length ? { $in: userIds } : null;
//     //   }
//     // } else {
//     //   filter.userId = req.user.userId;
//     // }

//     console.log("Mongo filter applied:", filter);

//     // const expenses = filter.userId === null
//     //   ? []
//     //   : await expenseModel.find(filter).sort({ createdDate: -1 });
// const expenses = await expenseModel.find(filter).sort({ createdDate: -1 });
//     const userIds = [...new Set(expenses.map(e => e.userId))]; 
//     const users = await userModel.find(
//       { userId: { $in: userIds } },
//       { userId: 1, name: 1, address: 1, email: 1 } 
//     );

//     const userMap = {};
//     users.forEach(u => {
//       userMap[u.userId] = u;
//     });
//     const expensesWithUser = expenses.map(e => ({
//       ...e.toObject(),
//       user: userMap[e.userId] || null
//     }));

//     const total = expensesWithUser.reduce((sum, e) => sum + Number(e.amount), 0);

//        res.send({
//        status: "success",
//        data: {
//         month,
//         year,
//         total,state,
//         expenses: expensesWithUser,
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     res.send({
//       status: "error",
//       message: error.message,
//     });
//   }
// };




  exports.updateExpenses= async (req, res) => {
  const { id,title, amount, category, userId } = req.body;
  try {
    const updatedExpense = await expenseModel.findByIdAndUpdate(
      id,
      {title,
      amount,
      category,
      userId, updatedDate: new Date() },
      { new: true }
    );
    res.send({ status: "success", data: updatedExpense });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
  };
  
 exports.deleteExpenses=async (req, res) => {
  try {
    await expenseModel.findByIdAndUpdate({id},{$set:{isActive:false}});
    res.send({ status: "success", message: "Expense deleted" });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
};

exports.getCompanyDetails = async (req, res) => {
  //const{userId}=req.body;
  try {
    const companies = await companyModel.findOne({});
    console.log("DB output:", JSON.stringify(companies, null, 2));

    if (!companies || companies.length === 0) {
      return res.json({ status: "error", data: companies });
    }

    res.json({ status: "success", data: companies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message, data: {} });
  }
};

exports.getGst = async (req, res) => {
  const {userId}=req.body;
  try {
   // const gst = await addGstModel.find({ userId: { $regex: `^${userId}$`, $options: "i" } });
        const gst = await addGstModel.find({ });

    console.log(gst);

    if (!gst) {
      return res.json({ status: "error", message: "no records found" });
    }

    res.json({ status: "success", data: gst });
  } catch (err) {
    res.send({ status: "error", message: err.message });
  }
};
 exports.updateCompany = async (req, res) => {
  try {
    let gst = await companyModel.findOne();
    if (gst) {
      await companyModel.updateOne({}, req.body);
    } else {
      gst = new companyModel(req.body);
      await gst.save();
    }
    res.json({status: "success", message: 'Company details updated' });
  } catch (err) {
    res.status({ success: false, message: err.message });
  }
};
exports.updateGst = async (req, res) => {
  const{userId,cgst,sgst,igst,isShowGst,}=req.body;
  try {
    let company = await addGstModel.findOne({userId:userId});
    if (company) {
      await addGstModel.updateOne({}, {userId:userId,cgst:cgst,sgst:sgst,igst:igst,isShowGst:isShowGst});
    } else {
      company = new addGstModel({userId:userId,cgst:cgst,sgst:sgst,igst:igst,isShowGst:isShowGst});
      await company.save();
    }
    res.json({status: "success", message: 'Gst details updated' });
  } catch (err) {
    res.status({ success: false, message: err.message });
  }
};
exports.calculateTax = (req, res) => {
  const { amount, companyStateCode, customerStateCode } = req.body;

  let taxType, cgst = 0, sgst = 0, igst = 0;

  if (companyStateCode === customerStateCode) {
    taxType = 'CGST_SGST';
    cgst = amount * 0.055; 
    sgst = amount * 0.055; 
  } else {
    taxType = 'IGST';
    igst = amount * 0.13; 
  }

  const totalTax = cgst + sgst + igst;
  const baseAmount = amount - totalTax;

  res.json({
    success: true,
    data: {
      baseAmount,
      taxType,
      cgst,
      sgst,
      igst,
      totalTax,
      finalAmount: amount
    }
  });
};

//  exports.createInvoice = async (req, res) => {
//   try {
//     const invoice = new taxModel({
//       invoiceId: `INV${Date.now()}`,
//       ...req.body
//     });
//     await invoice.save();
//     res.json({ success: true, data: invoice });
//   } catch (err) {
//     res.status({ success: false, message: err.message });
//   }
// };

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.query.invoiceId });
    res.json({ status: "success", data: invoice });
  } catch (err) {
    res.status({ success: "error", message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { userId } = req.query;
    const invoices = await Invoice.find({ userId }); 
    //console.log("invoice records:", JSON.stringify(invoices, null, 2));
    res.send({ status: "success",data:invoices });
  } catch (err) {
    res.send({ status: "error", message: err.message });
  }
};


exports.createInvoice = async (req, res) => {
  try {
    const { userId, planId, planName,planType,startDate,endDate, amount, taxSummary, company } = req.body;

    // const year = new Date().getFullYear();
    // const prefix = `INV-LYD${year}-`;

    // const count = await Invoice.countDocuments({
    //   invoiceId: { $regex: `INV-LYD${year}-` },
    // });

    // const invoiceId = `${prefix}${String(count + 1).padStart(3, "0")}`;

   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, "0");

  const prefix = `INV-LYD-${year}-${month}-`;

    const addInvoiceId = await InvoiceIds.findOneAndUpdate(
      { key: `invoice_${year}` }, 
      { $inc: { invoiceId: 1 } },
      { new: true, upsert: true }
    );

   const invoiceId = `${prefix}${String(addInvoiceId.invoiceId).padStart(4, "0")}`;

    const newInvoice = await Invoice.create({
      userId,
      planId,
      planName,
      planType,startDate,endDate,
      amount,
      invoiceId,
      taxSummary,
      company,
    });

    res.send({ status: "success", data: newInvoice });
  } catch (err) {
    console.error(err);
    res.send({ status: "error", message: err.message });
  }
};