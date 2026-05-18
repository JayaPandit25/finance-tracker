"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IncomeCard({ income, onDelete, onEdit }) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4">

        <div>
          <h3 className="font-semibold">{income.source}</h3>
          {income.note && (
            <p className="text-xs text-muted-foreground">
              {income.note}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-green-600 font-bold">
            ₹{income.amount}
          </p>

          <Button size="sm" variant="outline" onClick={() => onEdit(income)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(income._id)}
          >
            Delete
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}