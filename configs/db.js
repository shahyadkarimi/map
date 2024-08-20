const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log(mongoose.connections[0]);
      return true;
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("connect success");
    }
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
