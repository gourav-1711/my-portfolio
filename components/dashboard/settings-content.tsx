"use client";

import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

export default function SettingsContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          "Session refreshed successfully. You stay logged in for 10 more days.",
        );
      } else {
        toast.error("Failed to refresh session. Please log in again.");
      }
    } catch (error) {
      toast.error("An error occurred while refreshing the session.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/dashboard/login");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground">
          Session Management
        </h2>
        <p className="mb-6 max-w-2xl text-muted-foreground">
          Your admin session is valid for 10 days. You can refresh it manually
          here to extend your access without logging in again.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={handleRefreshSession}
            disabled={isRefreshing}
            className="editorial-button"
          >
            {isRefreshing ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw data-icon="inline-start" />
                Restore Session Cookie
              </>
            )}
          </Button>

          <Button onClick={handleLogout} variant="destructive">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
