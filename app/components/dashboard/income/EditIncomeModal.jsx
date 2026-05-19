"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function EditIncomeModal({ open, onClose, income, onUpdated }) {
  const [form, setForm] = useState({
    source: "",
    amount: "",
    category: "",
    note: "",
  });

  useEffect(() => {
    if (income) {
      setForm({
        source: income.source,
        amount: income.amount,
        category: income.category || income.source || "",
        note: income.note || "",
      });
    }
  }, [income]);

  if (!open) return null;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "/api/income",
        {
          id: income._id,
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <Card className="w-[400px]">
        <CardContent className="space-y-3 p-4">

          <h2 className="text-lg font-bold">Edit Income</h2>

          <Input
            value={form.source}
            onChange={(e) =>
              setForm({ ...form, source: e.target.value })
            }
            placeholder="Source"
          />

          <Input
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            placeholder="Amount"
            type="number"
          />

          <Input
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            placeholder="Category"
          />

          <Input
            value={form.note}
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
            placeholder="Note"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleUpdate}>
              Save
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}