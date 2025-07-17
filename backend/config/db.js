import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(
      `Mongodb has been connected to ${conn.connection.host}`.cyan.underline
    );
  } catch (error) {
    throw new Error(error);
    process.exit(1);
  }
};

export default connectDB;
