"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IncomeForm({ onSuccess }) {
  const [form, setForm] = useState({
    source: "",
    amount: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.source || !form.amount) {
      alert("Source and Amount are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setForm({ source: "", amount: "", note: "" });
        onSuccess?.();
      } else {
        alert(data.message || "Failed to add income");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <Input
        placeholder="Source (Salary, Freelance)"
        value={form.source}
        onChange={(e) =>
          setForm({ ...form, source: e.target.value })
        }
      />

      <Input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      <Input
        placeholder="Note (optional)"
        value={form.note}
        onChange={(e) =>
          setForm({ ...form, note: e.target.value })
        }
      />

      <Button
        className="w-full"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Income"}
      </Button>

    </form>
  );
}