import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// ======================
// ADD EXPENSE
// ======================
export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. No token provided",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { title, amount, category, note } =
      await req.json();

    if (!title || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and amount are required",
        },
        { status: 400 }
      );
    }

    const expense = await Expense.create({
      userId: decoded.userId,
      title,
      amount,
      category,
      note,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Expense added successfully",
        expense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Expense Error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================
// GET EXPENSES
// ======================
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. No token provided",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const expenses = await Expense.find({
      userId: decoded.userId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        expenses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Expense Error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================
// DELETE EXPENSE
// ======================
export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. No token provided",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense ID required",
        },
        { status: 400 }
      );
    }

    const expense = await Expense.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 }
      );
    }

    await Expense.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Expense deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Expense Error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}