"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExpenseList({
  refreshKey = 0,
  onDelete,
}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        setExpenses([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setExpenses(data.expenses || []);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.log("Expense fetch error:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshKey]);

  return (
    <div className="space-y-3">

      {/* Loading */}
      {loading && (
        <p className="text-muted-foreground">
          Loading expenses...
        </p>
      )}

      {/* Empty */}
      {!loading && expenses.length === 0 && (
        <p className="text-muted-foreground">
          No expenses added yet
        </p>
      )}

      {/* Expense List */}
      {!loading &&
        expenses.map((expense) => (
          <Card key={expense._id}>
            <CardContent className="flex justify-between items-center p-4">

              <div>
                <h3 className="font-semibold">
                  {expense.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {expense.category}
                </p>

                {expense.note && (
                  <p className="text-xs text-muted-foreground">
                    {expense.note}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">

                <p className="text-red-500 font-bold">
                  ₹{expense.amount}
                </p>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    onDelete(expense._id)
                  }
                >
                  Delete
                </Button>

              </div>

            </CardContent>
          </Card>
        ))}
    </div>
  );
}