const { mongoose } = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' });

// Connect to MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING) 
    console.log("Connected to database");
  } catch (error) {
    console.log('Database error: ' + error);
  }
}

module.exports = { connectDB }