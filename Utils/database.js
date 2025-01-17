import env from "dotenv";
import mongoose from "mongoose";

env.config();

export const Dbconfig = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Connected to MongoDB...");
    })
    .catch((error) => {
      console.log(`Could not connect to MongoDB... ${error}`);
      process.exit(1);
    });
};
