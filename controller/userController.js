const express=require('express');
const userModel=require('../model/user');
const userIds=require('../model/userId')
const { error } = require('winston');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const fs=require('fs');
const path=require('path')
const authMiddle=require('../middleware/auth');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
//const { count } = require('console');
const secret = 'LYD2025';
const handlebars = require("handlebars");
const planUserModel=require('../model/plan_user_model')
const axios=require('axios')
const jobApplicationModel=require('../model/jobModel')
const uploadAdminImages=require('../model/post_images_admin_modes')
const fcmModel=require('../model/fcm_token_model')
const mongoose=require('mongoose')
const planModel=require('../model/plan_model')
const userPlanModel=require('../model/plan_user_model')
const auth=require('../middleware/auth')
const { uploadToS3 ,deleteFromS3 } = require("../file_uploadImage");
const userLoginModel=require('../model/loginmodel')
const appLogoModel=require('../model/app_logo')
const serviceModel=require('../model/serviceModel')


//  const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: `${process.env.nodemail_username}`,
//         pass: `${process.env.nodemail_password}`,
//       }
//     });
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});
//     const transporter = nodemailer.createTransport({
//   host: "email-smtp.ap-south-1.amazonaws.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: `${process.env.nodemail_username}`,
//     pass: `${process.env.nodemail_password}`,
//   },
// });
exports.deleteAwsfile = async (req, res) => {
  const { fileUrl,name} = req.body;
  if (!fileUrl) {
    return res.send({ status:"error", message: "fileUrl is required" });
  }
  try {
    console.log("Deleting fileUrl:", fileUrl);
    const result = await deleteFromS3(fileUrl);
    console.log("AWS file delete:", JSON.stringify(result, null, 2));    
    if(name=='postImage'){
      const record = await uploadAdminImages.findOne({ "posterImages.path": fileUrl });
      //console.log("Found record:", record);
    const deleteFile=  await uploadAdminImages.updateOne(
    { "posterImages.path": fileUrl },
    {
    $pull: {
      posterImages: { path: fileUrl }
    }
  });
   console.log(`delete${deleteFile}`)
    }
    let record;
      if(name=='appLogo'){
         record = await appLogoModel.findOneAndDelete({ appLogo: fileUrl });
          if (!record) {
  return res.json({ status: "error", message: "File not found" });
}
    }
     if(name=='serviceImage'){
        const result = await serviceModel.updateOne(
  { image: fileUrl },
  {
    $pull: {
      image: fileUrl
    }
  }
);

console.log(result);
          if (!result) {
  return res.json({ status: "error", message: "File not found" });
}
     }

    res.send({ status:"success", message: "File deleted successfully", result });
  } catch (err) {
    console.error(err);
    res.send({ status:"error", message:"Failed to delete file", error: err.message });
  }
};

const sendRegistrationOtp = async (userId) => {
  try {
    const generateOtp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; 
    console.log('rregister otp')

    const user=  await userModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          "details.emailOtp": generateOtp,
          "details.emailOtpExpiry": otpExpiry,
        },
      }
    );

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.nodemail_username,
    //     pass: process.env.nodemail_password,
    //   },
    // });

    // Render email template
    const templatePath = path.join(__dirname, "template", "verify_register_email.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    //console.log(`https://lyd-backend-mjvx.onrender.com/lyd/user/verify_password`)

      const htmlContent = template({
      otp: generateOtp,
      name: user.name ?? "",
      year: new Date().getFullYear(),
      isRegister:true,  
      verification_url: `https://lyd-backend-mjvx.onrender.com/lyd/user/verify_password`
      //`${process.env.base_url}/lyd/user/verify_password`  
    });
     console.log(`sslog${user.email}`)
    // Send mail
     const info= await transporter.sendMail({
      from: '"LYD" <developer.catchytechnologies@gmail.com>',
      to: user.email,
      subject: "LYD OTP Verification Mail",
      html: htmlContent,
    });
    console.log("Mail sent:", info.response);
    return { status: "success", message: "OTP sent to email" };
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

// exports.getNearbyUsers = async (req, res) => {
//   try {
//     const { latitude, longitude, distance } = req.body; // distance in meters
//     if (!latitude || !longitude) {
//       return res.status(400).json({ status: "error", message: "Latitude and longitude required" });
//     }

//     const maxDistance = distance || 5000; // default 5 km

//     const nearbyUsers = await userModel.find({
//       "address.geoLocation": {
//         $nearSphere: {
//           $geometry: {
//             type: "Point",
//             coordinates: [Number(longitude), Number(latitude)] // longitude first!
//           },
//           $maxDistance: maxDistance
//         }
//       },
//       isActive: true // only active users
//     });

//     if (!nearbyUsers.length) {
//       return res.json({ status: "error", message: "No nearby users found" });
//     }

//     return res.json({ status: "success", total: nearbyUsers.length, data: nearbyUsers });

//   } catch (error) {
//     console.error(error);
//     return res.json({ status: "error", message: error.message });
//   }
// };


// exports.getAllUserDetails = async (req, res) => {
//   try {
//     if(!req.body.userId){
//     const filters = req.body.filters || {};
//     const search = req.body.search?.trim() || "";

//     let matchQuery = {  };

//     if (search !== "") {
//       const regex = { $regex: search, $options: "i" };
//       matchQuery["$or"] = [
//         { userId: regex },
//         { name: regex },
//         { userType: regex },
//         { mobileNumber: regex },
//         { email: regex },
//         { "address.state": regex },
//         { "address.district": regex },
//         { "address.city": regex },
//         { "details.name": regex },
//       ];
//     }
// if (filters.isActive === 'true' || filters.isActive === true) {
//     matchQuery.isActive = true;
//   }    if (filters.state) matchQuery["address.state"] = filters.state;
//     if (filters.district) matchQuery["address.district"] = filters.district;
//     if (filters.city) matchQuery["address.city"] = filters.city;
//     if (filters.userType) {
//       matchQuery["userType"] = { $regex: `^${filters.userType.trim()}$`, $options: "i" };
//     }
//    if (filters.latitude && filters.longitude) {
//     const maxDistance = 10 * 1000;
//     matchQuery["address.geoLocation"] = {
//   $geoWithin: {
//     $centerSphere: [
//       [Number(filters.longitude), Number(filters.latitude)],
//       10 / 6378.1 // 10km in radians
//     ]
//   }
// };
//   // matchQuery["address.geoLocation"] = {
//   //   $nearSphere: {
//   //     $geometry: {
//   //       type: "Point",
//   //       coordinates: [
//   //         Number(filters.longitude), 
//   //         Number(filters.latitude)  
//   //       ]
//   //     },
//   //     $maxDistance: Number(maxDistance) 
//   //   }
//   // };
// }
//     const users = await userModel.aggregate([
//       { $match: matchQuery },
//      // Compute plan priority based on addOns
//       {
//         $addFields: {
//           planPriority: {
//   $switch: {
//     branches: [
//       // Highest priority: addonsPlan.state=true and active
//       { 
//         case: {
//           $and: [
//             { $eq: ["$details.plan.addonsPlan.isActive", true] },
//             { $eq: ["$details.plan.addonsPlan.details.state", true] }
//           ]
//         },
//         then: 1
//       },
//       { 
//         case: {
//           $and: [
//             { $eq: ["$details.plan.addonsPlan.isActive", true] },
//             { $eq: ["$details.plan.addonsPlan.details.district", true] }
//           ]
//         },
//         then: 2
//       },
//       { 
//         case: {
//           $and: [
//             { $eq: ["$details.plan.addonsPlan.isActive", true] },
//             { $eq: ["$details.plan.addonsPlan.details.city", true] }
//           ]
//         },
//         then: 3
//       },
//       { 
//         case: {
//           $and: [
//             { $eq: ["$details.plan.addonsPlan.isActive", true] },
//             { $eq: ["$details.plan.addonsPlan.details.area", true] }
//           ]
//         },
//         then: 4
//       },
//       {
//         case: { $eq: ["$details.plan.basePlan.isActive", true] },
//         then: 5
//       },
//       {
//         case: { $eq: ["$details.plan.jobPlan.isActive", true] },
//         then: 6
//       }
//     ],
//     default: 99 
//   }
// }
//         }
//       },
//       { $sort: { planPriority: 1, _id: -1 } }
//     ]);

//     if (!users.length) return res.send({ status: "error", message: "No data found" });

//     return res.json({ status: "Success", total: users.length, data: users });
//   }
//   else{
//     const filters = req.body.filters || {};
//     let query = { isActive: true };
//     const search = req.body.search?.trim() || "";
//   //  const user1 = await userModel.findOne({userId:req.body.userId});
//   //   let      matchQuery = { isActive: true };

//   //   if(user.userType=='admin'||user.userType=='superAdmin'){
//   //          matchQuery = {  };
//   //   }
//   //   else{
//   //    matchQuery = { isActive: true };
//   //   }
//   if (search !== "") {
//   const regex = { $regex: search, $options: "i" };
//   query["$or"] = [
//     { userId: regex },
//     { name: regex },
//     { userType: regex },
//     { mobileNumber: regex },
//     { email: regex },
//     { "address.state": regex },
//     { "address.district": regex },
//     { "address.city": regex },
//     { "details.name": regex },
//   ];
// }
// if (filters.isActive === 'true' || filters.isActive === true) {
//     query.isActive = true;
//   }
//   if (filters.state) query["address.state"] = filters.state;
//   if (filters.district) query["address.district"] = filters.district;
//   if (filters.city) query["address.city"] = filters.city;
//   if (filters.userType) {
//   query["userType"] = { $regex: `^${filters.userType.trim()}$`, $options: "i" };
//   }
//   const user = await userModel.find(query).sort({ _id: -1 });
//   if (!user.length) return res.send({ status: "error", message: "No data found" });
//   return res.json({ status: "Success", total: user.length, data: user });
//   }
//   } catch (error) {
//     console.error(error);
//     return res.send({ status: "error", message: error.message });
//   }
// };

exports.getAllUserDetails = async (req, res) => {
  try {
    const { filters = {}, search = "", userId } = req.body;

    const trimmedSearch = search?.trim();
    let matchQuery = {};
  //await sendRegistrationOtp("LYD75"); 

    if (trimmedSearch) {
      const regex = { $regex: trimmedSearch, $options: "i" };
      matchQuery.$or = [
        { userId: regex },
        { name: regex },
        { userType: regex },
        { mobileNumber: regex },
        { email: regex },
        { "address.addressLine1": regex },
        { "address.addressLine2": regex },
        { "address.state": regex },
        { "address.district": regex },
        { "address.city": regex },
        {"address.area":regex},
        { "details.name": regex },
      ];
    }

    if (filters.isActive === true || filters.isActive === "true") {
      matchQuery.isActive = true;
    }

    // if (filters.state) matchQuery["address.state"] = filters.state;
    // if (filters.district) matchQuery["address.district"] = filters.district;
    // if (filters.city) matchQuery["address.city"] = filters.city;
if (filters.state)
  matchQuery["address.state"] = { $regex: `^${filters.state.trim()}$`, $options: "i" };
// if (filters.district)
//   matchQuery["address.district"] = { $regex: `^${filters.district.trim()}$`, $options: "i" };

if (filters.district) {
  if (Array.isArray(filters.district)) {
    matchQuery["address.district"] = { $in: filters.district };
  } else {
    matchQuery["address.district"] = {
      $regex: `^${filters.district.trim()}$`,
      $options: "i"
    };
  }
}
if (filters.area) {
  if (Array.isArray(filters.area)) {
    matchQuery["address.area"] = { $in: filters.area };
  } else {
    matchQuery["address.area"] = {
      $regex: `^${filters.area.trim()}$`,
      $options: "i"
    };
  }
}
if (filters.city) {
  if (Array.isArray(filters.city)) {
    matchQuery["address.city"] = { $in: filters.city };
  } else {
    matchQuery["address.city"] = {
      $regex: `^${filters.city.trim()}$`,
      $options: "i"
    };
  }
}
// if (filters.area)
//   matchQuery["address.area"] = { $regex: `^${filters.area.trim()}$`, $options: "i" };
// if (filters.city)
//   matchQuery["address.city"] = { $regex: `^${filters.city.trim()}$`, $options: "i" };
    if (filters.userType) {
      matchQuery.userType = {
        $regex: `^${filters.userType.trim()}$`,
        $options: "i",
      };
    }

    let pipeline = [];

    // if (filters.latitude && filters.longitude) {
    // const distance=  filters.distance?filters.distance:10;
    //   pipeline.push({
    //     $geoNear: {
    //       near: {
    //         type: "Point",
    //         coordinates: [
    //           Number(filters.longitude), 
    //           Number(filters.latitude),  
    //         ],
    //       },
    //       distanceField: "distance",
    //       maxDistance: distance * 1000, // 10km
    //       spherical: true,
    //       query: matchQuery,
    //     },
    //   });
    // } else {
    //   pipeline.push({ $match: matchQuery });
    // }
if (filters.latitude && filters.longitude) {
  //const distance = filters.distance ? filters.distance : 0;
const distance = Number(filters.distance) || 0;

  // pipeline.push({
  //   $geoNear: {
  //     near: {
  //       type: "Point",
  //       coordinates: [
  //         Number(filters.longitude),
  //         Number(filters.latitude),
  //       ],
  //     },
  //     distanceField: "distance",
  //     maxDistance: distance * 1000,
  //     spherical: true,
  //   },
  // });
  pipeline.push({
  $geoNear: {
    near: {
      type: "Point",
      coordinates: [
        Number(filters.longitude),
        Number(filters.latitude),
      ],
    },
    distanceField: "distance",
    maxDistance: distance * 1000,
    spherical: true,
    query: matchQuery,
  },
});
pipeline.push({
  $addFields: {
    distanceKm: {
      $round: [
        { $divide: ["$distance", 1000] },
        2
      ]
    }
  }
});

  if (Object.keys(matchQuery).length) {
    pipeline.push({ $match: matchQuery });
  }

} else {
  pipeline.push({ $match: matchQuery });
}
    pipeline.push(
      {
        $addFields: {
          planPriority: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      { $eq: ["$details.plan.addonsPlan.isActive", true] },
                      { $eq: ["$details.plan.addonsPlan.details.state", true] },
                    ],
                  },
                  then: 1,
                },
                {
                  case: {
                    $and: [
                      { $eq: ["$details.plan.addonsPlan.isActive", true] },
                      { $eq: ["$details.plan.addonsPlan.details.district", true] },
                    ],
                  },
                  then: 2,
                },
                {
                  case: {
                    $and: [
                      { $eq: ["$details.plan.addonsPlan.isActive", true] },
                      { $eq: ["$details.plan.addonsPlan.details.city", true] },
                    ],
                  },
                  then: 3,
                },
                {
                  case: {
                    $and: [
                      { $eq: ["$details.plan.addonsPlan.isActive", true] },
                      { $eq: ["$details.plan.addonsPlan.details.area", true] },
                    ],
                  },
                  then: 4,
                },
                {
                  case: { $eq: ["$details.plan.basePlan.isActive", true] },
                  then: 5,
                },
                {
                  case: { $eq: ["$details.plan.jobPlan.isActive", true] },
                  then: 6,
                },
              ],
              default: 99,
            },
          },
        },
      },
      {
        $sort: {
          planPriority: 1,
          distance: 1, 
          _id: -1,
        },
      }
    );

    const users = await userModel.aggregate(pipeline);

    if (!users.length) {
      return res.json({ status: "error", message: "No data found" });
    }

    return res.json({
      status: "Success",
      total: users.length,
      data: users,
    });

  } catch (error) {
    console.error(error);
    return res.json({ status: "error", message: error.message });
  }
};

 exports.userRegister = async (req, res) => {
  try {

    const {
      userId,
      name,
      dob,
      password,
      userType,
      email,
      mobileNumber,
      address,
      details,
      location,
      oldImageUrl,
      oldCertificatesUrl,
      oldLogoImageUrl
    } = req.body;

    let parsedAddress = {};
    let parsedDetails = {};
   const isAdmin =
  req.body.isAdmin === true ||
  req.body.isAdmin === "true";
    // PARSE JSON
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        return res.json({
          status: "error",
          message: "Address is not valid JSON"
        });
      }
    }

    if (details) {
      try {
        parsedDetails = JSON.parse(details);
      } catch (e) {
        return res.json({
          status: "error",
          message: "Details is not valid JSON"
        });
      }
    }
    if (userId == "0") {

      if (
        !name ||
        !dob ||
        !userType ||
        !email ||
        !mobileNumber
      ) {
        return res.json({
          status: "error",
          message: "Missing fields"
        });
      }
    if (!isAdmin) {
        const duplicateUser = await userModel.findOne({
          $or: [
            { email: email.trim() },
            { mobileNumber: mobileNumber.trim() }
          ],
          isActive: true
        });

        if (duplicateUser) {
          return res.json({
            status: "error",
            message: "User email or mobile number already exists"
          });
        }
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      // const counter = await userIds.findOneAndUpdate(
      //   { id: "userId" },
      //   { $inc: { userId: 1 } },
      //   { upsert: true, new: true }
      // );

      // const newUserId = `LYD${counter.userId}`;

      const state = parsedAddress.state.trim();

      const counter = await userIds.findOneAndUpdate(
        { state: state },
        { $inc: { counter: 1 } },
        { new: true }
      );

      if (!counter) {
        return res.json({
          status: "error",
          message: "State not configured"
        });
      }

      const newUserId = `${counter.prefix}${counter.counter}`;
      console.log("New User ID:", newUserId);
      console.log("Generated User ID:", newUserId);

      console.log("User object:");
  console.log("User object:");
      const images = [];
      const certificates = [];
      const logoImages = [];

      if (req.files && req.files.length > 0) {

        for (const file of req.files) {
    console.log("===============");
    console.log("Name:", file.originalname);
    console.log("Mime:", file.mimetype);
    console.log("Field:", file.fieldname);
    console.log("Size:", file.size);
          const uploadedUrl = await uploadToS3(file);

          switch (file.fieldname) {

            case "image":
              images.push(uploadedUrl);
              break;

            case "certificates":
              certificates.push(uploadedUrl);
              break;

            case "logoImage":
              logoImages.push(uploadedUrl);
              break;
          }
        }
      }

      const addressUpdate = {

        addressLine1: parsedAddress.addressLine1 || "",
        addressLine2:parsedAddress.addressLine2 || "",

         addressLine1: parsedAddress.addressLine1 || "",

       addressLine2:parsedAddress.addressLine2 || "",
        state: parsedAddress.state || "",
        district: parsedAddress.district || "",
        city: parsedAddress.city || "",
        area: parsedAddress.area || "",
        pincode: parsedAddress.pincode || "",
      };

      if (parsedAddress.latitude && parsedAddress.longitude) {

        addressUpdate.geoLocation = {
          type: "Point",
          coordinates: [
            Number(parsedAddress.longitude),
            Number(parsedAddress.latitude)
          ]
        };
      }
    
      // CREATE USER
       const newUser = new userModel({
        userId: newUserId,
        name,
        dob,
        password: hashedPassword,
        userType,
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        location: location || "",
        address: addressUpdate,
        details: parsedDetails,
        image: images,
        certificates: certificates,
        logoImage: logoImages,

        adminDetails: {
          isAdmin: req.body.isAdmin || false,
          adminId: req.body.isAdmin
              ? req.body.adminId : "",
          branch: []
        }
      });
    // SAVE USER
     await newUser.save();
     console.log(JSON.stringify(newUser.toObject(), null, 2));

     // SEND EMAIL
  //  try {
  //  const response = await axios.post(`${process.env.base_url}lyd/user/create_email`,
  //         {
  //           userId: newUserId,
  //           subject: "New Registration",
  //           title: "new",
  //           message: "new user added successfully"
  //         }
  //       );
  //      console.log("Mail response:", response.data);
  // } catch (mailError) {

       // SEND EMAIL
      //  try {
      //  const response = await axios.post(`${process.env.base_url}lyd/user/create_email`,
      //         {
      //           userId: newUserId,
      //           subject: "New Registration",
      //           title: "new",
      //           message: "new user added successfully"
      //         }
      //       );
      //      console.log("Mail response:", response.data);
      // } catch (mailError) {
     //       console.log("Mail send failed:", mailError.message);
      //     }
 //await sendRegistrationOtp(newUserId);

      if (
        userType !== "admin" &&
        userType !== "superAdmin" &&
        userType !== "Job Seekers"&&!isAdmin
      ) {

        await assignFreePlanToUser(newUserId, userType);
      }
      return res.json({
        status: "success",
        message: "User registered successfully",
        data: newUser
      });
    }
    else {

      const existingUser = await userModel.findOne({ userId });

      if (!existingUser) {

        return res.json({
          status: "error",
          message: "User not found"
        });
      }

      let parsedOldImages = [];
      let parsedOldCertificates = [];
      let parsedOldLogoImages = [];

      if (oldImageUrl)
        parsedOldImages = JSON.parse(oldImageUrl);

      if (oldCertificatesUrl)
        parsedOldCertificates = JSON.parse(oldCertificatesUrl);

      if (oldLogoImageUrl)
        parsedOldLogoImages = JSON.parse(oldLogoImageUrl);

      let profileImages = parsedOldImages || [];
      let certificatesArr = parsedOldCertificates || [];
      let logoImagesArr = parsedOldLogoImages || [];
      
    if (req.files && req.files.length > 0) {
    console.log("REQ FILES =", req.files);

     for (const file of req.files) {
      console.log("FIELDNAME =", file.fieldname);

     const uploadedUrl = await uploadToS3(file);

     console.log("UPLOADED URL =", uploadedUrl);

    switch (file.fieldname) {
      case "image":
        console.log("IMAGE FOUND");
        profileImages.push(uploadedUrl);
        break;

      case "certificates":
        console.log("CERT FOUND");
        certificatesArr.push(uploadedUrl);
        break;

      case "logoImage":
        console.log("LOGO FOUND");
        logoImagesArr.push(uploadedUrl);
        break;

      default:
        console.log("UNKNOWN FIELD =", file.fieldname);
    }
  }
}
  console.log("profileImages =", profileImages);
  console.log("certificatesArr =", certificatesArr);
      profileImages = [...new Set(profileImages)];
      certificatesArr = [...new Set(certificatesArr)];
      logoImagesArr = [...new Set(logoImagesArr)];

      // UPDATE ADDRESS
     const addressUpdate = {
        addressLine1: parsedAddress.addressLine1 || "",
        addressLine2:parsedAddress.addressLine2 || "",
        state: parsedAddress.state || "",
        district: parsedAddress.district || "",
        city: parsedAddress.city || "",
        area: parsedAddress.area || "",
        pincode: parsedAddress.pincode || "",
      };

      if (parsedAddress.latitude && parsedAddress.longitude) {

        addressUpdate.geoLocation = {
          type: "Point",
          coordinates: [
            Number(parsedAddress.longitude),
            Number(parsedAddress.latitude)
          ]
        };
      }
      const mergedDetails = {
        ...(existingUser.details || {}),
        ...(parsedDetails || {}),

        collegeDetails: {
          ...(existingUser.details?.collegeDetails || {}),
          ...(parsedDetails?.collegeDetails || {})
        },

    experienceDetails:
    parsedDetails?.experienceDetails ||
    existingUser.details?.experienceDetails || []
   };
      const mergedAddress = {
        ...(existingUser.address || {}),
        ...addressUpdate
      };
      const updateFields = {
        name,
        dob,
        userType,
        email: email?.trim(),
        mobileNumber: mobileNumber?.trim(),
        location,
        address:mergedAddress,
        details:mergedDetails,
        // address: addressUpdate,
        // details: parsedDetails,
        image: profileImages,
        certificates: certificatesArr,
        logoImage: logoImagesArr,
        updatedDate: Date.now()
      };

      const updatedUser = await userModel.findOneAndUpdate(
        { userId },
        { $set: updateFields },
        { new: true }
      );

      return res.json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser
      });
    }
   } catch (error) {
   console.error("REGISTER ERROR:", error);
   return res.json({
      status: "error",
      message: error.message
    });
  }
};
//neww
// exports.userRegister = async (req, res) => {
//   try {
//     const {
//       userId,
//       name,
//       dob,
//       password,
//       userType,
//       email,
//       mobileNumber,
//       address,
//       details,
//       location,
//       oldImageUrl,
//       oldCertificatesUrl,
//       oldLogoImageUrl
//     } = req.body;

//     let parsedAddress = address ? JSON.parse(address) : {};
//     let parsedDetails = details ? JSON.parse(details) : {};

  
//     if (userId == "0") {

//       const duplicateUser = await userModel.findOne({
//         $or: [{ email }, { mobileNumber }],
//         isActive: true
//       });

//       if (duplicateUser) {
//         return res.json({
//           status: "error",
//           message: "User already exists"
//         });
//       }

//       const hashedPassword = await bcryptjs.hash(password, 10);

//       const counter = await userIds.findOneAndUpdate(
//         { id: 'userId' },
//         { $inc: { userId: 1 } },
//         { upsert: true, new: true }
//       );

//       const newUserId = `LYD${counter.userId}`;

    
//       let images = [], certificates = [], logoImages = [];

//       if (req.files) {
//         for (const file of req.files) {
//           const url = await uploadToS3(file);

//           if (file.fieldname === "image") images.push(url);
//           if (file.fieldname === "certificates") certificates.push(url);
//           if (file.fieldname === "logoImage") logoImages.push(url);
//         }
//       }

//       const newUser = new userModel({
//         userId: newUserId,
//         name,
//         dob,
//         password: hashedPassword,
//         userType,
//         email,
//         mobileNumber,
//         location,
//         address: parsedAddress,
//         details: parsedDetails,
//         image: images,
//         certificates,
//         logoImage: logoImages,
//         adminDetails: {
//           isAdmin: false,
//           adminId: newUserId
//         }
//       });

//       await newUser.save();

//       return res.json({
//         status: "success",
//         message: "User created",
//         data: newUser
//       });
//     }


//     else {

//       const existingUser = await userModel.findOne({ userId });

//       if (!existingUser) {
//         return res.json({
//           status: "error",
//           message: "User not found"
//         });
//       }

//       let profileImages = oldImageUrl ? JSON.parse(oldImageUrl) : [];
//       let certificatesArr = oldCertificatesUrl ? JSON.parse(oldCertificatesUrl) : [];
//       let logoImagesArr = oldLogoImageUrl ? JSON.parse(oldLogoImageUrl) : [];

//       if (req.files) {
//         for (const file of req.files) {
//           const url = await uploadToS3(file);

//           if (file.fieldname === "image") profileImages.push(url);
//           if (file.fieldname === "certificates") certificatesArr.push(url);
//           if (file.fieldname === "logoImage") logoImagesArr.push(url);
//         }
//       }

//       const updateFields = {
//         name,
//         dob,
//         email,
//         mobileNumber,
//         location,
//         userType,
//         address: parsedAddress,
//         details: parsedDetails,
//         image: [...new Set(profileImages)],
//         certificates: [...new Set(certificatesArr)],
//         logoImage: [...new Set(logoImagesArr)],
//         updatedDate: Date.now()
//       };

//       const updatedUser = await userModel.findOneAndUpdate(
//         { userId },
//         { $set: updateFields },
//         { new: true }
//       );

//       return res.json({
//         status: "success",
//         message: "User updated",
//         data: updatedUser
//       });
//     }

//   } catch (error) {
//     console.error(error);
//     res.json({ status: "error", message: error.message });
//   }
// };
//   exports.userRegister = async (req, res) => {
//   try {
//   const { userId, name,dob,description, password, userType, email, mobileNumber, address, details,location,oldImageUrl, oldCertificatesUrl,
//   oldLogoImageUrl} = req.body;
//   let parsedAddress, parsedDetails;

//    if (address) {
//       try { parsedAddress = JSON.parse(address); } 
//       catch { return res.json({ status: "error", message: "Address is not valid JSON" }); }
//    }
//     if (details) {
//       try { parsedDetails = JSON.parse(details); } 
//       catch { return res.json({ status: "error", message: "Details is not valid JSON" }); }
//     }
//     // const images = req.files?.image || [];
//     // const certificates = req.files?.certificates || [];
//     // const logoImages = req.files?.logoImage || []; 

//     if (userId == "0") {
//      // if (!name || !dob||  !userType ||!martialStatus|| !email || !mobileNumber || !parsedAddress || !parsedDetails)
//     if (!name || !dob||  !userType || !email || !mobileNumber || !parsedAddress || !parsedDetails)

//         return res.json({ status: "error", message: "Missing fields" });

//      // if (images.length === 0) return res.json({ status: 'error', message: 'At least one profile image is required' });

//      // const duplicateUser = await userModel.find({ $or: [{ email }, { mobileNumber }] });
//      // 1. Check admin
//     let duplicateUser;
//    // if(!req.body.isAdmin){
//      duplicateUser = await userModel.findOne({
//     $or: [
//     { email: email },
//     { mobileNumber: mobileNumber }
//     ],
//     "adminDetails.isAdmin": false,
//     isActive: true
//     });

// ///
//   if (duplicateUser) {
//     return res.json({
//       status: "error",
//       message: "User email or mobile number already exists"
//     });
//   }
// //}

//   const adminUser = await userModel.findOne({
//   $or: [{ email }, { mobileNumber }],
//   "adminDetails.isAdmin": true,
//   isActive: true
//    });
// //console.log(`sdminid${adminUser.adminDetails?.adminId}`)
//   if (!duplicateUser||adminUser&& req.body.adminId==adminUser.adminDetails?.adminId) {
   
//         // if (password) updateFields.password = await bcryptjs.hash(adminUser.password, 10);
//  let hashedPassword ;
//         if(!adminUser){
//       hashedPassword = await bcryptjs.hash(password, 10);
//  }
//  else{
//   hashedPassword=adminUser.password;
//  }
//       console.log("req.body:", req.body);
//       console.log("req.files:", req.files);

//       const counter = await userIds.findOneAndUpdate(
//         { id: 'userId' }, { $inc: { userId: 1 } }, { upsert: true, new: true }
//       );
//       const newUserId = `LYD${counter.userId}`;
//       //  const imagePaths = images.map(file => file.location);
//       //  console.log(`dfimagpath${imagePaths}`)
//       //  const certificatePaths = certificates.map(file => file.location);
//       //  const logoImagesPath = logoImages.map(file => file.location);
//     const images = [];
//     const certificates = [];
//     const logoImages = [];

//     for (const file of req.files) {
//     const uploadedUrl = await uploadToS3(file); 
//     console.log(`ghhg${uploadedUrl}`)
//     switch (file.fieldname) {
//     case "image":
//       images.push(uploadedUrl);
//       break;
//     case "certificates":
//       certificates.push(uploadedUrl);
//       break;
//     case "logoImage":
//       logoImages.push(uploadedUrl);
//       break;
//      }
//       }

// const addressUpdate = {
//   state: parsedAddress.state || "",
//   district: parsedAddress.district || "",
//   city: parsedAddress.city || "",
//   area: parsedAddress.area || "",
//   pincode: parsedAddress.pincode || "",
// };

// if (parsedAddress.latitude && parsedAddress.longitude) {
//   addressUpdate.geoLocation = {
//     type: 'Point',
//     coordinates: [
//       Number(parsedAddress.longitude), // longitude first
//       Number(parsedAddress.latitude)   // latitude second
//     ],
//   };
// }
//         // const newUser = new userModel({
//         // userId: newUserId,
//         // name,dob, password: hashedPassword, userType, email, mobileNumber,martialStatus,
//         // address: parsedAddress, details: parsedDetails,
//         // image: images,
//         // certificates: certificates,
//         // logoImage: logoImages, 
//         // });
//   const newUser = new userModel({
//   userId: newUserId,
//   name,
//   dob,
//   // martialStatus,
//   password: hashedPassword,
//  // description:description??"",
//   location:location,
//   userType,
//   email,
//   mobileNumber,
//    address:addressUpdate,
//   details: parsedDetails,
//   image: images,
//   certificates: certificates,
//   logoImage: logoImages,
//   adminDetails: {
//   isAdmin: req.body.isAdmin,
//   adminId: req.body.isAdmin ? newUserId : req.body.adminId
// }
// });
//   //  const loginModel= userLoginModel({userId:newUserId,email:email,password:hashedPassword,userType:userType})
//   //        await loginModel.save()
//           await newUser.save();
//   //     //sendWhatsAppTemplate("918489792275", "client_welcome_2",[name])
//   //     await sendWhatsAppTemplate(`${mobileNumber}`, "client_welcome_2",[name])
   
//       const response = await axios.post( `${process.env.base_url}lyd/user/create_email`,
//       {
//         userId: newUserId,
//         subject: "New Registeration",
//         title: "new",
//         message: "new user added successfully"
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           //Authorization: `Bearer ${token}`
//         }
//       }
//     );
//    console.log("Mail response:", response.data);
//    console.error( "Mail error:", error.response?.data || error.message );
//        await sendRegistrationOtp(newUserId); 
//    if (userType !== 'admin' && userType !== 'superAdmin' && userType !== 'Job Seekers') {
//      await assignFreePlanToUser(newUserId,userType)
//    }
//     res.json({ status: "success", message: "User registered successfully", data: newUser });
//    } 
//   } else {
//     const existingUser = await userModel.findOne({ userId });
//   if (!existingUser) return res.json({ status: "error", message: "User not found" });
// let parsedOldImages = [];
// let parsedOldCertificates = [];
// let parsedOldLogoImages = [];

// if (oldImageUrl) parsedOldImages = JSON.parse(oldImageUrl);
// if (oldCertificatesUrl) parsedOldCertificates = JSON.parse(oldCertificatesUrl);
// if (oldLogoImageUrl) parsedOldLogoImages = JSON.parse(oldLogoImageUrl);
// // let profileImages = existingUser.image || [];
// // let certificatesArr = existingUser.certificates || [];
// // let logoImagesArr = existingUser.logoImage || [];
// let profileImages = parsedOldImages || [];
// let certificatesArr = parsedOldCertificates || [];
// let logoImagesArr = parsedOldLogoImages || [];

//       // if (images.length) profileImages.push(...images.map(f => f.path));
//       // if (certificates.length) certificatesArr.push(...certificates.map(f => f.path));
     
//   if (req.files && req.files.length > 0) {
//   for (const file of req.files) {
//     const uploadedUrl = await uploadToS3(file);

//     switch (file.fieldname) {
//       case "image":
//         profileImages.push(uploadedUrl);
//         break;

//       case "certificates":
//         certificatesArr.push(uploadedUrl);
//         break;

//       case "logoImage":
//         logoImagesArr.push(uploadedUrl);
//         break;
//     }
//   }
// }
//    //  if (images.length) profileImages.push(...images.map(f => f.location));
//       // if  (certificates.length) certificatesArr.push(...certificates.map(f => f.location));
//       // if  (logoImages.length) logoImages.push(...logoImages.map(f => f.location));
// profileImages = [...new Set(profileImages)];
// certificatesArr = [...new Set(certificatesArr)];
// logoImagesArr = [...new Set(logoImagesArr)];
//       const updateFields = {};
//       if (name) updateFields.name = name;
//       // if (username) updateFields.username = username;
//      // if (password) updateFields.password = await bcryptjs.hash(password, 10);
//       if (userType) updateFields.userType = userType;
//       if (dob) updateFields.dob=dob;
//       if (email) updateFields.email = email;
//       if (location) updateFields.location = location;
//       // if (martialStatus) updateFields.martialStatus=martialStatus;
//       if (mobileNumber) updateFields.mobileNumber = mobileNumber;
//       if (parsedAddress) updateFields.address = parsedAddress;
//       if (parsedDetails) updateFields.details = parsedDetails;
//       updateFields.image = profileImages;
//       updateFields.certificates = certificatesArr;
//       updateFields.logoImage = logoImagesArr;
//       updateFields.updatedDate = Date.now();
//      // const parsedAddress = JSON.parse(req.body.address || "{}");
// const latitude = parsedAddress.latitude;
// const longitude = parsedAddress.longitude;

// // Build the address object to update
// const addressUpdate = {
//   state: parsedAddress.state,
//   district: parsedAddress.district,
//   city: parsedAddress.city,
//   area: parsedAddress.area,
//   pincode: parsedAddress.pincode,
// };

// // Only add geoLocation if latitude & longitude are present
// if (latitude && longitude) {
//   addressUpdate.geoLocation = {
//     type: 'Point',
//     coordinates: [Number(longitude), Number(latitude)], 
//   };
// }

// // Merge with updateFields
// updateFields.address = addressUpdate;
//       const updatedUser = await userModel.findOneAndUpdate({ userId }, { $set: updateFields }, { new: true });
//       return res.json({ status: "success", message: "User updated successfully", data: updatedUser });
//     }
//     } catch (error) {
//     console.error(error);
//     res.json({ status: "error", message: error.message });
//   }
// };
//watsapp
const PHONE_NUMBER_ID = `${process.env.PHONE_NUMBER_ID}`;;
const TOKEN = `${process.env.WHATSAPP_ACCESS_TOKEN}`;
const API_URL = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

// Function to send WhatsApp message
async function sendWhatsAppTemplate(toNumber, templateName, templateParams = []) {
  try {
    // const response = await axios.post(
    //   API_URL,
    //   {
    //     messaging_product: "whatsapp",
    //     to: toNumber,
    //     type: "text",
    //     text: { body: message }
    //   },
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${TOKEN}`,
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );
    const response = await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to: toNumber,
        type: "template",
        template: {
          name: "client_welcome_2",         
          language: { code: "en" },
          components: templateParams.length > 0 ? [
            {
              type: "body",
              parameters: templateParams.map(param => ({
                type: "text",
                text: param
              }))
            }
          ] : []
        }
      },
      {
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
}
const calculatePlanDates = (durationInDays) => {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + durationInDays);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

const assignFreePlanToUser = async (newUserId, userType) => {
  try {
    const plan = await planModel.findOne({
      userType: userType,
      isActive: true,
      planName: "Free",
    });
   console.log(`${userType}`)
    if (!plan) {
      throw new Error("Free plan not found");
    }

    const planId = plan.planId;
    const planName = plan.planName;
    const price = plan.price;
    const duration = Number(plan.duration); 
    const { startDate, endDate } = calculatePlanDates(duration);
    const user = await userModel.findOne({ userId:newUserId,isActive:true});

    // const token = jwt.sign(
    //   { userId: user.userId, userName: user.name, userType: user.userType },
    //   secret,
    //   { expiresIn: '1d' } );
  
    // 3. Create user plan
    const response = await axios.post(
      `${process.env.base_url}lyd/plans/create_userPlan`,
      {
        userId: newUserId,
        planId: planId,
        planName: planName,
        price: price,
        startDate: startDate,
        endDate: endDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
         //   Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error assigning free plan:", error.message);
    throw error;
  }
};
// exports.verifyRegistrationOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp)
//       return res.send({ status: "error", message: "" });

//      if (req.file) {
//       appLogo = await uploadToS3(req.file);
//     } 
//    return res.send({ status: "success", message: "Email verified successfully" });
//   } catch (err) {
//     return res.status(500).send({ status: "error", message: err.message });
//   }
// }
  exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.send({ status: "error", message: "Email and OTP are required" });

    const user = await userModel.findOne({ email, isActive: true });
    if (!user) return res.send({ status: "error", message: "User not found" });

    // Check OTP
    if (user.details.emailOtp !== Number(otp))
      return res.send({ status: "error", message: "Invalid OTP" });

    // Check expiry
    if (user.details.emailOtpExpiry < Date.now())
      return res.send({ status: "error", message: "OTP has expired" });

    // OTP verified successfully
    await userModel.findOneAndUpdate(
      { userId: user.userId },
      {
        $set: {
          isEmailVerified: true,
          "details.emailOtp": null,
          "details.emailOtpExpiry": null,
        },
      }
    );

    return res.send({ status: "success", message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).send({ status: "error", message: err.message });
  }
};
  exports.resendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ status: "error", message: "Email is required" });

    const user = await userModel.findOne({ email, isActive: true });
    if (!user) return res.json({ status: "error", message: "User not found" });

    if (user.isEmailVerified) {
      return res.json({ status: "error", message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save to user
    await userModel.findOneAndUpdate(
      { userId: user.userId },
      { $set: { "details.emailOtp": otp, "details.emailOtpExpiry": otpExpiry } }
    );

    // Send email
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.nodemail_username,
    //     pass: process.env.nodemail_password,
    //   },
    // });

    const templatePath = path.join(__dirname, "template", "otp_template.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);

    const htmlContent = template({
      otp: otp,
      name: user.name ?? "",
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: `"LYD" <${process.env.nodemail_username}>`,
      to: email,
      subject: "LYD OTP Verification Mail",
      html: htmlContent,
    });

    return res.json({ status: "success", message: "OTP resent to email" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
   exports.loginUser = async (req, res) => {
    try {
    const { email, password } = req.body;
   const user = await userModel.findOne({email: new RegExp(`^${email.trim()}$`, "i"),isActive:true,});
   // let user = await userModel.findOne({ email: email, isActive: true, "adminDetails.isAdmin": true });
    let userDetails;
    //if(!user){
         //userDetails = await userModel.findOne({ email: email, isActive: true,});
    userDetails = await userModel.findOne( {   email: new RegExp(`^${email.trim()}$`, "i"),isActive: true }, { sort: { createdDate: 1 } });

  //}
    if (!userDetails) return res.json({ status: "error", message: 'User does not exist' });
  // if (!user.isEmailVerified) {
  //     return res.json({ status: "error", message: "Email not verified. Please verify your email before login." });
  //   }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) return res.json({ status: "error", message: 'Invalid password' });
    const token = jwt.sign(
      { userId: user.userId, userName: user.name, userType: user.userType },
      secret,
      { expiresIn: '1d' } );
     
     res.send({ status: 'success', authToken: `${token}`, data: user});
   } catch (err) {
    res.send({ status: 'error', message: err.message });
   }
  };
  exports.switchUser = async (req, res) => {
    try {

    const { userId } = req.body;
       let user  = await userModel.findOne( {  userId :userId, isActive: true });
    if (!user) return res.json({ status: "error", message: 'User does not exist' });
    const token = jwt.sign(
      { userId: user.userId, userName: user.name, userType: user.userType },
      secret,
      { expiresIn: '1y' } );
     
     res.send({ status: 'success', authToken: `${token}`, data: user});
   } catch (err) {
    res.send({ status: 'error', message: err.message });
   }
  };

  exports.getAllBranches = async (req, res) => {
    try {
    const { email } = req.body;
    const user = await userModel.findOne({email:email},{isActive:true});

    if (!user) return res.json({ status: "error", message: 'User does not exist' });
     const getBranches = await userModel.find({email:email});
     res.json({ status: 'success', data:getBranches});
   } catch (err) {
    res.send({ status: 'error', message: err.message });
   }
  };

   exports.changeAppLogo = async (req, res) => {
   try {
    if (!req.file) {
      return res.status({
        status: "error",
        message: "File not found"
      });
    }

    const imageUrl = await uploadToS3(req.file);

    const changeLogo=  await appLogoModel.updateOne(
      {userId:req.user.userId },
      { $set: { appLogo: imageUrl,} },
      { upsert: true,new:true }
    );
     if(changeLogo){
     return res.json({
      status: "success",
      message: "App logo uploaded successfully",
      data: imageUrl
    });
    }
    else{
    return res.json({
      status: "error",
      message: "App logo not uploaded",
     
    }); 
    }
   } catch (err) {
    return res.json({
      status: "error",
      message: err.message
    });
  }
  };

 exports.getAppLogo = async (req, res) => {
  try {

  const appImage= await appLogoModel.find({}
     //  { userId:req.user.userId } ,
    );
const urls = appImage.map(img => img.appLogo); 
console.log(`ie${urls}`)
    return res.json({
      status: "success",
      //message: "App logo uploaded successfully",
      data: urls
    });

  } catch (err) {
    return res.send({
      status: "error",
      message: err.message
    });
  }
};
  
  exports.changePassword = async (req, res) => {
    try {
    const { userId, newPassword,oldPassword } = req.body;
    const user = await userModel.findOne({userId:userId});

    if (!user) return res.json({ status: "error", message: 'User does not exist' });
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) return res.json({ status: "error", message: 'old password is wrong' });
     const hashedPassword = await bcryptjs.hash(newPassword, 10);
     const addPassword = await userModel.findOneAndUpdate({userId:userId},{$set:{password:hashedPassword}});
     const email=addPassword.email;
      const loginModel= userLoginModel.find({email:email},{$set:{password:hashedPassword}});
      const userModel1= userModel.find({email:email},{$set:{password:hashedPassword}});
     res.json({ status: 'success', message:"password updated successfully"});
   } catch (err) {
    res.status({ status: 'error', message: err.message });
   }
  };
   exports.forgotChangePassword = async (req, res) => {
    try {
    const { mail, newPassword, } = req.body;
    const user = await userModel.findOne({email:mail,isActive:true});
   if (!user) return res.json({ status: "error", message: 'User does not exist' });
   //  const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
   // if (!isPasswordValid) return res.json({ status: "error", message: 'old password is wrong' });
     const hashedPassword = await bcryptjs.hash(newPassword, 10);
     const addPassword = await userModel.findOneAndUpdate({email:mail},{$set:{password:hashedPassword}});
       const email=addPassword.email;
      //const loginModel= userLoginModel.find({email:email},{$set:{password:hashedPassword}});
            //const users= userModel.find({email:email},{$set:{password:hashedPassword}});
     res.send({ status: 'success', message:"password Changed successfully"});
   } catch (err) {
    res.send({ status: 'error', message: err.message });
   }
  };
  
  exports.forgotPassword = async (req, res) => {
  try {
    const { mail } = req.body;
    const user = await userModel.findOne({email:mail,isActive:true});
    if (!user) return res.json({ status: "error", message: 'No record was found for the provided user information. Please register to create a new account.' });
    else{
    generateOtp=Math.floor(1000+Math.random()*9000)
    console.log(`otp${generateOtp}`)
     // user.details.resetOtp = generateOtp;
     const otpExpiry = Date.now() + 10 * 60 * 1000;
    await userModel.findOneAndUpdate({userId:user.userId},{$set:{"details.resetOtp":generateOtp,"details.otpExpiry":otpExpiry}});
    // const transporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: `${process.env.nodemail_username}`,
    //     pass: `${process.env.nodemail_password}`,
    //   }
    // });
      const renderTemplate = (templateName, data) => {
      const templatePath = path.join(
        __dirname,
        "template",         
        `${templateName}.hbs`
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }
      const source = fs.readFileSync(templatePath, "utf8");
      return handlebars.compile(source)(data);
      };
      const htmlContent = renderTemplate("otp_template", {
      otp:generateOtp??"",
      name:user.name??"",
      year: new Date().getFullYear()
    });
     await transporter.sendMail({
      from: `"LYD" <${process.env.nodemail_username}>`,
      to: mail,
      subject:"LYD OTP Verification Mail",
      html: htmlContent
     });
     }
    res.json({ status: 'success', message:"check your mail and verify password"});
   } catch (err) {
    res.send({ status: 'error', message: err.message });
   }
  };

  exports.verifyOtp = async (req, res) => {
  try {
    const { mail, otp } = req.body;

    if (!mail || !otp) {
      return res.send({
        status: "error",
        message: "Email and OTP are required",
      });
    }

    const user = await userModel.findOne({ email:mail });

    if (!user) {
      return res.send({
        status: "error",
        message: "User not found",
      });
    }

    // Check OTP match
    if (user.details.resetOtp !== Number(otp)) {
      return res.send({
        status: "error",
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (user.details.otpExpiry < Date.now()) {
      return res.send({
        status: "error",
        message: "OTP has expired",
      });
    }

    // OTP verified successfully
    user.details.resetOtp = otp;
    console.log(user.details.otpExpiry);
      await userModel.findOneAndUpdate({userId:user.userId},{$set:{"details.resetOtp":otp,"details.otpExpiry":user.details.otpExpiry}});

    res.json({
      status: "success",
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status({
      status: "error",
      message: error.message,
    });
  }
};

exports.getUserbyId=async(req,res)=>{
const{userId}=req.body;
try{

//const user= await userModel.findOne({userId:userId,isActive:true});
const user= await userModel.findOne({userId:userId});
if(!user){
return res.json({status:"error",data:"user not found"})
}
else{
return res.json({status:"Success",data:user})
}
}
catch(error){
return res.json({status:"error",message:error.message})
}
}


 exports.uploadProfileImage=async(req,res)=>{
 const {userId}=req.body;
  try{
    if(!req.file){
        res.status({status:"error",message:"Image is not Uploaded"})
    }
     if(!userId){
        res.status({status:"error",message:"User Id is not found"})
    }
    const oldPath=`${req.file.path}`;
    const newPath=`${req.body.userId}${path.extname(req.file.originalname)}`;
    const newPathName=path.join('ProfilePictures',newPath)
    fs.renameSync(oldPath,newPathName)
    res.json({
    status:"success",
    message:"File uploaded Successfully",
    imagePath:newPathName
  });
  }
  catch(error){
    res.send({status:"error","message":error.message})
  }
}

  exports.deactivateUser=async(req,res)=>{
   const{userId,isActive}=req.query;
    try{
       const deactivateService= await userModel.find({userId:userId},)
       if(deactivateService.length<0){
        res.send({status:"error",message:"user not found"})
       }
      const deactivateService1= await userModel.findOneAndUpdate({userId:userId},{isActive:isActive})
       isActive==true? res.send({status:"success",message:"activated successfully",isActive:deactivateService1.isActive}):
       res.send({status:"success",message:"deactivated successfully",isActive:deactivateService1.isActive})
    }
    catch(error){
     res.send({status:"error",message:"not deactivated "})
    }
  }

  exports.welcome_email = async (req, res) => {
  try {
    const { userId, subject, message } = req.body;
    const getUserAddress = await userModel.findOne(
      { userId },
      { "address.state": 1, "address.district": 1, "address.city": 1, email: 1,name:1,password:1,mobileNumber:1, _id: 0 }
    );
    if (!getUserAddress) {
      return res.send({ status: "error", message: "user not found" });
    }

    const { state, district, city } = getUserAddress.address;
    const getAllAdmins = await userModel.find(
      {
        userType: "admin",
        "address.state": state,
        "address.district": district,
        "address.city": city
      },
      { email: 1, _id: 0 }
    );

    const getSuperAdmins = await userModel.find(
      { userType: "superAdmin" },
      { email: 1, _id: 0 }
    );

    const allMailIds = [
      ...new Set([
        ...getAllAdmins.map(u => u.email),
        ...getSuperAdmins.map(u => u.email)
      ])
    ];
    const adminEmailList = allMailIds.filter(Boolean).join(",");
    const renderTemplate = (templateName, data) => {
      const templatePath = path.join(
        __dirname,
        "template",         
        `${templateName}.hbs`
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }
      const source = fs.readFileSync(templatePath, "utf8");
      return handlebars.compile(source)(data);
      };
      console.log(getUserAddress.name)
      const htmlContent = renderTemplate("welcome_user", {
      username:getUserAddress.name,
      password:getUserAddress.password,
      loginUrl: `${process.env.base_url}/login`,
      year: new Date().getFullYear()
    });
      const htmlContent1 = renderTemplate("admin_notification", {
      userId:userId,
      name:getUserAddress.name,
      mobile:getUserAddress.mobileNumber,
      email:getUserAddress.email,
      registeredOn: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
  }),
  year: new Date().getFullYear()
});
    //  const transporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: `${process.env.nodemail_username}`,
    //     pass: `${process.env.nodemail_password}`,
    //   }
    // });

    await transporter.sendMail({
      from: `"LYD" <${process.env.nodemail_username}>`,
      to: adminEmailList,
      subject,
      html: htmlContent
    });
     await transporter.sendMail({
      from: `"LYD" <${process.env.nodemail_username}>`,
      to: getUserAddress.email,
      subject,
      html: htmlContent1
    });
    res.send({ status: "success", message: "Mail sent successfully" });

  } catch (error) {
    console.error(error);
    res.send({
      status: "error",
      message: `Mail not sent: ${error.message}`
    });
  }
};

  exports.create_email = async (req, res) => {
  try {
    const { userId, subject, message,title } = req.body;

    const getUserAddress = await userModel.findOne(
      { userId },
      { "address.state": 1, "address.district": 1, "address.city": 1, email: 1,name:1,password:1,mobileNumber:1, _id: 0 }
    );

    if (!getUserAddress) {
      return res.send({ status: "error", message: "user not found" });
    }
    const { state, district, city } = getUserAddress.address;
    const getAllAdmins = await userModel.find(
      {
        userType: "admin",
        "address.state": state,
        "address.district": district,
        "address.city": city
      },
      { email: 1, _id: 0 }
    );

    const getSuperAdmins = await userModel.find(
      { userType: "superAdmin" },
      { email: 1, _id: 0 }
    );

    const allMailIds = [
      ...new Set([
        ...getAllAdmins.map(u => u.email),
        ...getSuperAdmins.map(u => u.email)
      ])
    ];
  const appImage= await appLogoModel.find({}
     //  { userId:req.user.userId } ,
    
    );
  const appLogourls = appImage.map(img => img.appLogo); 
    const renderTemplate = (templateName, data) => {
      const templatePath = path.join(
        __dirname,
        "template",         
        `${templateName}.hbs`
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }
      const source = fs.readFileSync(templatePath, "utf8");
      return handlebars.compile(source)(data);
      };
      console.log(getUserAddress.name)
      const htmlContent = renderTemplate("welcome_user", {
      username:getUserAddress.name,
      password:getUserAddress.password,
      logoUrl:appLogourls[0],
      loginUrl: `${process.env.base_url}/lyd/user/login_user`,
      year: new Date().getFullYear()
    });
      const htmlContent1 = renderTemplate("admin_notification", {
      userId:userId,
      name:getUserAddress.name,
      mobile:getUserAddress.mobileNumber,
      email:getUserAddress.email,
            logoUrl:appLogourls[0],
      loginUrl: `${process.env.base_url}/lyd/user/login_user`,
     registeredOn: new Date().toLocaleDateString("en-IN", {
     day: "2-digit",
     month: "long",
     year: "numeric"
     }),
     year: new Date().getFullYear()
     });
    //  const transporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: `${process.env.nodemail_username}`,
    //     pass: `${process.env.nodemail_password}`,
    //   }
    // });
    const adminEmailList = allMailIds.filter(Boolean).join(",");

    await transporter.sendMail({
      from: `"LYD" <${process.env.nodemail_username}>`,
      to: adminEmailList,
      subject,
      html: htmlContent1
    });
     await transporter.sendMail({
      from: `"LYD" <${process.env.nodemail_username}>`,
      to: getUserAddress.email,
      subject,
      html: htmlContent
    });
    res.send({ status: "success", message: "Mail sent successfully" });

  } catch (error) {
    console.error(error.message);
    res.send({
      status: "error",
      message: `Mail not sent: ${error.message}`
    });
  }
};

const safe = v => (v === null || v === undefined ? "" : v);
//const formatDate = d => (d ? new Date(d).toLocaleDateString("en-IN") : "");
  // render handlebars template
  const formatDate = (d) => {
  if (!d || typeof d !== "string") return "";

  const parts = d.split("-");
  if (parts.length !== 3) return "";

  let [day, month, year] = parts;

  // normalize single-digit day/month
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  // basic validation
  if (
    day < 1 || day > 31 ||
    month < 1 || month > 12 ||
    year.length !== 4
  ) {
    return "";
  }

  return `${day}-${month}-${year}`;
};


const renderTemplate = (templateName, data) => {
  const templatePath = path.join(
    __dirname,
    "template",
    `${templateName}.hbs`
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const source = fs.readFileSync(templatePath, "utf8");
  const compiled = handlebars.compile(source);
  return compiled(data);
};

  exports.plan_email = async (req, res) => {
  try {
    const { userId, subject, planType,title } = req.body;
    const user = await userModel.findOne(
      { userId },
      {
        "address.state": 1,
        "address.district": 1,
        "address.city": 1,
        "address.area": 1,
        "address.pincode": 1,
        details: 1,
        email: 1,
        name: 1,
        mobileNumber: 1,
        userId: 1,
        _id: 0
      }
    );

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }
    const { state, district, city } = user.address || {};

    const admins = await userModel.find(
      {
        userType: "admin",
        "address.state": state,
        "address.district": district,
        "address.city": city
      },
      { email: 1, _id: 0 }
    );

    const superAdmins = await userModel.find(
      { userType: "superAdmin" },
      { email: 1, _id: 0 }
    );

    const allMailIds = [
      ...new Set([
        ...admins.map(a => a.email),
        ...superAdmins.map(s => s.email)
      ])
    ];
  const userPlan=await  userModel.findOne({userId:userId})
  const planDetails = userPlan?.details?.plan?.[planType];
  console.log(`titilr${planType}`)
  //console.log(`${planDetails.name}dd`)
    const emailData = {
      userId: safe(user.userId),
      userName: safe(user.name),
      userEmail: safe(user.email),
      mobileNumber: safe(user.mobileNumber),
      planName: planDetails?.name ?? "",
      startDate: planDetails?.startDate ?? "",
      expiryDate: planDetails?.endDate ?? "",
      //amount:plan.price??"",
      clinicName: safe(user.details?.name),
      website: safe(user.details?.website),
      companyName: safe(user.details?.name),

      area: safe(user.address?.area),
      city: safe(user.address?.city),
      district: safe(user.address?.district),
      state: safe(user.address?.state),
      pincode: safe(user.address?.pincode),
      activationMessage:title=="new"? "Your subscription has been successfully activated. Here are the details:":"Your plan Details",
      message:title=="new"? "NewPlan Purchased":"User Plan Details",
      basePlanActive: safe(user.details?.plan?.basePlan?.isActive),
      basePlanStartDate: formatDate(user.details?.plan?.basePlan?.startDate),
      basePlanEndDate: formatDate(user.details?.plan?.basePlan?.endDate),

      addonsPlanActive: safe(user.details?.plan?.addonsPlan?.isActive),
      addonsPlanStartDate: formatDate(user.details?.plan?.addonsPlan?.startDate),
      addonsPlanEndDate: formatDate(user.details?.plan?.addonsPlan?.endDate),

      jobPlanActive: safe(user.details?.plan?.jobPlan?.isActive),
      jobCount: safe(user.details?.plan?.jobPlan?.count?.jobCount),
      jobPlanStartDate: formatDate(user.details?.plan?.jobPlan?.startDate),
      jobPlanEndDate: formatDate(user.details?.plan?.jobPlan?.endDate),

      // message: safe(message),
      year: new Date().getFullYear()
    };

    const userHtml = renderTemplate("plan_activated", emailData);
    const adminHtml = renderTemplate("plan_activated_admin", emailData);

    // const transporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: `${process.env.nodemail_username}`,
    //     pass: `${process.env.nodemail_password}`,
    //   }
    // });
    const appImage = await appLogoModel
  .findOne({})
  .sort({ createdDate: -1 });

const appLogoUrl = appImage?.appLogo || "";
    await transporter.sendMail({
      from: `"${emailData.companyName}" <${process.env.nodemail_username}>`,
      to: user.email,
      subject: subject,
      html: userHtml,
   logoUrl: appLogoUrl
    });
   const adminEmailList = allMailIds.filter(Boolean).join(",");
    if (allMailIds.length) {
      await transporter.sendMail({
        from: `"LYD" <${process.env.nodemail_username}>`,
        to: adminEmailList,
        subject: subject,
        html: adminHtml,
        logoUrl: appLogourls[0]
      //   attachments: [
      //  {filename: 'logo.png',path:'./assets/tooth.png', cid: 'logo' }
      // ]
      });
      console.log("admin mails sent")
    }

    return res.send({
      status: "Success",
      message: "Plan email sent successfully"
    });

  } catch (error) {
    console.error("Plan Email Error:", error);
    return res.send({
      status: "error",
      message: "Internal Server Error"
    });
  }
};
const statusMap = {
  Applied: {
    message: "A new job application has been submitted",
    color: "#2563eb"
  },
  Shortlisted: {
    message: "Your application has been shortlisted",
    color: "#16a34a"
  },
  Rejected: {
    message: "Your application has been rejected",
    color: "#dc2626"
  },
  Selected: {
    message: "Congratulations! You have been selected",
    color: "#059669"
  }
};

function getExtraContent(status) {
  switch (status) {
    case "Selected":
      return `
        <p style="font-size:14px; color:#16a34a; margin-top:10px;">
          🎉 Our team will contact you shortly with the next steps. We look forward to working with you!
        </p>
      `;
    case "Rejected":
      return `
        <p style="font-size:14px; color:#6b7280; margin-top:10px;">
          We appreciate your time and encourage you to apply for future opportunities.
        </p>
      `;
    case "Shortlisted":
      return `
        <p style="font-size:14px; color:#6b7280; margin-top:10px;">
          You may be contacted soon for the next stage of the hiring process.
        </p>
      `;
    case "Applied":
      return `
        <p style="font-size:14px; color:#6b7280; margin-top:10px;">
          Our hiring team is reviewing your profile. We will notify you once there is an update.
        </p>
      `;
    default:
      return "";
  }
}

exports.job_email = async (req, res) => {
  try {
    const { jobId, userId,title,jobCategory, subject, jobStatus } = req.body;

    const user = await userModel.findOne(
      { userId },
      { email: 1, name: 1, address: 1, _id: 0 }
    );

    if (!user) return res.json({ status: "error", message: "User not found" });

    const job = await jobApplicationModel.findOne({ jobId });
    if (!job) return res.json({ status: "error", message: "Job not found" });
    
    const { state, district, city } = user.address || {};

    const admins = await userModel.find(
      {
        userType: { $in: ["admin", "superAdmin"] },
        "address.state": state,
        // "address.district": district,
        // "address.city": city
      },
      { email: 1, _id: 0 }
    );
    let jobSeekerEmails;
     if(title=="new"){
      console.log(`job cat${jobCategory}`)
    const appImage= await appLogoModel.find({});
    const urls = appImage.map(img => img.appLogo); 
    const jobSeekers = await userModel.find({userType: "Job Seekers",isActive: true,
      "address.state": state,"details.jobCategory": { $in: jobCategory }},{ email: 1, _id: 0 });
    console.log(`job cat${jobSeekers}`)
   
    jobSeekerEmails = jobSeekers.map(a => a.email).join(","); }
    const adminEmails = admins.map(a => a.email).join(",");

     const statusInfo = statusMap[jobStatus] || {
      message: "Job status updated",
      color: "#374151"
    };
      console.log(`admin email${adminEmails}`)
      const appImage= await appLogoModel.find({});
      const urls = appImage.map(img => img.appLogo); 
      const urlString = JSON.stringify(urls);
      console.log(urlString);
      const emailData = {
      userName: user.name,
      jobTitle: job.jobTitle,
      jobId: job.jobId,
      JobLocation: `${job.city},${job.district},${job.state}`,
      companyLogoUrl:urlString[0],
      logoUrl:urls[0],
      hospitalName: job.orgName,
      jobStatus: jobStatus.toLowerCase(),
      statusMessage: statusInfo.message,
      statusColor: statusInfo.color,
      appliedDate: new Date(job.createdDate).toLocaleDateString("en-IN"),
      jobUrl: `${process.env.base_url}lyd/jobs/getJobById?jobId=${jobId}`,
      companyName: "LYD",
      extraContent: getExtraContent(jobStatus), 
      year: new Date().getFullYear()
    };
    //console.log(`url${process.env.app_logo_url}`)
    let userHtml; 
    let adminHtml;
    if(title=='update'){
     userHtml = renderTemplate("job_status_alert", emailData);
    // adminHtml = renderTemplate("job_status_alert", emailData);
    }
    else if(title=='new'){
     userHtml = renderTemplate("job_post_alert", emailData);
     adminHtml = renderTemplate("job_post_alert", emailData);
    }
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.nodemail_username,
    //     pass: process.env.nodemail_password
    //   }
    // });
    if(title=='update'){
    await transporter.sendMail({
      from: `"LYD App" <${process.env.nodemail_username}>`,
      to: user.email,
      subject,
      html: userHtml,
      // attachments: [
      //   { filename: "logo.png", path: "./assets/tooth.png", cid: "logo" }
      // ]
    });
  }

    if (adminEmails) {
      await transporter.sendMail({
        from: `"LYD App" <${process.env.nodemail_username}>`,
        to: adminEmails,
        subject: `Job Alert: ${subject}`,
        html: adminHtml
      });
      
    }
    if (title=='new'&&jobSeekerEmails) {
      await transporter.sendMail({
        from: `"LYD App" <${process.env.nodemail_username}>`,
        to: jobSeekerEmails,
        subject: `New Job Alert: ${subject}`,
        html: userHtml
      });
      transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take messages');
  }
});
    }
    return res.send({ status: "Success", message: "Job status email sent successfully" });
  } catch (error) {
    console.error("Job Email Error:", error);
    return res.send({ status: "error", message: "Internal Server Error" });
  }
};
    exports.postImagesAdmin = async (req, res) => {
      try {
        const {
          userId,
          userType,
          imageId,
        // preference,
          startDate,
          endDate,
          isActive
        } = req.body;

        if (!userId || !userType) {
          return res.json({
            status: "error",
            message: "Missing userId or userType"
          });
        }

        const file =
          req.file || (req.files?.length ? req.files[0] : null);

        let record = await uploadAdminImages.findOne({ userId, userType });

        if (!record) {
          record = await uploadAdminImages.create({
            userId,
            userType,
            posterImages: []
          });
        }

        // CREATE
        if (!imageId || imageId === "0" || imageId === "") {

          if (!file) {
            return res.json({
              status: "error",
              message: "Image required"
            });
          }

          const url = await uploadToS3(file);

          const newImage = {
            path: url,
          // preference: preference ? Number(preference) : 0,
            startDate: startDate || "",
            endDate: endDate || "",
            isActive:
              isActive === true ||
              isActive === "true",
            uploadedAt: new Date()
          };

          record.posterImages.push(newImage);

          await record.save();

          return res.json({
            status: "success",
            message: "Created",
            data: record.posterImages.at(-1)
          });
        }
        const image = record.posterImages.id(imageId);
        if (!image) {
          return res.json({
            status: "error",
            message: "Image not found"
          });
        }
        if (file) {
          image.path = await uploadToS3(file);
        }

        // if (preference !== undefined) {
        //   image.preference = Number(preference);
        // }

        if (startDate !== undefined) {
          image.startDate = startDate;
        }

        if (endDate !== undefined) {
          image.endDate = endDate;
        }

        if (isActive !== undefined) {
          image.isActive =
            isActive === true ||
            isActive === "true";
        }

        image.uploadedAt = new Date();

        await record.save();

        return res.json({
          status: "success",
          message: "Updated",
          data: image
        });

      } catch (err) {
        console.error(err);

        return res.json({
          status: "error",
          message: err.message
        });
      }
    };
 
  
const expirePosterImagesIfNeeded = async () => {
  try {
    const now = new Date();

    await uploadAdminImages.updateMany(
      {
        "posterImages.endDate": { $ne: null },
        "posterImages.endDate": { $lt: now },
        "posterImages.isActive": true
      },
      {
        $set: {
          "posterImages.$[img].isActive": false
        }
      },
      {
        arrayFilters: [
          {
            "img.endDate": { $ne: null, $lt: now },
            "img.isActive": true
          }
        ]
      }
    );
  } catch (error) {
    console.error("Poster image expiry check failed:", error);
  }
};
exports.getUploadImages = async (req, res) => {

  const { userType, userId } = req.body;

  try {

    const today = new Date();

    const matchStage = {
      userType: {
        $regex: `^${userType}$`,
        $options: "i"
      }
    };

    if (userId) {
      matchStage.userId = userId;
    }

    const records = await uploadAdminImages.find(matchStage);

    const images = [];

    records.forEach(record => {

      record.posterImages.forEach(img => {

        let isExpired = false;

        // CHECK EXPIRY ONLY
        if (
          img.endDate &&
          img.endDate !== "" &&
          img.endDate !== "null"
        ) {

          const [day, month, year] =
              img.endDate.split("-").map(Number);

          const endDate =
              new Date(year, month - 1, day);

          if (endDate < today) {
            isExpired = true;
          }
        }

        // SKIP ONLY EXPIRED
        if (isExpired) return;

        // RETURN ALL NON-EXPIRED IMAGES
        images.push({

          _id: img._id,

          path: img.path,

          startDate: img.startDate || "",

          endDate: img.endDate || "",

          userId: record.userId,

          userType: record.userType,

          // IMPORTANT
          isActive: img.isActive ?? true
        });
      });
    });

    return res.send({

      status: "success",

      message:
          images.length > 0
              ? "Images fetched successfully"
              : "No images found",

      data: images
    });

  } catch (error) {

    console.error(error);

    return res.send({

      status: "error",

      message: error.message
    });
  }
};
// exports.getUploadImages = async (req, res) => {

//   const { userType, userId } = req.body;

//   try {

//     const today = new Date();

//     const matchStage = {
//       userType: {
//         $regex: `^${userType}$`,
//         $options: "i"
//       }
//     };

//     if (userId) {
//       matchStage.userId = userId;
//     }

//     const records = await uploadAdminImages.find(matchStage);

//     const images = [];

//     records.forEach(record => {

//       record.posterImages.forEach(img => {

//         let isExpired = false;

//         // CHECK EXPIRY ONLY
//         if (
//           img.endDate &&
//           img.endDate !== "" &&
//           img.endDate !== "null"
//         ) {

//           const [day, month, year] =
//               img.endDate.split("-").map(Number);

//           const endDate =
//               new Date(year, month - 1, day);

//           if (endDate < today) {
//             isExpired = true;
//           }
//         }

//         // SKIP ONLY EXPIRED
//         if (isExpired) return;

//         // RETURN ALL NON-EXPIRED IMAGES
//         images.push({

//           _id: img._id,

//           path: img.path,

//           startDate: img.startDate || "",

//           endDate: img.endDate || "",

//           userId: record.userId,

//           userType: record.userType,

//           // IMPORTANT
//           isActive: img.isActive ?? true
//         });
//       });
//     });

//     return res.send({

//       status: "success",

//       message:
//           images.length > 0
//               ? "Images fetched successfully"
//               : "No images found",

//       data: images
//     });

//   } catch (error) {

//     console.error(error);
//      return res.send({
//       status: "error",message: error.message
//     });
//   }
// };
// exports.getUploadImages = async (req, res) => {
//   const { userType, userId } = req.body;

//   try {
//     const today = new Date();

//     const matchStage = { userType: { $regex: `^${userType}$`, $options: "i" } };
//     if (userId) matchStage.userId = userId;

//     const records = await uploadAdminImages.find(matchStage);

//     const activeImages = [];
//     records.forEach(record => {
//       record.posterImages.forEach(img => {
//         if (img.endDate && img.endDate !== "null") {
//           const [day, month, year] = img.endDate.split("-").map(Number);
//           const end = new Date(year, month - 1, day);
//           if (end >= today) {
//             activeImages.push({
//               _id: img._id,
//               path: img.path,
//               startDate: img.startDate,
//               endDate: img.endDate,
//               userId: record.userId,
//               userType: record.userType,
//               isActive: true
//             });
//           }
//         } else if (!img.endDate || img.endDate === "null") {
//           activeImages.push({
//             _id: img._id,
//             path: img.path,
//             startDate: img.startDate,
//             endDate: img.endDate,
//             userId: record.userId,
//             userType: record.userType,
//             isActive: true
//           });
//         }
//       });
//     });

//     return res.send({
//       status: "success",
//       message: activeImages.length ? "Images fetched successfully" : "No images found",
//       data: activeImages
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({
//       status: "error",
//       message: error.message
//     });
//   }
// };
// exports.getUploadImages = async (req, res) => {
//   const { userType, userId } = req.body;

//   try {
//     const today = new Date();

//     const matchStage = {
//       userType: { $regex: `^${userType}$`, $options: "i" }
//     };

//     if (userId) {
//       matchStage.userId = userId;
//     }

//     const uploadRecord = await uploadAdminImages.aggregate([
//       { $match: matchStage },

//       { $unwind: "$posterImages" },
//       {
//         $addFields: {
//           "posterImages.endDateConverted": {
//             $toDate: "$posterImages.endDate"
//           }
//         }
//       },
//       {
//         $addFields: {
//           "posterImages.isActive": {
//             $cond: [
//               { $lt: ["$posterImages.endDateConverted", today] },
//               false,
//               "$posterImages.isActive"
//             ]
//           }
//         }
//       },
//       {
//         $match: {
//           "posterImages.isActive": true
//         }
//       },

//       {
//         $project: {
//           _id: "$posterImages._id",
//           path: "$posterImages.path",
//           preference: "$posterImages.preference",
//           uploadedAt: "$posterImages.uploadedAt",
//           userId: 1
//         }
//       },

//       {
//         $sort: {
//           preference: 1,
//           uploadedAt: 1
//         }
//       }
//     ]);

//     return res.json({
//       status: "success",
//       message: uploadRecord.length
//           ? "Images fetched successfully"
//           : "No images found",
//       data: uploadRecord
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };

//exports.getUploadImages = async (req, res) => {
//   const { userType, userId } = req.body; 

//   try {
//     const matchStage = {
//       userType: { $regex: `^${userType}$`, $options: "i" }
//     };

//     if (userId) {
//       matchStage.userId = userId;
//     }

//     const uploadRecord = await uploadAdminImages.aggregate([
//       { $match: matchStage },
//       { $unwind: "$posterImages" },
//       {
//         $project: {
//           _id: "$posterImages._id",
//           path: "$posterImages.path",
//           preference: "$posterImages.preference",
//           uploadedAt: "$posterImages.uploadedAt",
//           userId: 1
//         }
//       },
//       {
//         $sort: {
//           preference: 1,
//           uploadedAt: 1
//         }
//       }
//     ]);

//     if (!uploadRecord.length) {
//       return res.json({
//         status: "success",
//         message: "No images found",
//         data: []
//       });
//     }

//     res.json({
//       status: "success",
//       message: "Images fetched successfully",
//       data: uploadRecord
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };

 exports.deleteAdminImage = async (req, res) => {
  const { userId, index } = req.body;

  const uploadRecord = await uploadAdminImages.findOne({ userId });
  if (!uploadRecord) {
    return res.send({ status: "error", message: "Record not found" });
  }

  if (index < 0 || index >= uploadRecord.posterImages.length) {
    return res.send({ status: "error", message: "Invalid index" });
  }

  // Remove image
  uploadRecord.posterImages.splice(index, 1);

  // Recalculate preference
  uploadRecord.posterImages.forEach((img, i) => {
    img.preference = i;
  });

  await uploadRecord.save();

  res.send({
    status: "success",
    message: "Image deleted successfully",
    data: uploadRecord.posterImages,
  });
};


 exports.saveFcmToken = async (req, res) => {
  const { userId, fcmToken, userType } = req.body;

  try {
    if (!userId || !fcmToken || !userType) {
      return res.send({
        status: "error",
        message: "missing fields"
      });
    }

    const savedToken = await fcmModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          fcmToken: fcmToken,
          userType: userType,
          updatedDate: new Date()
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    return res.send({
      status: "success",
      data: savedToken
    });

  } catch (error) {
    return res.send({
      status: "error",
      message: `token not saved ${error.message}`
    });
  }
};
