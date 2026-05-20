import connectDB from "../lib/mongodb.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  await connectDB();
  const users = await User.find({});
  console.log("Users in DB:", users);
  mongoose.disconnect();
}

main().catch(console.error);
