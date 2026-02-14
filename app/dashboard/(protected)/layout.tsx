"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isPasskeyVerified, checkSession, isChecking } =
    useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isChecking && (!isAuthenticated || !isPasskeyVerified)) {
      router.replace("/dashboard/login");
    }
  }, [isAuthenticated, isPasskeyVerified, isChecking, router]);

  if (isChecking || !isAuthenticated || !isPasskeyVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-2">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <div className="p-4">{children}</div>;
}
