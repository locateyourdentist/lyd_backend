const express = require("express");
const router = express.Router();
const contactController = require('../controller/contactController');
const {upload} = require("../file_uploadImage"); 
const auth=require('../middleware/auth')

router.post("/postContactDetails", auth,upload.array("contactImage"),contactController.createContactRequest);
router.post("/createPublicContact",contactController.createPublicContact);
router.post("/receiverIdContactLists",auth,contactController.getContactsByReceiver);
router.post( "/senderContactLists",auth, contactController.getContactsBySender);
router.post("/filterContactLists", auth,contactController.filterContacts);
router.post("/contact_details_state_wise",auth,contactController.createContactDetailsStateWise)
router.post("/getAll_contact_details",contactController.getAllContactDetails)
router.post("/addTextEditorContentForAll",auth,contactController.addtextEditorContentPolicy)
router.post("/gettextEditorContentForAll",contactController.gettextEditorContentForAll)
router.post("/get_public_contacts", auth,contactController.getPublicContacts);

module.exports = router;
