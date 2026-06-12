const ContactRequest = require("../model/contact_model");
const userModel = require('../model/user')
const { uploadToS3 ,deleteFromS3 } = require("../file_uploadImage");
const{mongoose}=require('mongoose')
const contactStateWise=require('../model/add_contact_state_wise_model')
const publicContactModel=require('../model/public_contact_form_model')
const privacyPolicyModel=require('../model/privacyPolicy_model')

exports.createContactRequest = async (req, res) => {
  try {
    const {
      senderUserId,
      receiverUserId,
      doctorName,
      clinicName,
      materialDescription,
      email,
      mobileNumber,
      state,
      district,userType,
      city,
    } = req.body;

    if (
      !senderUserId ||
      !receiverUserId ||
      !doctorName ||
      !clinicName ||
      !materialDescription
    ) {
      return res.send({
        status: "error",
        message: "Missing required fields",
      });
    }
    let uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await uploadToS3(file);
        uploadedUrls.push(uploadedUrl);
      }
    }
    //const contactImage = req.file? `contactImage/${req.file.filename}`: "";

    const contact = new ContactRequest({
      senderUserId,
      receiverUserId,
      Name:doctorName,
      clinicName,
      userType,
      materialDescription,
      email,
      mobileNumber,
      clinicAddress: {
        state,
        district,
        city,
      },
      contactImage:uploadedUrls,
    });

    const savedContact = await contact.save();

    res.json({
      status: "success",
      message: "Contact request sent successfully",
      data: savedContact,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: error.message,
    });
  }
};
// exports.createContactDetailsStateWise = async (req, res) => {
//   try {
//     const {
//       userId,name,state,whatsapp,email,
//       mobileNumber,
//       district,
//       city,
//     } = req.body;

//     if (
//       !userId ||
//       !name ||
//       !whatsapp ||
//       !email ||
//       !mobileNumber||!state||!district
//     ) {
//       return res.status({
//         status: "error",
//         message: "Missing required fields",
//       });
//     }
//     let uploadedUrls = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const uploadedUrl = await uploadToS3(file);
//         uploadedUrls.push(uploadedUrl);
//       }
//     }
//     //const contactImage = req.file? `contactImage/${req.file.filename}`: "";

//     const contact = new contactStateWise({userId,name,state,whatsapp,email,
//       mobileNumber,
//       district, city,    });

//     const savedContact = await contact.save();

//     res.send({
//       status: "success",
//       message: "Contact details saved successfully",
//       data: savedContact,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
exports.createContactDetailsStateWise = async (req, res) => {
  try {
    const { userId, details } = req.body;

    if (!userId || !details || !Array.isArray(details) || details.length === 0) {
      return res.send({ status: "error", message: "userId and details array required" });
    }

     const updated = await contactStateWise.findOneAndUpdate(
      { userId },
      { $set: { details: details } }, 
      { upsert: true, new: true }
    );

    res.send({
      status: "success",
      message: "Contacts saved successfully",
      data: updated,
    });
   } catch (err) {
    res.send({ status: "error", message: err.message });
  }
};
// exports.createContactDetailsStateWise = async (req, res) => {
//   try {
//     const { userId, details } = req.body;

//     if (!userId || !details || !Array.isArray(details) || details.length === 0) {
//       return res.send({ status: "error", message: "userId and details array required" });
//     }

//      const updated = await contactStateWise.findOneAndUpdate(
//       { userId },
//       { $set: { details: details } }, 
//       { upsert: true, new: true }
//     );
//    let detailsObj = {};
//   if (details) {
//   if (typeof details === "string") {
//     try {
//       detailsObj = JSON.parse(details);
//     } catch {
//       detailsObj = { text: details }; 
//     }
//   } else {
//     detailsObj = details;
//   }
//     }
    
//     res.send({
//       status: "success",
//       message: "Contacts saved successfully",
//       data: updated,
//     });
//    } catch (err) {
//     res.send({ status: "error", message: err.message });
//   }
// };
// Get all contact details
exports.getAllContactDetails = async (req, res) => {
  try {
     //   const { userId } = req.body;
    const allContacts = await contactStateWise.find({}); 
    if (!allContacts || allContacts.length === 0) {
      return res.send({ status: "error", message: "No contact details found" });
    }

    res.send({
      status: "success",
      data: allContacts,
    });
  } catch (err) {
    res.send({ status: "error", message: err.message });
  }
};

exports.gettextEditorContentForAll = async (req, res) => {
  try {
       const { category } = req.body;
    const allContacts = await privacyPolicyModel.find({category:category}); 
    if (!allContacts || allContacts.length === 0) {
      return res.send({ status: "error", message: "No content found" });
    }

    res.send({status: "success",data: allContacts});

  } catch (err) {
    res.send({ status: "error", message: err.message });
  }
};
//  exports.filterContacts = async (req, res) => {
//   try {
//     const {
//       receiverUserId,
//       senderUserId,
//       state,
//       district,
//       city,
//       status,
//       search,
//       page = 1,
//       limit = 10,
//     } = req.body;

//     let filter = {};

//     if (receiverUserId) filter.receiverUserId = receiverUserId;
//     if (senderUserId) filter.senderUserId = senderUserId;

//     if (state) filter["clinicAddress.state"] = state;
//     if (district) filter["clinicAddress.district"] = district;
//     if (city) filter["clinicAddress.city"] = city;

//     if (status) filter.status = status;
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { clinicName: { $regex: search, $options: "i" } },
//         { mobileNumber: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const skip = (page - 1) * limit;

//     const [data, total] = await Promise.all([
//       ContactRequest.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//       ContactRequest.countDocuments(filter),
//     ]);

//     return res.json({
//       status: "success",
//       page: Number(page),
//       limit: Number(limit),
//       total,
//       data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
exports.filterContacts = async (req, res) => {
  try {
    const {
      receiverUserId,
      senderUserId,
      state,
      district,
      city,
      status,
      search,
      fromDate,  
      toDate,    
      page = 1,
      limit = 10,
    } = req.body;

    let filter = {};

    // 🔹 User filters
    if (receiverUserId) filter.receiverUserId = receiverUserId;
    if (senderUserId) filter.senderUserId = senderUserId;

    // 🔹 Address filters
    //if (state) filter["clinicAddress.state"] = state;
   // if (district) filter["clinicAddress.district"] = district;
  //  if (city) filter["clinicAddress.city"] = city;

    // 🔹 Status filter
    if (status) filter.status = status;
  
if (search) {
  const isValidId = mongoose.Types.ObjectId.isValid(search);
      filter.$or = [
        { Name: { $regex: search, $options: "i" } },
        { clinicName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ...(isValidId ? [{ _id: new mongoose.Types.ObjectId(search) }] : []),
  ];
}


    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      ContactRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactRequest.countDocuments(filter),
    ]);

    return res.json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total,
      data,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


exports.getContactsByReceiver = async (req, res) => {
  try {
    const { receiverUserId, fromDate, toDate,userType, search } = req.body;

    const query = { receiverUserId };
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
 if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999); 
        query.createdAt.$lte = endDate;
      }    }
 
    const contacts = await ContactRequest
      .find(query)
      .sort({ createdAt: -1 });
    const user = await userModel.findOne({ userId: receiverUserId });

    let result = contacts.map(contact => ({
      id: contact?._id?.toString(), 
       id: contact?._id?.toString(), 
      userId: contact?.senderUserId || "",
            userType: contact?.userType || "",
            name: contact?.Name || "",
      email: contact?.email || "",
      mobileNumber: contact?.mobileNumber || "",
      orgName: contact?.clinicName || "",
      address: contact?.clinicAddress
        ? `${contact.clinicAddress.state}, ${contact.clinicAddress.district},${contact.clinicAddress.district}`
        : "",
      //userId: user?.userId || "",
      // userType: user?.userType || "",
      // name: user?.details?.name || "",
      // email: user?.email || "",
      // mobileNumber: user?.mobileNumber || "",
      // orgName: user?.name || "",
      // address: user?.address
      //   ? `${user.address.city}, ${user.address.district}`
      //   : "",
      materialDescription: contact?.materialDescription,
      contactImage: contact?.contactImage,
      createdAt: contact?.createdAt
    }));

    if (search && search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      result = result.filter(item =>
        (item.name?.toLowerCase().includes(lowerSearch)) ||
        (item.email?.toLowerCase().includes(lowerSearch)) ||
        (item.mobileNumber?.toLowerCase().includes(lowerSearch)) ||
        (item.orgName?.toLowerCase().includes(lowerSearch))
      );
    }

    res.json({
      status: "Success",
      count: result.length,
      data: result
    });

  } catch (error) {
    res.status({
      status: "error",
      message: error.message
    });
  }
};

exports.getContactsBySender = async (req, res) => {
  try {
    const { senderUserId, fromDate, toDate, search } = req.body;

    const query = { senderUserId };

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999); 
        query.createdAt.$lte = endDate;
      }    }

    const contacts = await ContactRequest
      .find(query)
      .sort({ createdAt: -1 });

    const user = await userModel.findOne({ userId: contacts.receiverUserId });

    let result = contacts.map(contact => ({
      id: contact?._id?.toString(), 
      userId: contact?.receiverUserId || "",
            userType: contact?.userType || "",
            name: contact?.Name || "",
      email: contact?.email || "",
      mobileNumber: contact?.mobileNumber || "",
      orgName: contact?.clinicName || "",
      address: contact?.clinicAddress
        ? `${contact.clinicAddress.state}, ${contact.clinicAddress.district},${contact.clinicAddress.district}`
        : "",
      // name: user?.details?.name || "",
      // email: user?.email || "",
      // mobileNumber: user?.mobileNumber || "",
      // orgName: user?.name || "",
      // address: user?.address
      //   ? `${user.address.city}, ${user.address.district}`
      //   : "",
      materialDescription: contact?.materialDescription,
      contactImage: contact?.contactImage,
      createdAt: contact?.createdAt
    }));

    if (search && search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      result = result.filter(item =>
        (item.name?.toLowerCase().includes(lowerSearch)) ||
        (item.email?.toLowerCase().includes(lowerSearch)) ||
        (item.mobileNumber?.toLowerCase().includes(lowerSearch)) ||
        (item.orgName?.toLowerCase().includes(lowerSearch))
      );
    }

    res.json({
      status: "Success",
      count: result.length,
      data: result
    });

  } catch (error) {
    res.status({
      status: "error",
      message: error.message
    });
  }
};


  
  exports.createPublicContact = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.send({
        status: "error",
        message: "All fields are required",
      });
    }

    const contact = new publicContactModel({
      name,
      email,
      mobile,
      message,
    });

    await contact.save();

    res.send({
      status: "success",
      message: "Contact request submitted successfully",
      data: contact,
    });

  } catch (error) {
    res.send({
      status: "error",
      message: error.message,
    });
  }
};
exports.getPublicContacts = async (req, res) => {
  try {
    const { fromDate, toDate, search } = req.body;

    let filter = {};

    // 📅 Robust Date Filter (Handles empty strings and single dates safely)
    if ((fromDate && fromDate.trim() !== "") || (toDate && toDate.trim() !== "")) {
      filter.createdDate = {};
      
      if (fromDate && fromDate.trim() !== "") {
        filter.createdDate.$gte = new Date(fromDate);
      }
      
      if (toDate && toDate.trim() !== "") {
        // Sets time boundary to the absolute end of the target day
        filter.createdDate.$lte = new Date(toDate + "T23:59:59.999Z");
      }
    }

    // 🔍 Regex Text Search Block
    if (search && search.trim() !== "") {
      const searchRegex = {
        $regex: search.trim(),
        $options: "i",
      };

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
      ];
    }

    // If both parameters are empty, find({}) runs and pulls all items automatically
    const contacts = await publicContactModel
      .find(filter)
      .sort({ createdDate: -1 });

    return res.status(200).send({
      status: "success",
      total: contacts.length,
      data: contacts,
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};
exports.addtextEditorContentPolicy = async (req, res) => {
  try {
    const { category, details } = req.body;

    if (!category || !details) {
      return res.send({
        status: "error",
        message: "category and details are required",
      });
    }

    let parsedDetails = details;

    if (typeof details === "string") {
      try {
        parsedDetails = JSON.parse(details);
      } catch (e) {
        parsedDetails = [{ insert: details }];
      }
    }
console.log("RAW DETAILS:", details);
console.log("PARSED DETAILS:", parsedDetails);
    const updated = await privacyPolicyModel.findOneAndUpdate(
      { category },
      {
        $set: {
          category,
          data: parsedDetails, 
          userId: req.user?.userId,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return res.send({
      status: "success",
      message: "Policy saved successfully",
      data: updated,
    });

  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
    });
  }
};
// exports.addtextEditorContentPolicy = async (req, res) => {
//   try {
//     const { category, details } = req.body;

//     if (!details || !details || details.length === 0) {
//       return res.send({ status: "error", message: "userId and details array required" });
//     }
//   let detailsObj = {};
//   if (details) {
//   if (typeof details === "string") {
//     try {
//       detailsObj = JSON.parse(details);
//     } catch {
//       detailsObj = { text: details }; 
//     }
//   } else {
//     detailsObj = details;
//   }
//     }
//      const updated = await privacyPolicyModel.findOneAndUpdate(
//       { category },
//       { $set: { details: detailsObj, userId:req.user.userId} }, 
//       { upsert: true, new: true }
//     );
   
    
//     res.send({
//       status: "success",
//       message: "Contacts saved successfully",
//       data: updated,
//     });
//    } catch (err) {
//     res.send({ status: "error", message: err.message });
//   }
// };