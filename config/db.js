const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// Creating an async await function to resolve the promise of
// mongoose.connect NOTE: We also set an object with some parameters
// that allows us to supress some warnings
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
