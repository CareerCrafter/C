import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const url = process.env.MONGODB_URI;

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("database connected successfully....");
  } catch (error) {
    console.log("database connection failed...");
    console.log(error.message);
  }
};

export default dbConnect;
