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
      <div className="min-h-screen flex items-center justify-center bg-background p-2">
        <div className="size-8 animate-spin border border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
      {children}
    </div>
  );
}
