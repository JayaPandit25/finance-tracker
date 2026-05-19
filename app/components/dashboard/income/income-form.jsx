"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaCircleCheck } from "react-icons/fa6";

export default function IncomeForm({ onSuccess }) {
  const [form, setForm] = useState({
    source: "",
    amount: "",
    category: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.source || !form.amount || !form.category) {
      toast.error("Source, Amount and Category are required");
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
        setForm({ source: "", amount: "", category: "", note: "" });
        toast.success(
          <span className="flex items-center gap-1.5">
            Income added successfully <FaCircleCheck className="text-emerald-500" />
          </span>
        );
        onSuccess?.();
      } else {
        toast.error(data.message || "Failed to add income");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
        placeholder="Category (Salary, Freelance, Gift)"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
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