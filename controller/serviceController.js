const express=require('express')
const serviceModel=require('../model/serviceModel')
const serviceIdModel=require('../model/serviceId');
const serviceId = require('../model/serviceId');
const { uploadToS3 ,deleteFromS3 } = require("../file_uploadImage");
const SalePost = require('../model/create_sale_model');
 

 exports.createServices = async (req, res) => {
  try {
    const {
      serviceTitle,
      serviceDescription,
      serviceCost,
      userType,
      userId,
      serviceId,
      existingImages 
    } = req.body;

    if (!serviceTitle || !serviceDescription || !serviceCost || !userType || !userId) {
      return res.json({ status: "error", message: "Missing required fields" });
    }

  let existingImagesArray = [];

if (req.body.existingImages) {
  if (Array.isArray(req.body.existingImages)) {
    existingImagesArray = req.body.existingImages;
  } else if (typeof req.body.existingImages === "string") {
    try {
      const parsed = JSON.parse(req.body.existingImages);
      existingImagesArray = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      existingImagesArray = req.body.existingImages
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
  }
}
    let newImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await uploadToS3(file);
        newImages.push(uploadedUrl); 
      }
    }
    const allImages = [...existingImagesArray, ...newImages];
     if (!serviceId || serviceId == 0) {
      const newServiceIdObj = await serviceIdModel.findOneAndUpdate(
        { id: "serviceId" },
        { $inc: { serviceId: 1 } },
        { upsert: true, new: true }
      );

      const newService = new serviceModel({
        serviceId: newServiceIdObj.serviceId,
        serviceTitle,
        serviceDescription,
        serviceCost,
        userType,
        userId,
        image: allImages,
        createdDate: new Date(),
        updatedDate: new Date(),
      });

      const savedService = await newService.save();
      return res.send({
        status: "Success",
        message: "Service created successfully",
        data: savedService,
      });
    }
    const existingService = await serviceModel.findOne({ serviceId: serviceId });
    if (!existingService) {
      return res.send({ status: "error", message: "Service not found" });
    }

    const updateFields = {
      updatedDate: new Date(),
      image: allImages, 
    };

    if (serviceTitle) updateFields.serviceTitle = serviceTitle;
    if (serviceDescription) updateFields.serviceDescription = serviceDescription;
    if (serviceCost) updateFields.serviceCost = serviceCost;
    if (userType) updateFields.userType = userType;

    const updatedService = await serviceModel.findOneAndUpdate(
      { serviceId: serviceId },
      { $set: updateFields },
      { new: true }
    );

    return res.send({
      status: "Success",
      message: "Service updated successfully",
      data: updatedService,
    });

  } catch (error) {
    console.error("Error in createOrUpdateService:", error);
    return res.send({ status: "error", message: error.message });
  }
};

 exports.deactivateServices=async(req,res)=>{
 const{serviceId}=req.body;
 try{
 const deactivateService= await serviceModel.findOneAndUpdate({serviceId:serviceId},{isActive:false})
 const result = await deleteFromS3(deactivateService.image);
 const deleteResult = await deleteFromS3(deactivateService.image);
  console.log("delete result",deleteResult)
  if(deactivateService.length===0){
    res.send({status:"error",message:"data not found"})
   }
  res.send({status:"success",message:"deactivated successfully"})
  }
  catch(error){
  res.send({status:"error",message:"service not deactivated "})
  }
  }

exports.getServicesList=async(req,res)=>{
const{userId}=req.body;
try{
const getServiceList=await serviceModel.find({$and:[{userId:userId},{isActive:true}]})
if(getServiceList.length===0){
    res.json({status:"error",message:"data not found"})
}
else{
 res.json({status:"success",data:getServiceList})
}
}
catch(error){
res.send({Status:"success",message:error.message})
}
}

exports.getServicesById=async(req,res)=>{
const{serviceId}=req.body;
try{
    if(!serviceId){
    res.send({status:"error",message:"missing field"})
    }
  const getServiceList=await serviceModel.find({serviceId:serviceId,isActive:true})
  if(getServiceList.length===0){
    res.json({status:"error",message:"data not found"})
  }
  else{
    res.json({status:"success",data:getServiceList})
 }
 }
catch(error){
res.send({Status:"success",message:error.message})
}
}


  exports.get_sale_post_list=async(req,res)=>{
  try {
    const { userType, search } = req.body;
    const filter = { isActive: true };
    if (userType) filter.userType = userType;
    if (search) filter.message = { $regex: search, $options: 'i' };

    const posts = await SalePost.find(filter).sort({ createdAt: -1 });
    res.json({ status: 'Success', data: posts });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: err.message });
  }
};

  exports.get_sale_post_byId=async(req,res)=>{
  try {
    const { id } = req.params;
    const post = await SalePost.findOne({ _id: id, isActive: true });
    if (!post) {
      return res.status(404).json({ status: 'Error', message: 'Sale post not found' });
    }
    res.json({ status: 'Success', data: post });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: err.message });
  }
};

  exports.create_sale_post=async(req,res)=>{

  try {
    const { userId, userType, mobileNumber, message, price } = req.body;

    const imageUrls = await Promise.all(
      (req.files || []).map((file) => uploadToS3(file, `salePost/${userId}`))
    );

    const post = await SalePost.create({
      userId,
      userType,
      mobileNumber,
      message,
      price,
      images: imageUrls,
    });

    res.json({ status: 'Success', message: 'Sale post created', data: post });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: err.message });
  }
};