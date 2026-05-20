import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");
  const users = await mongoose.connection.db.collection("users").find({}).toArray();
  console.log("Users in DB:", users);
  await mongoose.disconnect();
}

main().catch(console.error);
