require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  const con = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${con.connection.host}`);
};

const disconnectDB = async () =>{
    const discon =   await mongoose.connection.close();
    console.log("Database Connection Ended")
}

module.exports = {connectDB,disconnectDB};