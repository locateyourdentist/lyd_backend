const mongoose=require('mongoose');
require('dotenv').config()

const connectDB=async()=>{
    try{
    const dbName = process.env.APP_NAME || 'Locate_your_dentist';
    const conn = await mongoose.connect(`${process.env.mongodb_url}${process.env.APP_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
    });
     console.log('database connection created successfully');
    }
    catch(error){
     console.log(`database not connected ${error}`)
     throw error;
    }
}


module.exports=connectDB;