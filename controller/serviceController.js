const express=require('express')
const serviceModel=require('../model/serviceModel')
const serviceIdModel=require('../model/serviceId');
const serviceId = require('../model/serviceId');
const { uploadToS3 ,deleteFromS3 } = require("../file_uploadImage");


// exports.createServices = async (req, res) => {
//   try {
//     const {
//       serviceTitle,
//       serviceDescription,
//       serviceCost,
//       userType,
//       userId,
//       serviceId
//     } = req.body;

//     if (!serviceTitle || !serviceDescription || !serviceCost || !userType || !userId) {
//       return res.json({ status: "error", message: "Missing required fields" });
//     }
//     let newImages = [];
//     // if (req.files && req.files.length > 0) {
//     //   newImages = req.files.map(file => `serviceImage/${file.filename}`);
//     // }
//      const file =
//       req.file ||
//       (req.files && req.files.length > 0 ? req.files[0] : null);

//           const uploadedUrl = await uploadToS3(file);
    
//     if (serviceId == 0 || !serviceId) {
//       const newServiceIdObj = await serviceIdModel.findOneAndUpdate(
//         { id: "serviceId" },
//         { $inc: { serviceId: 1 } },
//         { upsert: true, new: true }
//       );

//       const newService = new serviceModel({
//         serviceId: newServiceIdObj.serviceId,
//         serviceTitle,
//         serviceDescription,
//         serviceCost,
//         userType,
//         userId,
//         image: uploadedUrl,
//         //newImages, 
//         createdDate: new Date, 
//         updatedDate:  new Date, 
//       });

//       const savedService = await newService.save();
//       return res.send({
//         status: "Success",
//         message: "Service created successfully",
//         data: savedService
//       });
//     }
//     const existingService = await serviceModel.findOne({ serviceId: serviceId });
//     if (!existingService) {
//       return res.send({ status: "error", message: "Service not found" });
//     }
//     const mergedImages = existingService.image.concat(newImages);
//     const updateFields = {
//     updatedDate: new Date, 
//       image: mergedImages
//     };
//     if (serviceTitle) updateFields.serviceTitle = serviceTitle;
//     if (serviceDescription) updateFields.serviceDescription = serviceDescription;
//     if (serviceCost) updateFields.serviceCost = serviceCost;
//     if (userType) updateFields.userType = userType;

//     const updatedService = await serviceModel.findOneAndUpdate(
//       { serviceId: serviceId },
//       { $set: updateFields },
//       { new: true }
//     );
//     return res.send({
//       status: "Success",
//       message: "Service updated successfully",
//       data: updatedService
//     });
//   } catch (error) {
//     console.error("Error in createOrUpdateService:", error);
//     return res.send({ status: "error", message: error.message });
//   }
// };

// exports.createServices = async (req, res) => {
//   try {
//     const {
//       serviceTitle,
//       serviceDescription,
//       serviceCost,
//       userType,
//       userId,
//       serviceId,existingImages
//     } = req.body;

//     if (!serviceTitle || !serviceDescription || !serviceCost || !userType || !userId) {
//       return res.json({ status: "error", message: "Missing required fields" });
//     }

//     // Upload all new files to S3
//     let newImages = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const uploadedUrl = await uploadToS3(file);
//         newImages.push(uploadedUrl); // add uploaded URL to array
//       }
//     }
    
//    const allImages = [...existingImages, ...newImages];

//     if (!serviceId || serviceId == 0) {
//       // CREATE NEW SERVICE
//       const newServiceIdObj = await serviceIdModel.findOneAndUpdate(
//         { id: "serviceId" },
//         { $inc: { serviceId: 1 } },
//         { upsert: true, new: true }
//       );

//       const newService = new serviceModel({
//         serviceId: newServiceIdObj.serviceId,
//         serviceTitle,
//         serviceDescription,
//         serviceCost,
//         userType,
//         userId,
//         image: allImages, 
//         createdDate: new Date(),
//         updatedDate: new Date(),
//       });

//       const savedService = await newService.save();
//       return res.send({
//         status: "Success",
//         message: "Service created successfully",
//         data: savedService,
//       });
//     }

//     // UPDATE EXISTING SERVICE
//     const existingService = await serviceModel.findOne({ serviceId: serviceId });
//     if (!existingService) {
//       return res.send({ status: "error", message: "Service not found" });
//     }

//     // Merge old and new images
//     const mergedImages = existingService.image.concat(newImages);

//     const updateFields = {
//       updatedDate: new Date(),
//       image: mergedImages,
//     };
//     if (serviceTitle) updateFields.serviceTitle = serviceTitle;
//     if (serviceDescription) updateFields.serviceDescription = serviceDescription;
//     if (serviceCost) updateFields.serviceCost = serviceCost;
//     if (userType) updateFields.userType = userType;

//     const updatedService = await serviceModel.findOneAndUpdate(
//       { serviceId: serviceId },
//       { $set: updateFields },
//       { new: true }
//     );

//     return res.send({
//       status: "Success",
//       message: "Service updated successfully",
//       data: updatedService,
//     });
//   } catch (error) {
//     console.error("Error in createOrUpdateService:", error);
//     return res.send({ status: "error", message: error.message });
//   }
// };
 

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
    // let existingImagesArray = [];
    // if (existingImages) {
    //   if (Array.isArray(existingImages)) {
    //     existingImagesArray = existingImages;
    //   } else if (typeof existingImages === "string") {
    //     existingImagesArray = existingImages.split(',').map(s => s.trim());
    //   }
    // }
    // Initialize as empty array
// let existingImagesArray = [];

// if (req.body.existingImages) {
//   try {
//     // Try to parse it as JSON
//     const parsed = JSON.parse(req.body.existingImages);

//     // Only accept it if it's an array
//     if (Array.isArray(parsed)) {
//       existingImagesArray = parsed;
//     } else {
//       existingImagesArray = [];
//     }
//   } catch (err) {
//     // If JSON parsing fails, default to empty array
//     existingImagesArray = [];
//   }
// }
let existingImagesArray = [];

if (req.body.existingImages) {
  if (Array.isArray(req.body.existingImages)) {
    existingImagesArray = req.body.existingImages;
  } else if (typeof req.body.existingImages === "string") {
    try {
      const parsed = JSON.parse(req.body.existingImages);
      existingImagesArray = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // fallback: comma-separated string
      existingImagesArray = req.body.existingImages
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
  }
}
// existingImagesArray now contains an array of URLs or is empty
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

    // UPDATE EXISTING SERVICE
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
// exports.createServices = async (req, res) => {
//   try {
//     const {
//       serviceTitle,
//       serviceDescription,
//       serviceCost,
//       userType,
//       userId,
//       serviceId,
//       existingImages
//     } = req.body;

//     // Validate required fields
//     if (!serviceTitle || !serviceDescription || !serviceCost || !userType || !userId) {
//       return res.json({ status: "error", message: "Missing required fields" });
//     }

//     // Parse existing images safely
//     // Parse existing images
// let existingImagesArray = [];
// if (existingImages) {
//   try {
//     const parsed = JSON.parse(existingImages);
//     if (Array.isArray(parsed)) existingImagesArray = parsed;
//   } catch (err) {
//     existingImagesArray = [];
//   }
// }

// // Upload new files
// let newImages = [];
// if (req.files && req.files.length > 0) {
//   for (const file of req.files) {
//     const uploadedUrl = await uploadToS3(file);
//     newImages.push(uploadedUrl);
//   }
// }



//     // Combine existing + new images
//     const allImages = [...existingImagesArray, ...newImages];

//     // CREATE NEW SERVICE
//     if (!serviceId || serviceId == 0) {
//       const newServiceIdObj = await serviceIdModel.findOneAndUpdate(
//         { id: "serviceId" },
//         { $inc: { serviceId: 1 } },
//         { upsert: true, new: true }
//       );

//       const newService = new serviceModel({
//         serviceId: newServiceIdObj.serviceId,
//         serviceTitle,
//         serviceDescription,
//         serviceCost,
//         userType,
//         userId,
//         image: allImages,
//         createdDate: new Date(),
//         updatedDate: new Date(),
//       });

//       const savedService = await newService.save();

//       return res.send({
//         status: "Success",
//         message: "Service created successfully",
//         data: savedService,
//       });
//     }

//     // UPDATE EXISTING SERVICE
//     const existingService = await serviceModel.findOne({ serviceId: serviceId });
//     if (!existingService) {
//       return res.send({ status: "error", message: "Service not found" });
//     }

//     const updateFields = {
//       updatedDate: new Date(),
//       image: allImages, // merge existing + new
//       serviceTitle,
//       serviceDescription,
//       serviceCost,
//       userType
//     };

//     const updatedService = await serviceModel.findOneAndUpdate(
//       { serviceId: serviceId },
//       { $set: updateFields },
//       { new: true }
//     );

//     return res.send({
//       status: "Success",
//       message: "Service updated successfully",
//       data: updatedService,
//     });

//   } catch (error) {
//     console.error("Error in createOrUpdateService:", error);
//     return res.send({ status: "error", message: error.message });
//   }
// };
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