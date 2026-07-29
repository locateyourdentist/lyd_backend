const express = require('express');
const app = express();
const notificationModel = require('../model/notification_model');
const userModel = require('../model/user')
const firebaseAdmin = require('firebase-admin');
const fcmModel = require('../model/fcm_token_model')
const dotenv = require('dotenv');
dotenv.config();
const { uploadToS3 ,deleteFromS3 } = require("../file_uploadImage");
const { errorLogger, successLogger } = require('../logger_error/logger');
const geo = require("geodata-utils");
const LocationModel=require('../model/state_district_model')
const axios=require('axios')
const { getNotificationContent, dispatchWhatsapp } = require('./notification_content_service')

// admin.initializeApp({
//   credential: admin.credential.cert(require('../locateyourdentist-5c2ca-firebase-adminsdk-fbsvc-e04318573f.json')),
// });

// exports.createNotification=async(req,res)=>{
// try{
// const {userId,userType,title,message,}=req.body;
// if(!userId||!userType||!title||!message){
//     return res.send({status:"error",message:"missing field"})
// }
// const getUserDetails=await userModel.find({userId:userId},{"address.state":1,"address.district":1,"address.city":1,"address.area":1,_id:0}).lean();
// if(!getUserDetails){
// return res.send({status:"error",message:"no user found"})
// }
// //const state= getUserDetails[0].address.state;
// const district=getUserDetails[0].address.district;
// const city=getUserDetails[0].address.city;
// const area=getUserDetails[0].address.area;
// const state=getUserDetails[0].address.state;

// console.log(`state ${state}`)
//   if (userType !== "admin" && userType !== "superAdmin") {
//  // if(!userId){   
//    const admins = await userModel.find({ userType: "admin", "address.state": state },{ userId: 1 });
//    const superAdmins = await userModel.find({ userType: "superAdmin" },{ userId: 1 } );
//    const receivers = [...admins, ...superAdmins];

//   if (receivers.length === 0) {
//   return res.send({ status: "error", message: "No admin found" });
//   }
//    for (const admin of receivers) {
//         await notificationModel.create({
//           userId: admin.userId,
//           userType: "admin",
//           title,
//           message,
//           // state,
//           // district,
//           // city,
//           // area,
//           read: false,
//           isActive: true
//         });
//      const getToken=await fcmModel.find({userId:admin.userId},{fcmToken:1,_id:0})
//      if(getToken.length>0){
//      const message1 = {
//      token: getToken[0].fcmToken,
//      notification: {
//      title: title,
//      body: message},
//      data: {
//      click_action: 'FLUTTER_NOTIFICATION_CLICK', 
//      screen: 'home', 
//     },};
//     admin.messaging().send(message1).then((response) => {
//     console.log('Successfully sent message:', response);
//     }).catch((error) => {
//     console.log('Error sending message:', error);});
//        }
//        }
//        await notificationModel.create({
//           userId:userId,
//           userType: "admin",
//           title,
//           message,
//           // state,
//           // district,
//           // city,
//           // area,
//           read: false,
//           isActive: true
//         });
//     const getToken=await fcmModel.find({userId:userId},{fcmToken:1,_id:0})
//     const message1 = {
//      token: getToken[0].fcmToken,
//      notification: {
//      title: title,
//      body: message,},
//      data: {
//      click_action: 'FLUTTER_NOTIFICATION_CLICK', 
//      screen: 'home', 
//   },
// };

// admin.messaging().send(message1)
//   .then((response) => {
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });
//       res.send({
//         status: "success",
//         message: "Notification sent to all admins"
//       });
//     }
// else{
// //return res.send({status:"success",data:getUserDetails[0]})
// const notification=new notificationModel({userId:userId,userType:userType,title:title,message:message,state:state,district:district,city:city,area:area})
// const saveNotification=await notification.save();
//      const getToken=await fcmModel.find({userId:admin.userId},{fcmToken:1,_id:0})

//    const message1 = {
//      token: getToken[0].fcmToken,
//      notification: {
//      title: title,
//      body: message,},
//      data: {
//      click_action: 'FLUTTER_NOTIFICATION_CLICK', 
//      screen: 'home', 
//   },
// };

// admin.messaging().send(message1)
//   .then((response) => {
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });
// res.send({status:"success",data:saveNotification})
// }
// }
// catch(error){
// return res.send({status:"error",message:`notification not created error ${error.message}`})
// }
// }
if (!firebaseAdmin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}
// exports.createNotification = async (req, res) => {
//   try {
//   const {
//       userId,
//       userType,
//       title,
//       message,
//       state,
//       district,
//       city,
//       area
//     } = req.body;

//     if (!userId || !userType || !title || !message) {
//       return res.send({
//         status: "error",
//         message: "Missing fields"
//       });
//     }

//     // CHECK USER
//     const sender = await userModel.findOne(
//       { userId },
//       { address: 1 }
//     ).lean();

//     if (!sender) {
//       return res.send({
//         status: "error",
//         message: "No user found"
//       });
//     }

//     // IMAGE
//     let notificationImage = "";

//    if (req.file) {
//   notificationImage = await uploadToS3(req.file);

//   console.log("S3 URL:", notificationImage);
// }
// console.log("Uploaded file:", req.file);
//     const sendPushNotification = async (
//       targetUserId,
//       title,
//       message,
//       notificationImage
//     ) => {

//       const tokens = await fcmModel.find(
//         { userId: targetUserId },
//         { fcmToken: 1, _id: 0 }
//       ).lean();

//       if (!tokens.length) return;

//       for (const t of tokens) {

//         const payload = {
//           token: t.fcmToken,

//           notification: {
//             title: title,
//             body: message,
//           },

//           android: {
//             priority: "high",
//             notification: {
//               title: title,
//               body: message,
//               sound: "default",
//               channelId: "high_importance_channel",

//               // IMPORTANT
//               imageUrl: notificationImage || undefined,
//             },
//           },

//           apns: {
//             payload: {
//               aps: {
//                 "mutable-content": 1,
//                 sound: "default",
//               },
//             },

//             fcm_options: {
//               image: notificationImage || undefined,
//             },
//           },

//           data: {
//             title: title,
//             body: message,
//             image: notificationImage || "",
//             click_action: "FLUTTER_NOTIFICATION_CLICK",
//             screen: "home",
//           },
//         };

//         console.log(
//           "FCM PAYLOAD:",
//           JSON.stringify(payload, null, 2)
//         );

//         try {

//           await firebaseAdmin.messaging().send(payload);

//           console.log(
//             `Notification sent to ${targetUserId}`
//           );

//         } catch (err) {

//           console.error(
//             "FCM ERROR:",
//             err.message
//           );

//           // REMOVE INVALID TOKEN
//           if (
//             err.code ===
//             "messaging/registration-token-not-registered"
//           ) {

//             await fcmModel.deleteOne({
//               fcmToken: t.fcmToken
//             });
//           }
//         }
//       }
//     };
//     if (
//       userType !== "admin" &&
//      userType !== "superAdmin" ) {

//       const admins = await userModel.find(
//         {
//          userType: "admin",
//           "address.state": state
//         },
//         { userId: 1 }
//       ).lean();

//       // const superAdmins = await userModel.find(
//       //   {
//       //     userType: userType=="All"?"":userType,
//       //     "address.state": state
//       //   },
//       //   { userId: 1 }
//       // ).lean();

//       const superAdmins = await userModel.find(
//         {
//           userType: userType=="superAdmin",
//         },
//         { userId: 1 }
//       ).lean();
//       const receiverMap = new Map();

//       [...admins, ...superAdmins].forEach((u) => {
//         receiverMap.set(u.userId, u);
//       });

//       const receivers = [...receiverMap.values()];

//       if (!receivers.length) {
//         return res.send({
//           status: "error",
//           message: "No admin found"
//         });
//       }
//       for (const receiver of receivers) {
//         await notificationModel.create({
//           userId: receiver.userId,
//           userType,
//           notificationImage,
//           title,
//           message,
//           state,
//           district,
//           city,
//           area,
//           read: false,
//           isActive: true,
//         });

//         await sendPushNotification(
//           receiver.userId,
//           title,
//           message,
//           notificationImage
//         );
//       }
//       await notificationModel.create({
//         userId,
//         userType,
//         notificationImage,
//         title,
//         message,
//         state,
//         district,
//         city,
//         area,
//         read: false,
//         isActive: true,
//       });

//       // SEND TO SENDER ALSO
//       await sendPushNotification(
//         userId,
//         title,
//         message,
//         notificationImage
//       );

//       return res.send({
//         status: "success",
//         message: `Notification sent to ${receivers.length} users`,
//       });
//     }
//     else {

//       const query = {};

//       if (userType && userType !== "All") {
//         query.userType = userType;
//       }
//      if (userId && userId !== "") {
//         query.userId = userId;
//       }
//       if (state) {
//         query["address.state"] = state;
//       }

//       if (district) {
//         query["address.district"] = district;
//       }

//       if (city) {
//         query["address.city"] = city;
//       }

//       if (area) {
//         query["address.area"] = area;
//       }

//       const users = await userModel.find(
//         query,
//         { userId: 1 }
//       ).lean();

//       if (!users.length) {
//         return res.send({
//           status: "error",
//           message: "No users found"
//         });
//       }

//       for (const receiver of users) {

//         await notificationModel.create({
//           userId: receiver.userId,
//           userType,
//           notificationImage,
//           title,
//           message,
//           state,
//           district,
//           city,
//           area,
//           read: false,
//           isActive: true,
//         });

//         await sendPushNotification(
//           receiver.userId,
//           title,
//           message,
//           notificationImage
//         );
//       }

//       return res.send({
//         status: "success",
//         message: `Notification sent to ${users.length} users`,
//       });
//     }

//   } catch (error) {

//     console.error(
//       "NOTIFICATION ERROR:",
//       error
//     );

//     return res.send({
//       status: "error",
//       message: error.message
//     });
//   }
// };
// exports.createNotification = async (req, res) => {
// try {
// const {
// userId,
// userType,
// isAdmin,
// title,
// message,
// state,
// district,
// city,
// area
// } = req.body;


// if (!userType || !title || !message) {
//   return res.send({
//     status: "error",
//     message: "Missing fields"
//   });
// }

// let notificationImage = "";

// if (req.file) {
//   notificationImage = await uploadToS3(req.file);
//   console.log("S3 URL:", notificationImage);
// }

// const sendPushNotification = async (
//   targetUserId,
//   title,
//   message,
//   notificationImage
// ) => {
//   const tokens = await fcmModel.find(
//     { userId: targetUserId },
//     { fcmToken: 1, _id: 0 }
//   ).lean();

//   if (!tokens.length) return;

//   for (const t of tokens) {
//     const payload = {
//       token: t.fcmToken,

//       notification: {
//         title,
//         body: message,
//       },

//       android: {
//         priority: "high",
//         notification: {
//           title,
//           body: message,
//           sound: "default",
//           channelId: "high_importance_channel",
//           imageUrl: notificationImage || undefined,
//         },
//       },

//       apns: {
//         payload: {
//           aps: {
//             "mutable-content": 1,
//             sound: "default",
//           },
//         },
//         fcm_options: {
//           image: notificationImage || undefined,
//         },
//       },

//       data: {
//         title,
//         body: message,
//         image: notificationImage || "",
//         click_action: "FLUTTER_NOTIFICATION_CLICK",
//         screen: "home",
//       },
//     };

//     try {
//       await firebaseAdmin.messaging().send(payload);

//       console.log(
//         `Notification sent to ${targetUserId}`
//       );
//     } catch (err) {
//       console.error("FCM ERROR:", err.message);

//       if (
//         err.code ===
//         "messaging/registration-token-not-registered"
//       ) {
//         await fcmModel.deleteOne({
//           fcmToken: t.fcmToken,
//         });
//       }
//     }
//   }
// };

// // ==================================================
// // COLLECT RECEIVERS (NO DUPLICATES)
// // ==================================================

// const receivers = new Map();

// // DIRECT USER
// if (userId && userId !== "") {
//   receivers.set(userId, userId);
// }

// // ADMIN FLOW
// if (isAdmin === true || isAdmin === "true") {
//   const admins = await userModel.find(
//     {
//       userType: "admin",
//       "address.state": state,
//     },
//     { userId: 1 }
//   ).lean();

//   const superAdmins = await userModel.find(
//     {
//       userType: "superAdmin",
//     },
//     { userId: 1 }
//   ).lean();

//   [...admins, ...superAdmins].forEach((u) => {
//     receivers.set(u.userId, u.userId);
//   });
// }

// // SUPER ADMIN FLOW
// if (req.user?.userType === "superAdmin") {
//   const query = {};

//   if (userType && userType !== "All") {
//     query.userType = userType;
//   }

//   if (state) {
//     query["address.state"] = state;
//   }

//   if (district) {
//     query["address.district"] = district;
//   }

//   if (city) {
//     query["address.city"] = city;
//   }

//   if (area) {
//     query["address.area"] = area;
//   }

//   const users = await userModel.find(
//     query,
//     { userId: 1 }
//   ).lean();

//   users.forEach((u) => {
//     receivers.set(u.userId, u.userId);
//   });
// }

// if (receivers.size === 0) {
//   return res.send({
//     status: "error",
//     message: "No users found",
//   });
// }

// // ==================================================
// // SAVE + SEND
// // ==================================================

// for (const receiverId of receivers.keys()) {
//   await notificationModel.create({
//     userId: receiverId,
//     userType,
//     notificationImage,
//     title,
//     message,
//     state,
//     district,
//     city,
//     area,
//     read: false,
//     isActive: true,
//   });

//   await sendPushNotification(
//     receiverId,
//     title,
//     message,
//     notificationImage
//   );
// }

// return res.send({
//   status: "success",
//   message: `Notification sent to ${receivers.size} users`,
// });

// } catch (error) {
// console.error(
// "NOTIFICATION ERROR:",
// error
// );

// return res.send({
//   status: "error",
//   message: error.message,
// });

// }
// };
///sdsdsadnotifi
// const createAndSendNotification = async (
//   receiverUserId,
//   receiverUserType,
//   notificationImage,
//   title,
//   message,
//   state,
//   district,
//   city,
//   area
// ) => {

//   await notificationModel.create({
//     userId: receiverUserId,
//     userType: receiverUserType,
//     notificationImage: notificationImage || "",
//     title,
//     message,
//     state,
//     district,
//     city,
//     area,
//     read: false,
//     isActive: true,
//   });
//  const sendPushNotification = async (
//       targetUserId,
//       title,
//       message,
//       notificationImage
//     ) => {

//       const tokens = await fcmModel.find(
//         { userId: targetUserId },
//         { fcmToken: 1, _id: 0 }
//       ).lean();

//       if (!tokens.length) return;

//       for (const t of tokens) {

//         const payload = {
//           token: t.fcmToken,

//           notification: {
//             title: title,
//             body: message,
//           },

//           android: {
//             priority: "high",
//             notification: {
//               title: title,
//               body: message,
//               sound: "default",
//               channelId: "high_importance_channel",

//               // IMPORTANT
//               imageUrl: notificationImage || undefined,
//             },
//           },

//           apns: {
//             payload: {
//               aps: {
//                 "mutable-content": 1,
//                 sound: "default",
//               },
//             },

//             fcm_options: {
//               image: notificationImage || undefined,
//             },
//           },

//           data: {
//             title: title,
//             body: message,
//             image: notificationImage || "",
//             click_action: "FLUTTER_NOTIFICATION_CLICK",
//             screen: "home",
//           },
//         };

//         console.log(
//           "FCM PAYLOAD:",
//           JSON.stringify(payload, null, 2)
//         );

//         try {

//           await firebaseAdmin.messaging().send(payload);

//           console.log(
//             `Notification sent to ${targetUserId}`
//           );

//         } catch (err) {

//           console.error(
//             "FCM ERROR:",
//             err.message
//           );

//           // REMOVE INVALID TOKEN
//           if (
//             err.code ===
//             "messaging/registration-token-not-registered"
//           ) {

//             await fcmModel.deleteOne({
//               fcmToken: t.fcmToken
//             });
//           }
//         }
//       }}
//   await sendPushNotification(
//     receiverUserId,
//     title,
//     message,
//     notificationImage || ""
//   );
// };
// //neww
// exports.createNotification = async (req, res) => {
//   try {
//   const {
//       userId,
//       userType,isAdmin,
//       title,
//       message,
//       state,
//       district,
//       city,
//       area
//     } = req.body;

//     if ( !userType || !title || !message) {
//       return res.send({
//         status: "error",
//         message: "Missing fields"
//       });
//     }
//  let notificationImage = "";

//    if (req.file) {
//   notificationImage = await uploadToS3(req.file);

//   console.log("S3 URL:", notificationImage);
// }
//     // CHECK USER
// //     const sender = await userModel.findOne(
// //       { userId },
// //       { address: 1 }
// //     ).lean();

// //     if (!sender) {
// //       return res.send({
// //         status: "error",
// //         message: "No user found"
// //       });
// //     }

// //     // IMAGE
// //     let notificationImage = "";

// //    if (req.file) {
// //   notificationImage = await uploadToS3(req.file);

// //   console.log("S3 URL:", notificationImage);
// // }
// // console.log("Uploaded file:", req.file);
// //     const sendPushNotification = async (
// //       targetUserId,
// //       title,
// //       message,
// //       notificationImage
// //     ) => {

// //       const tokens = await fcmModel.find(
// //         { userId: targetUserId },
// //         { fcmToken: 1, _id: 0 }
// //       ).lean();

// //       if (!tokens.length) return;

// //       for (const t of tokens) {

// //         const payload = {
// //           token: t.fcmToken,

// //           notification: {
// //             title: title,
// //             body: message,
// //           },

// //           android: {
// //             priority: "high",
// //             notification: {
// //               title: title,
// //               body: message,
// //               sound: "default",
// //               channelId: "high_importance_channel",

// //               // IMPORTANT
// //               imageUrl: notificationImage || undefined,
// //             },
// //           },

// //           apns: {
// //             payload: {
// //               aps: {
// //                 "mutable-content": 1,
// //                 sound: "default",
// //               },
// //             },

// //             fcm_options: {
// //               image: notificationImage || undefined,
// //             },
// //           },

// //           data: {
// //             title: title,
// //             body: message,
// //             image: notificationImage || "",
// //             click_action: "FLUTTER_NOTIFICATION_CLICK",
// //             screen: "home",
// //           },
// //         };

// //         console.log(
// //           "FCM PAYLOAD:",
// //           JSON.stringify(payload, null, 2)
// //         );

// //         try {

// //           await firebaseAdmin.messaging().send(payload);

// //           console.log(
// //             `Notification sent to ${targetUserId}`
// //           );

// //         } catch (err) {

// //           console.error(
// //             "FCM ERROR:",
// //             err.message
// //           );

// //           // REMOVE INVALID TOKEN
// //           if (
// //             err.code ===
// //             "messaging/registration-token-not-registered"
// //           ) {

// //             await fcmModel.deleteOne({
// //               fcmToken: t.fcmToken
// //             });
// //           }
// //         }
// //       }
// //     };
// //     if(userId!==""){
// //    await notificationModel.create({
// //           userId: userId,
// //           userType,
// //           notificationImage,
// //           title,
// //           message,
// //           state,
// //           district,
// //           city,
// //           area,
// //           read: false,
// //           isActive: true,
// //         });
      
// //     await sendPushNotification(
// //           userId,
// //           title,
// //           message,
// //           notificationImage
// //         );
// //       }
// //        const allUsers = await userModel.find(
// //         {
// //           userType: userType,
// //         },
// //         { userId: 1 }
// //       ).lean();
// //       const userMap = new Map();

// //       [ ...allUsers].forEach((u) => {
// //         userMap.set(u.userId, u);
// //       });

// //       const allUsersMap = [...userMap.values()];

    
// //       for (const user of allUsersMap) {
// //         await notificationModel.create({
// //           userId: user.userId,
// //           userType,
// //           notificationImage,
// //           title,
// //           message,
// //           state,
// //           district,
// //           city,
// //           area,
// //           read: false,
// //           isActive: true,
// //         });
      

// //       await sendPushNotification(
// //           user.userId,
// //           title,
// //           message,
// //           notificationImage
// //         );
// //       }
// //     // if (
// //     //   userType !== "admin" &&
// //     //  userType !== "superAdmin" ) {
// //     if(isAdmin){
// //       const admins = await userModel.find(
// //         {
// //          userType: "admin",
// //           "address.state": state
// //         },
// //         { userId: 1 }
// //       ).lean();

// //       // const superAdmins = await userModel.find(
// //       //   {
// //       //     userType: userType=="All"?"":userType,
// //       //     "address.state": state
// //       //   },
// //       //   { userId: 1 }
// //       // ).lean();

// //       const superAdmins = await userModel.find(
// //         {
// //           userType: userType=="superAdmin",
// //         },
// //         { userId: 1 }
// //       ).lean();
// //       const receiverMap = new Map();

// //       [...admins, ...superAdmins].forEach((u) => {
// //         receiverMap.set(u.userId, u);
// //       });

// //       const receivers = [...receiverMap.values()];

// //       if (!receivers.length) {
// //         return res.send({
// //           status: "error",
// //           message: "No admin found"
// //         });
// //       }
// //       for (const receiver of receivers) {
// //         await notificationModel.create({
// //           userId: receiver.userId,
// //           userType,
// //           notificationImage,
// //           title,
// //           message,
// //           state,
// //           district,
// //           city,
// //           area,
// //           read: false,
// //           isActive: true,
// //         });

// //           await sendPushNotification(
// //           receiver.userId,
// //           title,
// //           message,
// //           notificationImage
// //         );
// //       }

     
// //     }
// //      if(req.user.userType=="superAdmin"){


// //       const query = {};

// //       if (userType && userType !== "All") {
// //         query.userType = userType;
// //       }
// //      if (userId && userId !== "") {
// //         query.userId = userId;
// //       }
// //       if (state) {
// //         query["address.state"] = state;
// //       }

// //       if (district) {
// //         query["address.district"] = district
// //       }

// //       if (city) {
// //         query["address.city"] = city;
// //       }

// //       if (area) {
// //         query["address.area"] = area;
// //       }

// //       const users = await userModel.find(
// //         query,
// //         { userId: 1 }
// //       ).lean();

// //       if (!users.length) {
// //         return res.send({
// //           status: "error",
// //           message: "No users found"
// //         });
// //       }

// //       for (const receiver of users) {

// //         await notificationModel.create({
// //           userId: receiver.userId,
// //           userType,
// //           notificationImage,
// //           title,
// //           message,
// //           state,
// //           district,
// //           city,
// //           area,
// //           read: false,
// //           isActive: true,
// //         });

// //         await sendPushNotification(
// //           receiver.userId,
// //           title,
// //           message,
// //           notificationImage
// //         );
// //       }
// const receiverMap = new Map();

// if (userType === "superAdmin") {

//   const query = {};

//   // if (userId && userId !== "") {
//   //   query.userId = userId;
//   // }

//   if (userType) {
//     query.userType = userType;
//   }

//   if (state) query["address.state"] = state;
//   if (district) query["address.district"] = district;
//   if (city) query["address.city"] = city;
//   if (area) query["address.area"] = area;

//   const users = await userModel.find(
//     query,
//     { userId: 1, userType: 1 }
//   ).lean();
//  console.log(`USERS COUNT:${users.length}`);
//  console.log("USERS:", users);
//   if (!users.length) {
//     return res.send({
//       status: "error",
//       message: "No users found"
//     });
//   }

//   for (const user of users) {
//       console.log("Sending notification to:", user.userId);
//       console.log("users length notification ", users);
//       console.log('dfsffd');
//    await createAndSendNotification(
//     user.userId,
//     user.userType,
//   // receiver.userId,
//   // receiver.userType,
//   notificationImage,
//   title,
//   message,
//   state,
//   district,
//   city,
//   area
// );
//   }
//   return res.send({
//     status: "success",
//     message: `Notification sent to ${users.length} users`
//   });
// }
// // NORMAL USER / ADMIN REQUEST
// if (isAdmin === true || isAdmin === "true") {

//   const admins = await userModel.find(
//     {
//       userType: {
//         $in: ["admin", "superAdmin"]
//       }
//     },
//     {
//       userId: 1,
//       userType: 1
//     }
//   ).lean();

//   admins.forEach((u) => {
//     receiverMap.set(u.userId, u);
//   });

// } else {

//   //
//   // USER ID
//   //
//   if (userId && userId !== "") {

//     const user = await userModel.findOne(
//       { userId },
//       {
//         userId: 1,
//         userType: 1
//       }
//     ).lean();

//     if (user) {
//       receiverMap.set(user.userId, user);
//     }
//   }

//   //
//   // USER TYPE
//   //
//   if (
//     userType &&
//     userType !== "" &&
//     userType !== "All"
//   ) {

//     const users = await userModel.find(
//       {
//         userType
//       },
//       {
//         userId: 1,
//         userType: 1
//       }
//     ).lean();

//     users.forEach((u) => {
//       receiverMap.set(u.userId, u);
//     });
//   }
// }

// const receivers = [...receiverMap.values()];

// if (!receivers.length) {

//   return res.send({
//     status: "error",
//     message: "No users found"
//   });
// }

// for (const receiver of receivers) {

//   await createAndSendNotification(
//   receiver.userId,
//   receiver.userType,
//   notificationImage,
//   title,
//   message,
//   state,
//   district,
//   city,
//   area
// );

//       return res.send({
//         status: "success",
//         message: `Notification sent to ${receivers.length} users`,
//       });
//     }

//   } catch (error) {

//     console.error(
//       "NOTIFICATION ERROR:",
//       error
//     );

//     return res.send({
//       status: "error",
//       message: error.message
//     });
//   }
// };


const createAndSendNotification = async (
  receiverUserId,
  receiverUserType,
  notificationImage,
  title,
  message,
  state,
  district,
  city,
  area
) => {
  // Save notification in Database
  await notificationModel.create({
    userId: receiverUserId,
    userType: receiverUserType,
    notificationImage: notificationImage || "",
    title,
    message,
    state,
    district,
    city,
    area,
    read: false,
    isActive: true,
  });

  // Inner function to query tokens and dispatch via Firebase Admin SDK
  const sendPushNotification = async (
    targetUserId,
    title,
    message,
    notificationImage
  ) => {
    const tokens = await fcmModel.find(
      { userId: targetUserId },
      { fcmToken: 1, _id: 0 }
    ).lean();

    if (!tokens.length) {
      console.log(`[FCM] No tokens found in DB for user: ${targetUserId}`);
      return;
    }

    for (const t of tokens) {
     const payload = {
  token: t.fcmToken,

  notification: {
    title: title,
    body: message,
  },

  android: {
    priority: "high",
    notification: {
      title: title,
      body: message,
      sound: "default",
      channelId: "high_importance_channel",
      imageUrl: notificationImage || undefined,
      tag: receiverUserId, 
    },
  },

  apns: {
    payload: {
      aps: {
        "mutable-content": 1,
        sound: "default",
      
      },
    },
    fcm_options: {
      image: notificationImage || undefined,
    },
  },

  data: {
    title: title,
    body: message,
    image: notificationImage || "",
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    screen: "home",
    
    recipientId: receiverUserId, 
  },
};

      try {
        await firebaseAdmin.messaging().send(payload);
        console.log(`[FCM] Notification successfully sent to token owner of user: ${targetUserId}`);
      } catch (err) {
        console.error(`[FCM ERROR] Failed for user ${targetUserId}:`, err.message);

        // Remove token if expired/invalid
        if (err.code === "messaging/registration-token-not-registered") {
          await fcmModel.deleteOne({ fcmToken: t.fcmToken });
          console.log(`[DB Cleared] Removed expired token for user: ${targetUserId}`);
        }
      }
    }
  };

  // Execute Firebase Dispatch
  await sendPushNotification(
    receiverUserId,
    title,
    message,
    notificationImage || ""
  );
};

  exports.createNotification = async (req, res) => {
  try {
    const {
      userId,
      userType,
      isAdmin,
      title,
      message,
      state,
      district,
      city,
      area
    } = req.body;

    if (!userType || !title || !message) {
      return res.send({
        status: "error",
        message: "Missing fields"
      });
    }
    let notificationImage = "";
    if (req.file) {
      notificationImage = await uploadToS3(req.file);
      console.log("S3 URL:", notificationImage);
    }

    if (userType === "superAdmin") {
      const query = { userType: "superAdmin" };

      if (state) query["address.state"] = state;
      if (district) query["address.district"] = district;
      if (city) query["address.city"] = city;
      if (area) query["address.area"] = area;

      const users = await userModel.find(query, { userId: 1, userType: 1 }).lean();
      console.log(`[superAdmin Path] Matching Users Count: ${users.length}`);

      if (!users.length) {
        return res.send({
          status: "error",
          message: "No users found"
        });
      }

      for (const user of users) {
        await createAndSendNotification(
          user.userId,
          user.userType,
          notificationImage,
          title,
          message,
          state,
          district,
          city,
          area
        );
      }

      return res.send({
        status: "success",
        message: `Notification sent to ${users.length} users`
      });
    }
    const receiverMap = new Map();

    if (isAdmin === true || isAdmin === "true") {
      const admins = await userModel.find(
        { userType: { $in: ["admin", "superAdmin"] } },
        { userId: 1, userType: 1, name: 1, mobileNumber: 1 }
      ).lean();

      admins.forEach((u) => receiverMap.set(u.userId, u));
    } else {
      if (userId && userId !== "") {
        const user = await userModel.findOne(
          { userId },
          { userId: 1, userType: 1, name: 1, mobileNumber: 1 }
        ).lean();

        if (user) {
          receiverMap.set(user.userId, user);
        }
      }
      // if (userType && userType !== "" && userType !== "All") {
        if (userType ) {
        const users = await userModel.find(
          userType === "All" ? {} : { userType },
          { userId: 1, userType: 1, name: 1, mobileNumber: 1, isActive:true }
        ).lean();

        users.forEach((u) => receiverMap.set(u.userId, u));
      }
    }
//ytfuyytu
    const receivers = [...receiverMap.values()];
    console.log(`[Standard Path] Cleaned Unique Receivers Count: ${receivers.length}`);

    if (!receivers.length) {
      return res.send({
        status: "error",
        message: "No users found"
      });
    }
    const broadcastContent = await getNotificationContent('admin_notification_broadcast', {
      title,
      message,
      whatsappVariables: ['name', 'title', 'message'],
    });

    for (const receiver of receivers) {
      await createAndSendNotification(
        receiver.userId,
        receiver.userType,
        notificationImage,
        title,
        message,
        state,
        district,
        city,
        area
      );

      await dispatchWhatsapp(broadcastContent, receiver.mobileNumber, {
        name: receiver.name ?? "",
        title,
        message,
      });
    }
     return res.send({
      status: "success",
      message: `Notification sent to ${receivers.length} users`,
    });
  } catch (error) {
    console.error("NOTIFICATION SYSTEM CRITICAL ERROR:", error);
    return res.send({
      status: "error",
      message: error.message
    });
  }
};

  exports.updateNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.send({ status: "error", message: "Missing field" });
    }

    const result = await notificationModel.updateMany(
      { userId: userId, read: false },
      { $set: { read: true, updatedDate: new Date() } });

    if (result.matchedCount === 0) {
      return res.send({
        status: "error",
        message: "No unread notifications found"
      });
    }

    return res.send({
      status: "success",
      updatedCount: result.modifiedCount,
      message: "Notifications marked as read"
    });

  } catch (error) {
    return res.send({
      status: "error",
      message: `Notification update error ${error.message}`
    });
  }
};


exports.getNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(geo);
    const getAllNotifications = await notificationModel.find({ userId: userId }, { _id: 0 }).sort({ createdDate: -1 });
    // const userType=getAllNotifications[0].userType;
    // const state=getAllNotifications[0].state;
    // const district=getAllNotifications[0].district;
    // const city=getAllNotifications[0].city;
    const getAllNotificationCount = await notificationModel.find({ userId: userId, read: false })
    if (!getAllNotifications || getAllNotifications.length === 0) {
      return res.send({ status: "success", unreadCount: 0, data: [] });
    }
    return res.send({ status: "success", unreadCount: getAllNotificationCount?.length ?? 0, data: getAllNotifications })
  }
  catch (error) {
    return res.send({ status: "error", message: `notification not sent error${error.message}` })
  }
}


exports.getstates=async (req, res) => {
  try{
  //const states = await Location.find({state:1})
 const state = await LocationModel.distinct("state");
 const States = state.sort((a, b) => a.localeCompare(b));
 //return sortedStates;
 console.log("States array:", state);
 console.log("Total states:", States.length);
  //distinct("state");
  res.json(States);
  }
  catch (error) {
    return res.send({ status: "error", message: `data not found error${error.message}` })
  }
};

// Get districts by state
//  exports.getdistrict = async (req, res) => {
//   try {
//     const stateName = req.params.state.trim();
//     console.log("Requested state:", stateName);

//     const districts = await LocationModel.distinct("district", {
//       state: { $regex: `^${stateName}$`, $options: "i" }
//     });

//     console.log("Districts:", districts);

//     res.json(districts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", message: err.message });
//   }
// };
exports.getdistrict = async (req, res) => {
  try {
    let { state } = req.body;

    if (!Array.isArray(state)) {
      state = [state];
    }

    const regex = state.map(
      s => new RegExp(`^${s.trim()}$`, "i")
    );

    const districts = await LocationModel.distinct("district", {
      state: { $in: regex }
    });

    return res.json({
      districts,
    });

  } catch (error) {
    return res.send({
      status: "error",
      message: error.message,
    });
  }
};

exports.getsubdistricts = async (req, res) => {
  try {
    let { district } = req.body;

    if (!Array.isArray(district)) {
      district = [district];
    }

    const regex = district.map(
      d => new RegExp(`^${d.trim()}$`, "i")
    );

    const subDistricts = await LocationModel.distinct("subDistrict", {
      district: { $in: regex }
    });

    return res.json({subDistricts,
    });

  } catch (error) {
    return res.send({
      status: "error",
      message: error.message,
    });
  }
};

exports.getvillages = async (req, res) => {
  try {
    let { subDistrict } = req.body;

    if (!Array.isArray(subDistrict)) {
      subDistrict = [subDistrict];
    }

    const regex = subDistrict.map(
      s => new RegExp(`^${s.trim()}$`, "i")
    );

    const villages = await LocationModel.distinct("village", {
      subDistrict: { $in: regex }
    });

    return res.json({ villages,
    });

  } catch (error) {
    return res.send({
      status: "error",
      message: error.message,
    });
  }
};