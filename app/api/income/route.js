import connectDB from "@/lib/mongodb";
import Income from "@/models/Income";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// ======================
// GET INCOME
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

    const incomes = await Income.find({
      userId: decoded.userId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        incomes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Income Error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
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
// ADD INCOME
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

    const { source, amount, category, note } =
      await req.json();

    if (!source || !amount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Source and amount are required",
        },
        { status: 400 }
      );
    }

    const income = await Income.create({
      userId: decoded.userId,
      source,
      amount,
      category: category || "General",
      note,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Income added successfully",
        income,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Income Error:", error);

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
// UPDATE INCOME
// ======================
export async function PUT(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Income ID required",
        },
        { status: 400 }
      );
    }

    const updatedIncome =
      await Income.findOneAndUpdate(
        {
          _id: body.id,
          userId: decoded.userId,
        },
        {
          source: body.source,
          amount: body.amount,
          category: body.category || "General",
          note: body.note,
        },
        {
          new: true,
        }
      );

    if (!updatedIncome) {
      return NextResponse.json(
        {
          success: false,
          message: "Income not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        income: updatedIncome,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Income Error:", error);

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
// DELETE INCOME
// ======================
export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
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
          message: "Income ID required",
        },
        { status: 400 }
      );
    }

    const income = await Income.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!income) {
      return NextResponse.json(
        {
          success: false,
          message: "Income not found",
        },
        { status: 404 }
      );
    }

    await Income.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Income deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Income Error:", error);

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