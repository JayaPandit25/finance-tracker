import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// ======================
// GET SAVINGS GOALS
// ======================
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

    const goals = await Goal.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, goals }, { status: 200 });
  } catch (error) {
    console.error("GET Goals Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ======================
// CREATE SAVINGS GOAL
// ======================
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

    const { title, targetAmount, currentAmount, targetDate, category } = await req.json();

    if (!title || !targetAmount) {
      return NextResponse.json(
        { success: false, message: "Title and Target Amount are required" },
        { status: 400 }
      );
    }

    const goal = await Goal.create({
      userId: decoded.userId,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate: targetDate ? new Date(targetDate) : undefined,
      category: category || "General",
    });

    return NextResponse.json(
      { success: true, message: "Savings goal created successfully", goal },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Goal Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ======================
// UPDATE/DEPOSIT TO GOAL
// ======================
export async function PATCH(req) {
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

    const { id, depositAmount } = await req.json();

    if (!id || depositAmount === undefined || Number(depositAmount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Goal ID and positive deposit amount are required" },
        { status: 400 }
      );
    }

    const goal = await Goal.findOne({ _id: id, userId: decoded.userId });

    if (!goal) {
      return NextResponse.json(
        { success: false, message: "Savings goal not found" },
        { status: 404 }
      );
    }

    goal.currentAmount += Number(depositAmount);
    await goal.save();

    return NextResponse.json(
      { success: true, message: "Deposit added successfully", goal },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Goal Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ======================
// DELETE SAVINGS GOAL
// ======================
export async function DELETE(req) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Goal ID required" },
        { status: 400 }
      );
    }

    const goal = await Goal.findOne({ _id: id, userId: decoded.userId });

    if (!goal) {
      return NextResponse.json(
        { success: false, message: "Savings goal not found" },
        { status: 404 }
      );
    }

    await Goal.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Savings goal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Goal Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
