"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExpenseForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("Title, Amount and Category are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          title: "",
          amount: "",
          category: "",
          note: "",
        });

        onSuccess?.();
      } else {
        alert(data.message || "Failed to add expense");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <Input
        placeholder="Expense Title"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
          })
        }
      />

      <Input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({
            ...form,
            amount: e.target.value,
          })
        }
      />

      <Input
        placeholder="Category (Food, Travel, Rent)"
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value,
          })
        }
      />

      <Input
        placeholder="Note (optional)"
        value={form.note}
        onChange={(e) =>
          setForm({
            ...form,
            note: e.target.value,
          })
        }
      />

      <Button className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </Button>

    </form>
  );
}