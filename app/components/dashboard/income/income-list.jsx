"use client";

import { useEffect, useState } from "react";
import IncomeCard from "./income-card";

export default function IncomeList({ refreshKey = 0, onEdit, onDelete }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  async function fetchIncomes() {
    try {
      setLoading(true);

      const res = await fetch("/api/income", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setIncomes(data.incomes || []);
      } else {
        setIncomes([]);
      }
    } catch (err) {
      console.log("Error fetching incomes:", err);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIncomes();
  }, [refreshKey]);

  return (
    <div className="space-y-3">

      {/* LOADING STATE */}
      {loading && (
        <p className="text-muted-foreground">
          Loading incomes...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && incomes.length === 0 && (
        <p className="text-muted-foreground">
          No income added yet
        </p>
      )}

      {/* LIST */}
      {!loading &&
        incomes.map((income) => (
          <IncomeCard
            key={income._id}
            income={income}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}