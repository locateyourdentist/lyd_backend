// exports.getAllUserDetails = async (req, res) => {
// try {
// const filters = req.body.filters || {};
// let query = { isActive: true };
// const search = req.body.search?.trim() || "";

// if (search !== "") {
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

// if (filters.state) query["address.state"] = filters.state;
// if (filters.district) query["address.district"] = filters.district;
// if (filters.city) query["address.city"] = filters.city;
// if (filters.userType) {
//   query["userType"] = { $regex: `^${filters.userType.trim()}$`, $options: "i" };
// }

// const user = await userModel.find(query).sort({ _id: -1 });
// if (!user.length) return res.send({ status: "error", message: "No data found" });
// return res.json({ status: "Success", total: user.length, data: user });  this way i get filter results now i add   one more filter {
//     "status": "Success",
//     "data": {
//         "_id": "69268161db09c85917210ad0",
//         "userId": "LYD43",
//         "name": "yoga",
//         "userType": "Job Seekers",
//         "password": "$2b$10$4CYCCO.J04ZUM8f7D4txheyYsv15zFNmKr5LFgcrm0bvMiEeuXG1i",
//         "address": {
//             "state": "tamilnadu ",
//             "district": "chennai ",
//             "city": "chennai ",
//             "pincode": "600056",
//             "address": "kattupakkam "
//         },
//         "details": {
//             "name": "",
//             "description": "3 years of experience in both technologies.able to handle project independently ",
//             "services": "",
//             "website": "",
//             "plan":{
//                 "isActive":true,
//                 "addOns":{
//                     "state":true,
//                     "district":true,
//                     "city":true,
//                 }
//             }
//             "collegeDetails": {
//                 "ugDegree": {
//                     "name": "ps engineering college ",
//                     "degree": "B.E",
//                     "percentage": "70"
//                 },
//                 "pgDegree": {
//                     "name": "anna university chennai ",
//                     "degree": "M.E",
//                     "percentage": "75"
//                 }
//             },
//             "experienceDetails": [
//                 {
//                     "companyName": "kst infotech private limited ",
//                     "experience": "3",
//                     "jobDescription": "software developer "
//                 },
//                 {
//                     "companyName": "catchy technologies ",
//                     "experience": "1",
//                     "jobDescription": "senior developer "
//                 }
//             ]
//         },
//         "mobileNumber": "9838388588",
//         "email": "yoga@gmail.com",
//         "image": [
//             "ProfilePictures\\LYD43_1764238935964.jpg",
//             "ProfilePictures\\LYD43_1764241515896.jpg",
//             "ProfilePictures\\LYD43_1764305698711.jpg",
//             "ProfilePictures\\LYD43_1764306132390.jpg",
//             "ProfilePictures\\LYD43_1764306545253.jpg",
//             "ProfilePictures\\LYD43_1764324071585.jpg"
//         ],
//         "certificates": [
//             "Certificates\\1764131169836_1764131169836.jpg",
//             "Certificates\\LYD43_1764238936076",
//             "Certificates\\LYD43_1764241515933"
//         ],
//         "isAdmin": [],
//         "isActive": true,
//         "createdDate": "2025-11-26T04:16:02.671Z",
//         "updatedDate": "2025-11-28T10:22:42.415Z",
//         "__v": 0,
//         "dob": "1-9-1992"
//     }
// }

exports.getAllUserDetails = async (req, res) => {
  try {
    const filters = req.body.filters || {};
    const search = req.body.search?.trim() || "";

    let matchStage = { isActive: true };

    // Basic search
    if (search !== "") {
      const regex = { $regex: search, $options: "i" };
      matchStage["$or"] = [
        { userId: regex },
        { name: regex },
        { userType: regex },
        { mobileNumber: regex },
        { email: regex },
        { "address.state": regex },
        { "address.district": regex },
        { "address.city": regex },
        { "details.name": regex },
      ];
    }

    // Filters
    if (filters.state) matchStage["address.state"] = filters.state;
    if (filters.district) matchStage["address.district"] = filters.district;
    if (filters.city) matchStage["address.city"] = filters.city;
    if (filters.userType) {
      matchStage["userType"] = { $regex: `^${filters.userType.trim()}$`, $options: "i" };
    }

    const users = await userModel.aggregate([
      { $match: matchStage },

      // Add priority field based on plan.addOns
      {
        $addFields: {
          planPriority: {
            $switch: {
              branches: [
                { 
                  case: { $and: [ { $eq: ["$details.plan.isActive", true] }, { $eq: ["$details.plan.addOns.state", true] } ] },
                  then: 1 
                },
                { 
                  case: { $and: [ { $eq: ["$details.plan.isActive", true] }, { $eq: ["$details.plan.addOns.state", false] }, { $eq: ["$details.plan.addOns.district", true] } ] },
                  then: 2 
                },
                { 
                  case: { $and: [ { $eq: ["$details.plan.isActive", true] }, { $eq: ["$details.plan.addOns.state", false] }, { $eq: ["$details.plan.addOns.district", false] }, { $eq: ["$details.plan.addOns.city", true] } ] },
                  then: 3 
                },
                { 
                  case: { $and: [ { $eq: ["$details.plan.isActive", true] }, { $eq: ["$details.plan.addOns.state", false] }, { $eq: ["$details.plan.addOns.district", false] }, { $eq: ["$details.plan.addOns.city", false] }, { $eq: ["$details.plan.addOns.area", true] } ] },
                  then: 4 
                },
              ],
              default: 5
            }
          }
        }
      },

      // Sort by priority first, then _id descending
      { $sort: { planPriority: 1, _id: -1 } }
    ]);

    if (!users.length) return res.send({ status: "error", message: "No data found" });

    return res.json({ status: "Success", total: users.length, data: users });
    
  } catch (error) {
    console.error(error);
    return res.send({ status: "error", message: "Internal Server Error", error: error.message });
  }
};
