import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  const usersCount = await mongoose.connection.db.collection("users").countDocuments();
  console.log("Total users:", usersCount);

  const incomes = await mongoose.connection.db.collection("incomes").find({}).toArray();
  console.log("Total income entries:", incomes.length);
  if (incomes.length > 0) {
    console.log("Income userIds:", [...new Set(incomes.map(i => i.userId.toString()))]);
  }

  const expenses = await mongoose.connection.db.collection("expenses").find({}).toArray();
  console.log("Total expense entries:", expenses.length);
  if (expenses.length > 0) {
    console.log("Expense userIds:", [...new Set(expenses.map(e => e.userId.toString()))]);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
