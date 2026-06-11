const express = require('express')
const jobModel = require('../model/jobModel')
const jobIdModel = require('../model/jobIdModel')
const webinarModel = require('../model/webinarModel')
const userModel = require('../model/user')
const jobSeekerModel = require('../model/job_seeker_model')
const webinarApplyModel=require('../model/apply_webinar_model')
const { uploadToS3 ,deleteFromS3 } = require("../file_uploadImage");
const jobCategoryModel=require('../model/job_category')
const { default: mongoose } = require('mongoose')

  exports.createEditJobs = async (req, res) => {
  const { jobTitle, jobDescription,details, jobType,jobCategory, orgName, salary, experience, userId, qualification, userType, jobId, state, district, city } = req.body;
  try {
    if (!jobTitle || !jobDescription ||!details ||!jobType ||!jobCategory ||!orgName || !salary || !qualification || !experience || !userId || !userType ||!state ) {
      return res.send({ status: "error", message: "missing fields" })
    }
        let detailsObj = {};
        if (details) {
  if (typeof details === "string") {
    try {
      detailsObj = JSON.parse(details);
    } catch {
      detailsObj = { text: details }; 
    }
  } else {
    detailsObj = details;
  }
  }
  let jobCategoryObj = [];

try {
  if (typeof jobCategory === "string") {
    jobCategoryObj = JSON.parse(jobCategory);
  } else {
    jobCategoryObj = jobCategory;
  }
} catch {
  jobCategoryObj = [];
}
    // if (details) {
    //   try {
    //     detailsObj = typeof details === "string" ? JSON.parse(details) : details;
    //   } catch (err) {
    //     return res.status(400).send({ status: "error", message: "Invalid details format" });
    //   }
    // }
    // Handle uploaded image
    let jobImage;
    if(req.file){
        jobImage = await uploadToS3(req.file);
    }
 let jobDescriptionObj = [];

try {
  if (typeof jobDescription === "string") {
    jobDescriptionObj = JSON.parse(jobDescription);

    if (
      jobDescriptionObj.length === 1 &&
      typeof jobDescriptionObj[0].insert === "string" &&
      jobDescriptionObj[0].insert.startsWith("[")
    ) {
      try {
        jobDescriptionObj = JSON.parse(jobDescriptionObj[0].insert);
      } catch (e) {
        console.log("Double parse failed");
      }
    }

  } else if (Array.isArray(jobDescription)) {
    jobDescriptionObj = jobDescription;
  }
} catch (e) {
  console.log("Invalid delta, saving as plain text");

  jobDescriptionObj = [
    { insert: String(jobDescription) }
  ];
}
       //req.file ? `jobImage/${req.file.filename}` : "";
    if (jobId === 0 || jobId == "0") {
      const newJobId = await jobIdModel.findOneAndUpdate({ id: "jobId" }, { $inc: { jobId: 1 }, }, { upsert: true, new: true })
      console.log(`new job id${newJobId}`)
      const jobCreate = new jobModel({ jobTitle: jobTitle,jobImage:jobImage??"",details:detailsObj, jobDescription: jobDescriptionObj,jobCategory:jobCategoryObj, jobType: jobType, orgName: orgName, salary: salary, qualification: qualification, experience: experience, userId: userId, userType: userType, state: state, district: district, city: city, jobId: newJobId.jobId })
      const saveJobs = await jobCreate.save();
      res.send({ status: "success", message: "Job Created Successfully", data: saveJobs })
    }
    else {
      const updateJobs = {};
      if (jobTitle) updateJobs.jobTitle = jobTitle;
//      if (jobDescription) {
//   if (typeof jobDescription === "string") {
//     try {
//       updateJobs.jobDescription = JSON.parse(jobDescription);
//     } catch {
//       updateJobs.jobDescription = [{ insert: jobDescription }];
//     }
//   } else {
//     updateJobs.jobDescription = jobDescription;
//   }
// }
 let jobDescriptionObj = [];

try {
  if (typeof jobDescription === "string") {
    jobDescriptionObj = JSON.parse(jobDescription);

    //  FIX: if it's wrapped like [{ insert: "...." }] (wrong case)
    if (
      jobDescriptionObj.length === 1 &&
      typeof jobDescriptionObj[0].insert === "string" &&
      jobDescriptionObj[0].insert.startsWith("[")
    ) {
      try {
        jobDescriptionObj = JSON.parse(jobDescriptionObj[0].insert);
      } catch (e) {
        console.log("Double parse failed");
      }
    }

  } else if (Array.isArray(jobDescription)) {
    jobDescriptionObj = jobDescription;
  }
} catch (e) {
  console.log("Invalid delta, saving as plain text");

  jobDescriptionObj = [
    { insert: String(jobDescription) }
  ];
}

let jobCategoryObj = [];

try {
  if (typeof jobCategory === "string") {
    jobCategoryObj = JSON.parse(jobCategory);
  } else {
    jobCategoryObj = jobCategory;
  }
} catch {
  jobCategoryObj = [];
}
      if (userId) updateJobs.userId = userId;
      if (jobDescription) updateJobs.jobDescription = jobDescriptionObj;

      if (details) updateJobs.details=detailsObj;
      if (userType) updateJobs.userType = userType;
      if (jobId) updateJobs.jobId = jobId;
      if (jobType) updateJobs.jobType = jobType;
      if (jobCategory) updateJobs.jobCategory=jobCategoryObj;
      if (orgName) updateJobs.orgName = orgName;
      if (salary) updateJobs.salary = salary;
      if (qualification) updateJobs.qualification = qualification;
      if (experience) updateJobs.experience = experience;
      if (state) updateJobs.state = state;
      if (district) updateJobs.district = district;
      if (city) updateJobs.city = city;
      if (jobImage) updateJobs.jobImage = jobImage;

      const jobCreate = await jobModel.findOneAndUpdate({ jobId: jobId }, { $set: updateJobs }, { new: true })
      if (!jobCreate) {
        return res.send({ status: "error", message: "no jobs found" })
      }
      else {
        return res.send({ status: "success", data: jobCreate })
      }
    }
  }
  catch (error) {
    res.send({ status: "error", message: `job not post error ${error.message}` })
  }
}
  exports.createEditWebinars = async (req, res) => {
  const { webinarTitle, webinarDescription, userId, userType, orgName, webinarId, details } = req.body;
  try {
    if (!webinarTitle || !webinarDescription || !userId || !userType || !orgName || webinarId == null || !details) {
      return res.send({ status: "error", message: "missing fields" });
    }
    let detailsObj = {};
    if (details) {
      try {
        detailsObj = typeof details === "string" ? JSON.parse(details) : details;
      } catch (err) {
        return res.send({ status: "error", message: "Invalid details format" });
      }
    }
    let webinarImage;
    if(webinarImage){
      webinarImage = await uploadToS3(req.file);
    }
    let webinarDescriptionObj = [];

try {
  if (typeof webinarDescription === "string") {
    webinarDescriptionObj = JSON.parse(webinarDescription);

    if (
      webinarDescriptionObj.length === 1 &&
      typeof webinarDescriptionObj[0].insert === "string" &&
      webinarDescriptionObj[0].insert.startsWith("[")
    ) {
      try {
        webinarDescriptionObj = JSON.parse(webinarDescriptionObj[0].insert);
      } catch (e) {
        console.log("Double parse failed");
      }
    }

  } else if (Array.isArray(webinarDescription)) {
    webinarDescriptionObj = webinarDescription;
  }
} catch (e) {
  console.log("Invalid delta, saving as plain text");

  webinarDescriptionObj = [
    { insert: String(webinarDescription) }
  ];
}
     //const webinarImage =req.file ? `webinarImage/${req.file.filename}` : null;
    if (webinarId == 0 || webinarId === "0") {
      const newWebinarIdDoc = await jobIdModel.findOneAndUpdate(
        { id1: "webinarId" },
        { $inc: { webinarId: 1 } },
        { upsert: true, new: true }
      );

      const newWebinar = new webinarModel({
        webinarTitle,
       webinarDescription: webinarDescriptionObj,
        orgName,
        userId,
        userType,
        details: detailsObj,
        webinarId: newWebinarIdDoc.webinarId,
        webinarImage:webinarImage??"",
      });
     const savedWebinar = await newWebinar.save();
     return res.send({ status: "success", message: "Webinar Created Successfully", data: savedWebinar });
    } else {
 let webinarDescriptionObj = [];

  try {
  if (typeof webinarDescription === "string") {
    webinarDescriptionObj = JSON.parse(webinarDescription);

    if (
      webinarDescriptionObj.length === 1 &&
      typeof webinarDescriptionObj[0].insert === "string" &&
      webinarDescriptionObj[0].insert.startsWith("[")
    ) {
      try {
        webinarDescriptionObj = JSON.parse(webinarDescriptionObj[0].insert);
      } catch (e) {
        console.log("Double parse failed");
      }
    }

  } else if (Array.isArray(webinarDescription)) {
    webinarDescriptionObj = webinarDescription;
  }
} catch (e) {
  console.log("Invalid delta, saving as plain text");

  webinarDescriptionObj = [
    { insert: String(webinarDescription) }
  ];
}      const updateFields = {
        webinarTitle,
       webinarDescription: webinarDescriptionObj,
        userId,
        userType,
        orgName,webinarImage,
        details: detailsObj,
      };
      if (webinarImage){
         updateFields.webinarImage = webinarImage;
      }

      const updatedWebinar = await webinarModel.findOneAndUpdate(
        { webinarId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedWebinar) {
        return res.send({ status: "error", message: "Webinar not found" });
      }

      return res.send({ status: "success", data: updatedWebinar });
    }
  } catch (error) {
    return res.send({ status: "error", message: `Webinar operation failed: ${error.message}` });
  }
};

// exports.createEditWebinars = async (req, res) => {
//   const { webinarTitle, webinarDescription, userId, userType, orgName, webinarId,details } = req.body;
//   try {
//     if (!webinarTitle || !webinarDescription || !userId || !userType || !orgName || !webinarId ||!details) {
//       return res.send({ status: "error", message: "missing fields" })
//     }
//   let detailsObj = {};
//   if (req.body.details) {
//     try {
//         detailsObj = JSON.parse(req.body.details); 
//     } catch (err) {
//         return res.status(400).send({ status: "error", message: "Invalid details format" });
//     }
// }

// const webinarImage = req.file ? req.file.filename : "";
//     if (webinarId == 0 || webinarId == "0") {
//       const newwebinarId = await jobIdModel.findOneAndUpdate({ id1: "webinarId" }, { $inc: { webinarId: 1 }, }, { upsert: true, new: true })
//       console.log(`new job id${newwebinarId}`)
//       const jobCreate = new webinarModel({ webinarTitle: webinarTitle, webinarDescription: webinarDescription,orgName:orgName, userId: userId, userType: userType, orgName: orgName,details:detailsObj,
//         webinarId: newwebinarId.webinarId,webinarImage:webinarImage })
//       const saveJobs = await jobCreate.save();
//       res.send({ status: "success", message: "Job Created Successfully", data: saveJobs })
//     }
//     else {
//       const updateJobs = {};
//       if (webinarTitle) updateJobs.webinarTitle = webinarTitle;
//       if (webinarDescription) updateJobs.webinarDescription = webinarDescription;
//       if (userId) updateJobs.userId = userId;
//       if (userType) updateJobs.userType = userType;
//       if (webinarId) updateJobs.webinarId = webinarId;
//       if (orgName) updateJobs.orgName = orgName;
//       if(details) updateJobs.details=details;
//       if(webinarImage) updateJobs.webinarImage=webinarImage;
//       const webinarCreate = await webinarModel.findOneAndUpdate({ webinarId: webinarId }, { $set: updateJobs }, { new: true })
//       if (!webinarCreate) {
//         return res.send({ status: "error", message: "no jobs found" })
//       }
//       else {
//         return res.send({ status: "success", data: webinarCreate })
//       }
//     }
//   }
//   catch (error) {
//     res.send({ status: "error", message: `webinar not shown error ${error.message}` })
//   }
//  }

 exports.viewJobsAdminList = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId)
    // const userType=req.user.userType;
    if (!userId) {
      return res.send({ status: "error", message: "missing fields" })
    }
    // const viewJobs = await jobModel.find({ userId: userId }).sort({ _id: -1 })
//     const viewJobs = await jobModel.aggregate([
//   {
//     $match: { userId: userId }  
//   },
//   {
//     $lookup: {
//       from: "jobseekers",           
//       localField: "jobId",     
//       foreignField: "jobId",   
//       as: "jobseekers"
//     }
//   },
//   {
//     $addFields: {
//       totalApplicants: { $size: "$jobseekers" }  
//     }
//   },
//   {
//     $sort: { _id: -1 }  ,
//   },
// ]);
const viewJobs = await jobModel.aggregate([
  {
    $match: { userId: userId }  
  },
  {
    $lookup: {
      from: "jobseekers",
      let: { jobId: "$jobId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$jobId", "$$jobId"] } } },
        { $count: "count" } 
      ],
      as: "jobseekersCount"
    }
  },
  {
    $addFields: {
      totalApplicants: { $ifNull: [{ $arrayElemAt: ["$jobseekersCount.count", 0] }, 0] }
    }
  },
  {
    $project: { jobseekersCount: 0 } 
  },
  {
    $sort: { _id: -1 }
  }
]);


console.log(viewJobs);

    if (viewJobs == 0) {
      return res.send({ status: "error", message: "no jobs found", data: viewJobs })
    }
    else {
      return res.send({ status: "Success", data: viewJobs })
    }
  }
  catch (err) {
    res.send({ status: "error", message: "can not view jobs" })
  }
}

exports.getJobByIdApplicationList = async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).send({ status: "error", message: "Missing jobId" });
  }

  try {
      const applications = await jobSeekerModel.aggregate([
      { $match: { jobId: parseInt(jobId) } },

      // Lookup only active users
      {
        $lookup: {
          from: "users",
          let: { seekerId: "$jobSeekerId" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$userId", "$$seekerId"] },
              { $eq: ["$isActive", true] }   // <--- only active users
            ]}}},
            { $project: { _id: 0, email: 1, mobileNumber: 1, name: 1, image: 1 } }
          ],
          as: "jobSeekerDetails"
        }
      },

      { $unwind: { path: "$jobSeekerDetails", preserveNullAndEmptyArrays: false } }, // ignore null users

      { $sort: { createdDate: -1 } },

      {
        $project: {
          _id: 1,
          jobId: 1,
          jobSeekerId: 1,
          isViewed: 1,
          isApplied: 1,
          isActive: 1,
          status: 1,
          createdDate: 1,
          updatedDate: 1,
          email: "$jobSeekerDetails.email",
          mobileNumber: "$jobSeekerDetails.mobileNumber",
          name: "$jobSeekerDetails.name",
          image: { $arrayElemAt: ["$jobSeekerDetails.image", 0] },
        }
      }
    ]);

    // const applications = await jobSeekerModel.aggregate([
    //   { $match: { jobId: parseInt(jobId) } }, 
    //   {
    //     $lookup: {
    //       from: "users",            
    //       localField: "jobSeekerId",
    //       foreignField: "userId",  
    //       as: "jobSeekerDetails"  
    //     }
    //   },
    //   {
    //     $unwind: { path: "$jobSeekerDetails", preserveNullAndEmptyArrays: true }
    //   },
    //   {
    //     $sort: { createdDate: -1 } 
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       jobId: 1,
    //       jobSeekerId: 1,
    //       isViewed: 1,
    //       isApplied: 1,
    //       isActive: 1,
    //       status:1,
    //       createdDate: 1,
    //       updatedDate: 1,
    //       email:"$jobSeekerDetails.email",
    //       mobileNumber:"$jobSeekerDetails.mobileNumber",
    //       name:"$jobSeekerDetails.name",
    //       image: { $arrayElemAt: ["$jobSeekerDetails.image", 0] },
    //      // jobSeekerDetails: 1
    //     }
    //   }
    // ]);

    if (applications.length === 0) {
      return res.send({ status: "error", message: "No applications found" });
    }
   res.send({ status: "Success", data: applications });
  } catch (err) {
    res.send({ status: "error", message: `Failed to fetch applications: ${err.message}` });
  }
};
exports.getWebinarByIdApplicationList = async (req, res) => {
  const { webinarId } = req.body;
  if (!webinarId) {
    return res.send({ status: "error", message: "Missing jobId" });
  }

  try {
    const applications = await webinarApplyModel.aggregate([
      { $match: { webinarId: parseInt(webinarId) } }, 
      {
        $lookup: {
          from: "users",            
          localField: "jobSeekerId",
          foreignField: "userId",  
          as: "jobSeekerDetails"  
        }
      },
      {
        $unwind: { path: "$jobSeekerDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $sort: { createdDate: -1 }
      },
      {
        $project: {
          _id: 1,
          applications:1,
           webinarId: 1,
          jobSeekerId: 1,
          isViewed: 1,
           isApplied: 1,
           isActive: 1,
          // status:1,
          createdDate: 1,
          updatedDate: 1,
          email:"$jobSeekerDetails.email",
          mobileNumber:"$jobSeekerDetails.mobileNumber",
          name:"$jobSeekerDetails.name",
          image: { $arrayElemAt: ["$jobSeekerDetails.image", 0] },
         // jobSeekerDetails: 1
        }
      }
    ]);

    if (applications.length === 0) {
      return res.send({ status: "error", message: "No applications found" });
    }
   res.send({ status: "Success", data: applications });
  } catch (err) {
    res.send({ status: "error", message: `Failed to fetch applications: ${err.message}` });
  }
};

exports.viewWebinarAdminList = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId)
      return res.send({ status: "error", message: "missing fields" });

//     const data = await webinarModel.aggregate([
//       { $match: { userId } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "userId",
//           as: "user"
//         }
//       },
// {
//     $lookup: {
//       from: "webinarApplication",
//       localField: "webinarId",
//       foreignField: "webinarId",
//       as: "applicants",
//     },
//   },
//       { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

//       { $sort: { _id: -1 } },

//       {
//         $project: {
//           _id: 1,
//           webinarId: 1,
//           webinarTitle: 1,
//           webinarDescription: 1,
//           webinarImage: 1,
//           orgName: 1,
//           createdDate: 1,
//           updatedDate: 1,
//           state: 1,
//           district: 1,
//           city: 1,
//           isActive:1,
//           totalApplicants:1,
//           // Place from user table
//           place: {
//             $concat: [
//               { $ifNull: ["$user.address.city", ""] }, ", ",
//               { $ifNull: ["$user.address.district", ""] }, ", ",
//               { $ifNull: ["$user.address.state", ""] }
//             ]
//           },

//           // webinar details
//           webinarDate: "$details.webinarDate",
//           startTime: "$details.startTime",
//           endTime: "$details.endTime"
//         }
//       }
//     ]);
      const viewWebinars = await webinarModel.aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "userId",
            as: "user"
          }
        },
        {
          $lookup: {
            from: "webinars",
            localField: "webinarId",
            foreignField: "webinarId",
            as: "applications"
          }
        },
        {
          $addFields: {
            totalApplicants: { $size: "$applications" }
          }
        },
        {
          $sort:{createdDate:-1}
        },
        {
          $project: {
            _id: -1,
            webinarId: 1,
            webinarTitle: 1,
            webinarDescription: 1,
            webinarImage: 1,
            orgName: 1,
            createdDate: 1,
            updatedDate: 1,
            isActive: 1,
            totalApplicants: 1,
            place: {
              $concat: [
                { $ifNull: [{ $arrayElemAt: ["$user.address.city", 0] }, ""] }, ", ",
                { $ifNull: [{ $arrayElemAt: ["$user.address.district", 0] }, ""] }, ", ",
                { $ifNull: [{ $arrayElemAt: ["$user.address.state", 0] }, ""] }
              ]
            },
            webinarDate: "$details.webinarDate",
            startTime: "$details.startTime",
            endTime: "$details.endTime"
          } }
        ]);
  if (viewWebinars.length === 0){
      return res.send({ status: "error", message: "no jobs found" });
  }
    return res.send({ status: "Success",total:viewWebinars.length, data:viewWebinars });
  } catch (err) {
    res.send({ status: "error", message: err.message });
  }
};


// exports.viewWebinarAdminList = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     console.log(userId)
//     // const userType=req.user.userType;
//     if (!userId) {
//       return res.send({ status: "error", message: "missing fields" })
//     }
//     const viewJobs = await webinarModel.find({ userId: userId }).sort({ _id: -1 })
//     if (viewJobs == 0) {
//       return res.send({ status: "error", message: "no jobs found", data: viewJobs })
//     }
//     else {
//       return res.send({ status: "Success", data: viewJobs })
//     }
//   }
//   catch (err) {
//     res.send({ status: "error", message: "can not view jobs" })
//   }
// }

// exports.viewJobSeekerList = async (req, res) => {
//   try {
//     const {search,filters} = req.body;
//     const userType = req.user.userType;

//     if (!userType) {
//       return res.send({ status: "error", message: "missing fields" });
//     }
//    const filter = { isActive: true };
//   if (filters?.userType) {
//   filter.userType = filters.userType;
//   }

// if (filters?.state) {
//   filter.state = filters.state;
// }

// if (filters?.district) {
//   filter.district = filters.district;
// }
// if (filters?.jobType) {
//   filter.jobType = filters.jobType;
// }
// if(filters.salary){
//   filter.salary=filters.salary;
// }
//  if (filters?.jobCategory?.length) {
//       filter.jobCategory = { $in: filters.jobCategory };
//     }
// if (filters?.city) {
//   filter.city = filters.city;
// }

// if (search && search.trim() !== "") {
//   filter.$or = [
//     { state: { $regex: search, $options: "i" } },
//     { district: { $regex: search, $options: "i" } },
//     { city: { $regex: search, $options: "i" } },
//     { orgName: { $regex: search, $options: "i" } },
//     { jobTitle: { $regex: search, $options: "i" } },
//     {jobType:{$regex:jobType,$options:"i"}},
//         { jobCategory: { $regex: search, $options: "i" } },
//   ];
// }
//     const viewJobs = await jobModel.aggregate([
//   { $match: filter },
//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "userId",
//       as: "users",
//     },
//   },
//   // {
//   //   $lookup: {
//   //     from: "jobseekers",
//   //     localField: "jobId",
//   //     foreignField: "jobId",
//   //     as: "applicants",
//   //   },
//   // },
//    {
//     $lookup: {
//       from: "jobseekers",
//       let: { job_id: "$jobId" },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: ["$jobId", "$$job_id"] },
//                 // { $eq: ["$jobSeekerId", req.user.userId] },
//                 { $eq: ["$isActive", true] }
//               ]
//             }
//           }
//         }
//       ],
//       as: "myApplication"
//     }
//   },
//   {
//     $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
//   },
//   {
//     $project: {
//   _id: 1,
//   jobTitle: 1,
//   jobDescription: 1,
//   orgName: 1,
//   createdDate: 1,
//   updatedDate: 1,
//   jobType: 1,
//   jobId: 1,
//   userId: 1,
//   salary: 1,
//   status:1,
//   experience: 1,
//   userType: 1,
//   state: 1,
//   district: 1,
//   city: 1,
//   isViewed: 1,
//   isActive: 1,
//   qualification: 1,
//   companyDescription: { $arrayElemAt: ["$users.description", 0] },
//   image: { $arrayElemAt: ["$users.image", 0] },
//     logoImage: { $arrayElemAt: ["$users.logoImage", 0] },
//   totalApplicants: { $size: "$applicants" },
//   totalApplicants: { $size: "$myApplication" },
//   status: {
//         $ifNull: [
//           { $arrayElemAt: ["$myApplication.status", 0] },
//           "Not Applied"
//         ]
//       },
//   place: {
//     $concat: [
//       { $ifNull: [{ $arrayElemAt: ["$users.address.city", 0] }, ""] }, ", ",
//       { $ifNull: [{ $arrayElemAt: ["$users.address.district", 0] }, ""] }, ", ",
//       { $ifNull: [{ $arrayElemAt: ["$users.address.state", 0] }, ""] }
//     ]
//   },
//   // webinarDate: { $arrayElemAt: ["$applicants.details.webinarDate", 0] },
//   // startTime: { $arrayElemAt: ["$applicants.details.startTime", 0] },
//   // endTime: { $arrayElemAt: ["$applicants.details.endTime", 0] }
// }

//   },
//   {
//     $sort: { id: -1 ,createdDate:-1} 
//   }
// ]);

//     if (viewJobs.length === 0) {
//       return res.send({ status: "error", message: "no jobs found" });
//     }
  
//     return res.send({ status: "success", data: viewJobs });

//   } catch (err) {
//     res.send({ status: "error", message: `can not view jobs ${err.message}` });
//   }
// };


exports.viewJobSeekerList = async (req, res) => {
  try {
    const { search, filters } = req.body;
    // const userType = req.user.userType;

    // if (!userType) {
    //   return res.send({ status: "error", message: "missing fields" });
    // }
    const filter = { isActive: true };

    // if (filters?.userType) filter.userType = filters.userType;
    if (filters?.state) filter.state = filters.state;
    if (filters?.district) filter.district = filters.district;
    if (filters?.city) filter.city = filters.city;
   // if (filters?.jobType) filter.jobType = filters.jobType;
    //if (filters?.salary) filter.salary = filters.salary;
    if (filters?.jobType) {
  filter.jobType = { $regex: new RegExp(filters.jobType, "i") };
}

if (filters?.salary) {
  const [min, max] = filters.salary.replace(/,/g, "").split("-");
  filter.salary = { $gte: parseInt(min), $lte: parseInt(max) };
}

    if (filters?.jobCategory?.length) {
      filter.jobCategory = { $in: filters.jobCategory };
    }

    // Optional search across multiple fields
    if (search && search.trim() !== "") {
      filter.$or = [
        { state: { $regex: search.trim(), $options: "i" } },
        { district: { $regex: search.trim(), $options: "i" } },
        { city: { $regex: search.trim(), $options: "i" } },
        { orgName: { $regex: search.trim(), $options: "i" } },
        { jobTitle: { $regex: search.trim(), $options: "i" } },
        { jobCategory: { $regex: search.trim(), $options: "i" } },
        { jobType: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const viewJobs = await jobModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "users",
        },
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },

      // Join with jobseekers to check application
      {
        $lookup: {
          from: "jobseekers",
          let: { job_id: "$jobId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$jobId", "$$job_id"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "myApplication",
        },
      },

      // Project only JSON-serializable fields
      {
        $project: {
          _id: { $toString: "$_id" },
          jobId: 1,
          jobTitle: 1,
          jobDescription: 1,
          orgName: 1,
          jobCategory: 1,
          jobType: 1,
          userId: { $toString: "$userId" },
          salary: 1,
          experience: 1,
          userType: 1,
          state: 1,
          district: 1,
          city: 1,
          qualification: 1,
          isViewed: 1,
          isActive: 1,
          createdDate: { $dateToString: { date: "$createdDate", format: "%Y-%m-%dT%H:%M:%S.%LZ" } },
          updatedDate: { $dateToString: { date: "$updatedDate", format: "%Y-%m-%dT%H:%M:%S.%LZ" } },

          // User details
          companyDescription: "$users.description",
          image: "$users.image",
          logoImage: "$users.logoImage",

          // Application info
          totalApplicants: { $size: "$myApplication" },
          myApplicationStatus: {
            $ifNull: [{ $arrayElemAt: ["$myApplication.status", 0] }, "Not Applied"],
          },

          // Concatenated place
          place: {
            $concat: [
              { $ifNull: ["$users.address.city", ""] }, ", ",
              { $ifNull: ["$users.address.district", ""] }, ", ",
              { $ifNull: ["$users.address.state", ""] },
            ],
          },
        },
      },

      { $sort: { createdDate: -1 } },
    ]);

    if (!viewJobs.length) {
      return res.send({ status: "error", message: "no jobs found" });
    }

    return res.send({ status: "success", data: viewJobs });
  } catch (err) {
    console.error(err);
    return res.send({ status: "error", message: `cannot view jobs: ${err.message}` });
  }
};

exports.viewWebinarListJobseekers = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const pipeline = [
      {
        $match: {
          isActive: true
        }
      },

      {
        $addFields: {
          webinarDateObj: {
            $dateFromString: {
              dateString: "$details.webinarDate",
              format: "%d-%m-%Y"
            }
          }
        }
      }
    ];

    // Date filter
    if (startDate && endDate) {
      const start = new Date(
        startDate.split("-").reverse().join("-")
      );

      const end = new Date(
        endDate.split("-").reverse().join("-")
      );

      end.setHours(23, 59, 59, 999);

      pipeline.push({
        $match: {
          webinarDateObj: {
            $gte: start,
            $lte: end
          }
        }
      });
    } else {
      // Default: today and future webinars
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      pipeline.push({
        $match: {
          webinarDateObj: {
            $gte: today
          }
        }
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "users"
        }
      },
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          webinarId: 1,
          webinarTitle: 1,
           webinarDate: "$details.webinarDate",
          webinarDescription: 1,
          webinarImage: 1,
          orgName: 1,
          isActive: 1,
          createdDate: 1,
          startTime: "$details.startTime",
          endTime: "$details.endTime",
          place: {
            $concat: [
              { $ifNull: ["$users.address.city", ""] },
              ", ",
              { $ifNull: ["$users.address.district", ""] },
              ", ",
              { $ifNull: ["$users.address.state", ""] }
            ]
          }
        }
      },
      {
        $sort: {
          webinarDateObj: 1
        }
      }
    );

    const data = await webinarModel.aggregate(pipeline);

    return res.send({
      status: "success",
      count: data.length,
      data
    });

  } catch (err) {
    return res.send({
      status: "error",
      message: err.message
    });
  }
};
// exports.viewWebinarListJobseekers = async (req, res) => {
//   try {
//     const { state } = req.body;

//     const pipeline = [
//       { $match: { isActive: true } },

//       {
//         $lookup: {
//           from: "users", // Make sure your collection name matches exactly
//           localField: "userId",
//           foreignField: "userId",
//           as: "users"
//         }
//       },

//       { $unwind: "$users" } // convert array to object
//     ];

//     // Safe state filter
//     if (state && typeof state === "string" && state.trim() !== "") {
//       pipeline.push({
//         $match: {
//           $expr: {
//             $eq: [
//               { $toUpper: { $trim: { input: "$users.address.state" } } },
//               state.trim().toUpperCase()
//             ]
//           }
//         }
//       });
//     }

//     // Project fields
//     pipeline.push({
//       $project: {
//         _id: 1,
//         isActive:1,
//         webinarId: 1,
//         webinarTitle: 1,
//         webinarDescription: 1,
//         webinarImage: 1,
//         createdDate: 1,
//         orgName: 1,
//         webinarDate: "$details.webinarDate",
//         startTime: "$details.startTime",
//         endTime: "$details.endTime",
//         place: {
//           $concat: [
//             { $ifNull: ["$users.address.city", ""] },
//             ", ",
//             { $ifNull: ["$users.address.district", ""] },
//             ", ",
//             { $ifNull: ["$users.address.state", ""] }
//           ]
//         }
//       }
//     });

//     const data = await webinarModel.aggregate(pipeline);

//     if (!data.length) {
//       return res.send({
//         status: "error",
//         message: "no webinars found"
//       });
//     }

//     return res.send({ status: "success", data });
//   } catch (err) {
//     return res.send({ status: "error", message: err.message });
//   }
// };

exports.getwebinarById = async (req, res) => {
  try {
    const webinarId = Number(req.body.webinarId);
    const isActive = req.body.isActive === true || req.body.isActive === "true";

    if (!webinarId) {
      return res.send({ status: "error", message: "Invalid webinarId" });
    }

    const data = await webinarModel.aggregate([
      // { $match: { webinarId, isActive } },
            { $match: { webinarId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "users",
        },
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          webinarId: 1,
          webinarTitle: 1,
          webinarDescription: 1,
          webinarImage: 1,
          orgName: 1,
          userId: 1,
          userType: 1,
          createdDate: 1,
          updatedDate: 1,
          isActive: 1,
     
          // Extract details directly
          webinarLink: "$details.webinarLink",
          webinarDate: "$details.webinarDate",
          startTime: "$details.startTime",
          endTime: "$details.endTime",

          // User/Company info
  description: { $ifNull: ["$users.details.description", "No description available"] },
          image: { $arrayElemAt: ["$users.image", 0] },

          // Place concatenation
          place: {
            $concat: [
              { $ifNull: ["$users.address.city", ""] },
              ", ",
              { $ifNull: ["$users.address.district", ""] },
              ", ",
              { $ifNull: ["$users.address.state", ""] },
            ],
          },
        },
      },

      // Sort by _id descending
      { $sort: { _id: -1 } },
    ]);

    if (!data || data.length === 0) {
      return res.send({ status: "error", message: "webinar not found" });
    }

    return res.send({ status: "success", data });
  } catch (error) {
    return res.send({ status: "error", message: error.message });
  }
};

// exports.viewJobSeekerList=async(req,res)=>{
// try{
//     const{state,district,city}=req.body;
//   //const userId=req.user.userId;
//   const userType=req.user.userType;
//   console.log(`${userType}`)
//   if(!userType){
//     return res.send({status:"error",message:"missing fields"})
//   }
//   const filter={userType,isActive:true}
//   if(state) filter.state=state;
//   if(district) filter.district=district;
//   if(city)city=filter.city=city;
//   const viewJobs= await jobModel.find(filter)

//   if(viewJobs==0){
//     return res.send({status:"error",message:"no jobs found"})
//   }
//   else{
//     return res.send({status:"Success",data:viewJobs})
//  }
// }
// catch(err){
// res.send({status:"error",message:`can not view jobs ${err.message}`})
// }
// }

  exports.deactivateJobs = async (req, res) => {
  const { jobId } = req.body;
  try {
    const deactivateService = await jobModel.findOneAndUpdate({ jobId: jobId }, { isActive: false })
    if (deactivateService.length == 0) {
      res.send({ status: "error", message: "Job not found" })
    }
    res.send({ status: "success", message: "deactivate successfully" })
  }
  catch (error) {
    res.send({ status: "error", message: "not deactivated " })
  }
  }

  exports.applyJobs = async (req, res) => {
  const { jobId, jobSeekerId, userType } = req.body;
  try {
    if (!jobId || !jobSeekerId || !userType) {
      return res.send({ status: "error", message: "missing fields" })
    }
    // const newJobId= await jobIdModel.findOneAndUpdate({id:"jobId"},{$inc:{jobId:1},},{upsert:true,new:true})
    // console.log(`new job id${newJobId}`)
    const existingApplication = await jobSeekerModel.findOne({ jobId, jobSeekerId });

    if (existingApplication) {
      return res.send({ status: "error", message: "You have already applied for this job", alert: false });
    }

    const applyJobs = new jobSeekerModel({ jobId: jobId, jobSeekerId: jobSeekerId, userType: userType, })
    const saveJobs = await applyJobs.save();
    return res.send({ status: "success", message: "Job Created Successfully", data: saveJobs, alert: true })
  }
  catch (error) {
    res.send({ status: "error", message: `job not shown error ${error.message}` })
  }
}

exports.applyWebinars = async (req, res) => {
  const { webinarId, jobSeekerId, userType } = req.body;
  try {
    if (!webinarId || !jobSeekerId || !userType) {
      return res.send({ status: "error", message: "missing fields" })
    }
    // const newJobId= await jobIdModel.findOneAndUpdate({id:"jobId"},{$inc:{jobId:1},},{upsert:true,new:true})
    // console.log(`new job id${newJobId}`)
    const existingApplication = await webinarApplyModel.findOne({ webinarId, jobSeekerId });

    if (existingApplication) {
      return res.send({ status: "error", message: "You have already applied for this webinar", alert: false });
    }

    const applyWebinar = new webinarApplyModel({ webinarId: webinarId, jobSeekerId: jobSeekerId, userType: userType, })
    const saveJobs = await applyWebinar.save();
    return res.send({ status: "success", message: "applied webinar Successfully", data: saveJobs, alert: true })
  }
  catch (error) {
    res.send({ status: "error", message: `job not shown error ${error.message}` })
  }
}

exports.viewJobSeekerApplyList = async (req, res) => {
  try {
    const { jobSeekerId } = req.body;
    
if (!jobSeekerId) {
return res.send({ status: "error", message: "missing fields" })
}
const viewJobs = await jobSeekerModel.find({ jobSeekerId: jobSeekerId, }).sort({ _id: -1 })

if (viewJobs == 0) {
  return res.send({ status: "error", message: "no jobs found", data: viewJobs })
}
  else {
    
  const jobStatusMap = {};
    viewJobs.forEach((job) => {
      jobStatusMap[job.jobId] = {
        status: job.status,
        isViewed: job.isViewed,
        isApplied: job.isApplied
      };
    });
      const jobIds = viewJobs.map((job) => job.jobId);
      const jobs = await jobModel.find({ jobId: { $in: jobIds } }).sort({ _id: -1 });
      const appliedJobs = await Promise.all(jobs.map(async (job) => {
      const user = await userModel.findOne({ userId: job.userId });
          return { ...job.toObject(),
            companyDescription: user ? user.description || "" : "",
           logoImage:user ? user.logoImage || "" : "",
           status: jobStatusMap[job.jobId]?.status || "",
          isViewed: jobStatusMap[job.jobId]?.isViewed || false,
          isApplied: jobStatusMap[job.jobId]?.isApplied || false
          };
        })
      );
    return res.send({ status: "Success", total: appliedJobs.length, data: appliedJobs });
    }
  }
  catch (err) {
    res.send({ status: "error", message: "can not view jobs list" })
  }
}

//  exports.getJobById = async (req, res) => {
//   const { jobId,  } = req.body;
//   try {
//     let filter;
//     req.user.userType=='Job Seekers'?  filter={jobId: jobId, isActive: true}:filter={jobId: jobId};
//   const getJobDetails=  await jobModel.aggregate([
//   {
//     $match:filter  
//   },
//   {
//     $lookup: {
//       from: "jobseekers",
//       let: { jobId: "$jobId" },
//       pipeline: [
//         { $match: { $expr: { $eq: ["$jobId", "$$jobId"] } } },
//         { $count: "count" } 
//       ],
//       as: "jobseekersCount"
//     }
//   },
//   {
//     $addFields: {
//       totalApplicants: { $ifNull: [{ $arrayElemAt: ["$jobseekersCount.count", 0] }, 0] }
//     }
//   },
//   {
//     $project: { jobseekersCount: 0 } 
//   },
//   {
//     $sort: { _id: -1 }
//   }
// ]);

//     if (getJobDetails.length == 0) {
//      return res.send({ status: "error", message: "Job not found" })
//     }
//     return res.send({ status: "success", data: getJobDetails })
//   }
//   catch (error) {
//     console.log(error.message);
//   return  res.send({ status: "error", message: "not found job" })
//   }
//   }

  exports.getJobById = async (req, res) => {
    const jobId = req.params.jobId;
  try {
    if (!jobId) {
      return res.send({ status: "error", message: "Missing jobId" });
    }
    let filter;
    // if (req.user.userType === "Job Seekers") {
    //   filter = { jobId: Number(jobId), isActive: true };
    // } else {
     //
     
     filter = { jobId: Number(jobId) };
    // }

    const getJobDetails = await jobModel.aggregate([
      {
        $match: filter 
      },
      {
        $lookup: {
          from: "jobseekers",
          let: { jobId: "$jobId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$jobId", "$$jobId"] } } },
            { $count: "count" }
          ],
          as: "jobseekersCount"
        }
      },
      {
        $addFields: {
          totalApplicants: {
            $ifNull: [{ $arrayElemAt: ["$jobseekersCount.count", 0] }, 0]
          }
        }
      },
      {
        $project: { jobseekersCount: 0 }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    if (getJobDetails.length === 0) {
      return res.send({ status: "error", message: "Job not found" });
    }
// const existingApplication = await jobSeekerModel.findOne({ jobId:jobId, jobSeekerId:req.user.userId });

    return res.send({ status: "success", data: getJobDetails });
  } catch (error) {
    console.log(error.message);
    return res.send({ status: "error", message: "not found job" });
  }
};

  exports.updateJobStatus = async (req, res) => {
  const { jobSeekerId,jobId,status } = req.body;
  try {
  const updatedJob = await jobSeekerModel.findOneAndUpdate(
      { jobSeekerId, jobId },
      { status, updatedDate: new Date() },
      { new: true } 
    );
    if (updatedJob.length == 0) {
      res.send({ status: "error", message: "Job not found" })
    }
    res.send({ status: "success", message: "update JobStatus successfully",data:updatedJob})
  }
  catch (error) {
    res.send({ status: "error", message: "not updated " })
  }
  }
exports.updateApplicationStatus = async (req, res) => {
  const { jobId,isActive } = req.body;
  try {
  const updatedJob = await jobModel.findOneAndUpdate(
      {  jobId },
      { isActive, updatedDate: new Date() },
      { new: true } 
    );
    if (updatedJob.length == 0) {
      res.send({ status: "error", message: "Job not found" })
    }
    res.send({ status: "success", message: "updated JobStatus successfully",data:updatedJob})
  }
  catch (error) {
    res.send({ status: "error", message: "not updated " })
  }
  }

  exports.updateWebinarStatus = async (req, res) => {
  const { webinarId,isActive } = req.body;
  try {
  const updatedWebinar = await webinarModel.findOneAndUpdate(
      {  webinarId },
      { isActive, updatedDate: new Date() },
      { new: true } 
    );
    if (updatedWebinar.length == 0) {
      res.send({ status: "error", message: "Webinar not found" })
    }
    res.send({ status: "success", message: "updated Webinar Status successfully",data:updatedJob})
  }
  catch (error) {
    res.send({ status: "error", message: "status not updated " })
  }
  }


exports.addJobCategory = async (req, res) => {
  try {
    const { name, userType } = req.body;

    if (!name || !userType) {
      return res.send({ status: "error", message: "Missing fields" });
    }

    const existing = await jobCategoryModel.findOne({ name, userType });

    if (existing) {
      return res.send({ status: "error", message: "Category already exists" });
    }

    const category = await jobCategoryModel.create({
      name,
      userType,userId:req.user.userId
    });

    return res.send({
      status: "success",
      message: "Category added successfully",
      data: category,
    });
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
    });
  }
};


exports.getJobCategories = async (req, res) => {
  try {
    const { userType } = req.body;

    const filter = { isActive: true };

    if (userType) {
      filter.userType = userType;
    }

    const categories = await jobCategoryModel.find(filter).sort({ name: 1 });

    return res.send({
      status: "success",
      data: categories,
    });
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateJobCategory = async (req, res) => {
  try {
    const {id, name, } = req.body;

    const updated = await jobCategoryModel.findByIdAndUpdate(
      id,
      {
        name,userId:req.user.userId,
        updatedDate: Date.now(),
      },
      { new: true }
    );

    return res.send({
      status: "success",
      message: "Category updated",
      data: updated,
    });
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteJobCategory = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.send({ status: "error", message: "Invalid ID" });
    }

    const deleteId = await jobCategoryModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id), // Use 'new' here
      { isActive: false },
      { new: true } // optional: return updated document
    );

    if (!deleteId) {
      return res.send({ status: "error", message: "Category not found" });
    }

    console.log(deleteId);

    return res.send({
      status: "success",
      message: "Category deleted",
    });
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
    });
  }
};
