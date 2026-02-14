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
    <div className="space-y-6">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Session Management
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Your admin session is valid for 10 days. You can refresh it manually
          here to extend your access without logging in again.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={handleRefreshSession}
            disabled={isRefreshing}
            className="bg-white text-black hover:bg-gray-200"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
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
