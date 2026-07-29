// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadDirs = {
//   profileImage: 'ProfilePictures',
//   certificates: 'Certificates',
//   webinarImage:'webinarImage',
//   serviceImage:'serviceImage',
//   jobImage:'jobImage',
//   contactImage:'contactImage',
//   posterImages:'posterImages',
//   logo:'logo',
//   notificationImage:'notificationImage'
// };

// Object.values(uploadDirs).forEach(dir => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder;

//     if (file.fieldname === 'image') {
//       folder = uploadDirs.profileImage;
//     } 
//     else if (file.fieldname === 'certificates') {
//       folder = uploadDirs.certificates;
//     } 
//     else if (file.fieldname === 'logoImage') {
//       folder = uploadDirs.logo;
//     } 
//     else if (file.fieldname === 'webinarImage') {
//       folder = uploadDirs.webinarImage;
//     } 
//      else if (file.fieldname === 'jobImage') {
//       folder = uploadDirs.jobImage;
//     } 
//     else if (file.fieldname === 'serviceImage') {
//       folder = uploadDirs.serviceImage;
//     } 
//     else if (file.fieldname === 'contactImage') {
//       folder = uploadDirs.contactImage;
//     } 
//       else if (file.fieldname === 'posterImages') {
//       folder = uploadDirs.posterImages;
//     } 
//     else if (file.fieldname === 'notificationImage') {
//       folder = uploadDirs.notificationImage;
//     } 
//     else {
//       return cb(new Error('Invalid file fieldname'), null);
//     }

//     cb(null, folder);
//   },

//   filename: (req, file, cb) => {
//     console.log(`path ${req.body.userId}`);

//     const userId = req.body.userId || Date.now();

//     cb(null, `${userId}_${file.fieldname}${Date.now()}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({
//   storage,
//   limits: { fileSize:4 * 1024 * 1024 }, 
// });

// module.exports = upload;


// const AWS = require("aws-sdk");
// const multer = require("multer");

// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, 
// });


// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

// async function uploadToS3(file) {
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${Date.now()}-${file.originalname}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     // ACL: "public-read"
//   };

//   const result = await s3.upload(params).promise();
//   return result.Location;
// }

// module.exports = {upload,uploadToS3};

const AWS = require("aws-sdk");
const multer = require("multer");

// Multer memory storage to get file buffer
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 4 * 1024 * 1024 }, 
// });


const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/octet-stream"];
    const videoTypes = ["video/mp4", "video/quicktime"];

    if (imageTypes.includes(file.mimetype)) {

      if (parseInt(req.headers["content-length"]) > 5 * 1024 * 1024) {
        return cb(new Error("Image must be less than 5MB"), false);
      }
      cb(null, true);
    } 
    else if (videoTypes.includes(file.mimetype)) {
      // 100MB allowed for video
      cb(null, true);
    } 
    else {
      console.log("Uploading file:", file.originalname, "MIME:", file.mimetype);
      cb(new Error("Only images and videos allowed"), false);
    }
  },
});
// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadDirs = {
  profileImage: 'ProfilePictures',
  certificates: 'Certificates',
  webinarImage:'webinarImage',
  serviceImage:'serviceImage',
  jobImage:'jobImage',
  contactImage:'contactImage',
  posterImages:'posterImages',
  logo:'logo',
  notificationImage:'notificationImage',
  appLogo:'appLogo',
  salePostImage:'salePostImage'
};
async function uploadToS3(file) {
  let folder;

  switch(file.fieldname) {
    case 'image': folder = uploadDirs.profileImage; break;
    case 'certificates': folder = uploadDirs.certificates; break;
    case 'logoImage': folder = uploadDirs.logo; break;
    case 'appLogo': folder = uploadDirs.appLogo; break;
    case 'webinarImage': folder = uploadDirs.webinarImage; break;
    case 'jobImage': folder = uploadDirs.jobImage; break;
    case 'serviceImage': folder = uploadDirs.serviceImage; break;
    case 'contactImage': folder = uploadDirs.contactImage; break;
    case 'posterImages': folder = uploadDirs.posterImages; break;
    case 'salePostImage': folder = uploadDirs.salePostImage; break;
    case 'notificationImage': folder = uploadDirs.notificationImage; break;
    default: folder = "Others";
  }
  const userId = file.userId || Date.now();

  const mimeToExt = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
      "video/mp4": "mp4",         
  "video/quicktime": "mov"   
  };

  const ext = mimeToExt[file.mimetype] || "jpg";

  const fileName = `${userId}_${file.fieldname}_${Date.now()}.${ext}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}
// Function to upload a file to S3
// async function uploadToS3(file) {
//   // Determine S3 folder based on file.fieldname
//   let folder;
//   switch(file.fieldname) {
//     case 'image': folder = uploadDirs.profileImage; break;
//     case 'certificates': folder = uploadDirs.certificates; break;
//     case 'logoImage': folder = uploadDirs.logo; break;
//         case 'appLogo': folder = uploadDirs.appLogo; break;
//     case 'webinarImage': folder = uploadDirs.webinarImage; break;
//     case 'jobImage': folder = uploadDirs.jobImage; break;
//     case 'serviceImage': folder = uploadDirs.serviceImage; break;
//     case 'contactImage': folder = uploadDirs.contactImage; break;
//     case 'posterImages': folder = uploadDirs.posterImages; break;
//     case 'notificationImage': folder = uploadDirs.notificationImage; break;
//     default: folder = "Others"; 
//   }

//   const userId = file.userId || Date.now(); 
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${folder}/${userId}_${file.fieldname}_${Date.now()}${file.originalname ? '.' + file.originalname.split('.').pop() : ''}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     // ACL: "public-read"
//   };
//   const result = await s3.upload(params).promise();
//   return result.Location; 
// }
async function deleteFromS3(fileUrl) {
  if (typeof fileUrl !== "string") throw new Error("fileUrl must be a string");

  const cleanUrl = fileUrl.split("?")[0]; 
  const key = decodeURIComponent(cleanUrl.split(".amazonaws.com/")[1]);
  if (!key) throw new Error("Failed to parse S3 key from URL");

  const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
  const result = await s3.deleteObject(params).promise();
  console.log("S3 delete response:", result);
  return result;
}

module.exports = { upload, uploadToS3,deleteFromS3 };
