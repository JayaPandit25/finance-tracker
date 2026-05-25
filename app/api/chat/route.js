import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import Goal from "@/models/Goal";
import Budget from "@/models/Budget";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Authenticate Request
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // 2. Fetch User Financial Data
    const [expenses, incomes, goals, budget] = await Promise.all([
      Expense.find({ userId }).sort({ createdAt: -1 }),
      Income.find({ userId }).sort({ createdAt: -1 }),
      Goal.find({ userId }).sort({ createdAt: -1 }),
      Budget.findOne({ userId }),
    ]);

    // 3. Process Data for Context
    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const netBalance = totalIncome - totalExpense;
    const budgetLimit = budget ? budget.limit : 0;
    
    // Categorize expenses
    const expenseCategories = {};
    expenses.forEach(e => {
      const cat = e.category || "Uncategorized";
      expenseCategories[cat] = (expenseCategories[cat] || 0) + e.amount;
    });

    // Format Income context
    const incomeSummary = incomes.slice(0, 10).map(inc => 
      `- Source: ${inc.source}, Amount: INR ${inc.amount}, Category: ${inc.category || "General"}, Date: ${new Date(inc.createdAt).toLocaleDateString()}`
    ).join("\n");

    // Format Expense context
    const expenseSummary = expenses.slice(0, 15).map(exp => 
      `- Title: ${exp.title}, Amount: INR ${exp.amount}, Category: ${exp.category || "General"}, Note: ${exp.note || "None"}, Date: ${new Date(exp.createdAt).toLocaleDateString()}`
    ).join("\n");

    // Format Goals context
    const goalsSummary = goals.map(g => {
      const progress = g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(1) : 0;
      const targetDateStr = g.targetDate ? new Date(g.targetDate).toLocaleDateString() : "No deadline";
      return `- Goal: "${g.title}", Target: INR ${g.targetAmount}, Current: INR ${g.currentAmount} (${progress}% achieved), Target Date: ${targetDateStr}, Category: ${g.category}`;
    }).join("\n");

    // Construct the context block
    const financialContext = `
USER FINANCIAL DATA PROFILE:
- Total Income: INR ${totalIncome}
- Total Expenses: INR ${totalExpense}
- Net Balance: INR ${netBalance}
- Budget Limit: ${budgetLimit > 0 ? `INR ${budgetLimit}` : "No budget limit set"}
- Budget Status: ${budgetLimit > 0 ? (totalExpense > budgetLimit ? "EXCEEDED BUDGET" : "Within budget limit") : "N/A"}

EXPENSES BY CATEGORY:
${Object.entries(expenseCategories).map(([cat, amt]) => `- ${cat}: INR ${amt}`).join("\n") || "No expenses recorded"}

RECENT INCOME ENTRIES (Up to 10):
${incomeSummary || "No income entries recorded"}

RECENT EXPENSE ENTRIES (Up to 15):
${expenseSummary || "No expense entries recorded"}

SAVINGS GOALS:
${goalsSummary || "No savings goals recorded"}
`;

    // 4. Retrieve User Messages
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Invalid messages payload" },
        { status: 400 }
      );
    }

    // 5. Check Groq API Key
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || groqApiKey === "your_groq_api_key_here") {
      return NextResponse.json({
        success: true,
        isDemo: true,
        message: "Hello! I am FinanceFlow AI, your financial assistant. Currently, the Groq API key is not configured in the application environment (.env.local).\n\nPlease ask your administrator to configure a valid GROQ_API_KEY so I can analyze your financial data and answer your custom questions."
      });
    }

    // 6. Define System Prompt
    const systemPrompt = `You are "FinanceFlow AI", a highly professional, expert personal finance advisor and assistant built into the FinanceFlow Personal Budget Tracker application.
Your role is to help the user analyze their financial state, understand their budget, plan their savings, track their goals, and answer general finance or investment questions.

Here is the current, real-time financial profile of the user based on their dashboard data:
===================================
${financialContext}
===================================

Use this data to provide hyper-personalized responses. For example, if they ask if they can afford something, look at their Net Balance, monthly income, and current budget. If they ask where their money is going, analyze the EXPENSES BY CATEGORY list. If they ask about saving, look at their savings rate and goals.

CRITICAL RULE FOR ALL RESPONSES:
- NEVER use emojis in your responses under any circumstance.
- Use clean, structured markdown formatting, such as bold headers, bullet lists, tables, and numbered lists to make the information readable.
- If you quote numbers, format them clearly (e.g. INR 5,000 or ₹5,000).
- Be constructive, encouraging, and clear.
- Keep your answers concise yet comprehensive.
`;

    // 7. Make API request to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.6,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API Error Response:", errText);
      return NextResponse.json(
        { success: false, message: "Groq API returned an error: " + response.statusText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      message: assistantMessage
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred: " + error.message },
      { status: 500 }
    );
  }
}
