"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa6";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <FaSpinner className="animate-spin text-red-500 text-3xl" />
        <p className="text-muted-foreground text-sm font-semibold">Redirecting to unified sign in...</p>
      </div>
    </div>
  );
}