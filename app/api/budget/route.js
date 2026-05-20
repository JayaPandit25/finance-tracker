import connectDB from "@/lib/mongodb";
import Budget from "@/models/Budget";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let budget = await Budget.findOne({ userId: decoded.userId });
    if (!budget) {
      // Return 0 if not set yet
      budget = { limit: 0 };
    }

    return NextResponse.json({ success: true, budget }, { status: 200 });
  } catch (error) {
    console.error("GET Budget Error:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { limit } = await req.json();

    if (limit === undefined || limit < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid budget limit" },
        { status: 400 }
      );
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: decoded.userId },
      { limit },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Budget updated successfully", budget },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST Budget Error:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
