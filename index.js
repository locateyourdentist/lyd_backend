// const express=require('express');
// const app=express();
// require('dotenv').config()
// const user=require('./routes/user')
// const services=require('./routes/user_service')
// const jobs=require('./routes/job_webinar')
// const notification=require('./routes/notification_routes')
// const plans=require('./routes/plan_routes')
// const contacts=require('./routes/contact_form_routes')
// // const logger=require('./utills/error_logger/error_log')
// const responseLogger = require("./middleware/response_logger");
// const cors = require('cors');




// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const connectDB=require('./db_config')
// connectDB();
// app.use(responseLogger);
// app.use(cors({
//   origin: '*',
// }));

// app.use('/lyd/user',user);
// app.use('/lyd/services',services)
// app.use('/lyd/jobs',jobs)
// app.use('/lyd/notifications',notification)
// app.use('/lyd/plans',plans)
// app.use('/lyd/contacts',contacts)

// app.use('/ProfilePictures',express.static('ProfilePictures'))
// app.use('/certificates',express.static('certificates'))
// app.use('/webinarImage',express.static('webinarImage'))
// app.use('/serviceImage',express.static('serviceImage'))
// app.use('/jobImage',express.static('jobImage'))
// app.use('/logo',express.static('logo'))
// app.use('/posterImages',express.static('posterImages'))
// app.use('/notificationImage',express.static('notificationImage'))


// //const port=process.env.PORT||3000;
// // app.listen(port,(error)=>{
// //     if(error){
// //      console.log(`server not connected ${port} ${error}`)
// //     }
// //     else{
// //     console.log(`server connected on port ${port} suceessfully`)
// //     }
// // })


// app.listen(process.env.PORT || 3000,'0.0.0.0',()=>{
//  console.log("Server running");
// })


const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const connectDB = require('./db_config');

const responseLogger = require("./middleware/response_logger");

const user = require('./routes/user');
const services = require('./routes/user_service');
const jobs = require('./routes/job_webinar');
const notification = require('./routes/notification_routes');
const plans = require('./routes/plan_routes');
const contacts = require('./routes/contact_form_routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
}));

//app.use(responseLogger);

app.use('/lyd/user', user);
app.use('/lyd/services', services);
app.use('/lyd/jobs', jobs);
app.use('/lyd/notifications', notification);
app.use('/lyd/plans', plans);
app.use('/lyd/contacts', contacts);

app.use('/ProfilePictures', express.static('ProfilePictures'));
app.use('/certificates', express.static('certificates'));
app.use('/webinarImage', express.static('webinarImage'));
app.use('/serviceImage', express.static('serviceImage'));
app.use('/jobImage', express.static('jobImage'));
app.use('/logo', express.static('logo'));
app.use('/posterImages', express.static('posterImages'));
app.use('/notificationImage', express.static('notificationImage'));


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
      console.log("Server running and MongoDB connected");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });