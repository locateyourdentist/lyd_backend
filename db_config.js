const mongoose=require('mongoose');
require('dotenv').config()

// Optional: override DNS servers (e.g. DNS_SERVERS=8.8.8.8,1.1.1.1) when the
// local resolver refuses the SRV lookups that mongodb+srv:// URLs need.
if (process.env.DNS_SERVERS) {
  require('dns').setServers(process.env.DNS_SERVERS.split(',').map(s => s.trim()));
}

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