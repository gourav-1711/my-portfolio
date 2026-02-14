import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Authentication state
interface AuthState {
  isAuthenticated: boolean;
  isPasskeyVerified: boolean;
  isChecking: boolean;
  login: () => void;
  verifyPasskey: () => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isPasskeyVerified: false,
      isChecking: true,
      login: () => set({ isAuthenticated: true }),
      verifyPasskey: () => set({ isPasskeyVerified: true }),
      logout: () => {
        set({ isAuthenticated: false, isPasskeyVerified: false });
        fetch("/api/auth/logout", { method: "POST" });
      },
      checkSession: async () => {
        set({ isChecking: true });
        try {
          const res = await fetch("/api/auth/check");
          if (res.ok) {
            set({ isAuthenticated: true });
          } else {
            set({ isAuthenticated: false, isPasskeyVerified: false });
          }
        } catch (error) {
          set({ isAuthenticated: false, isPasskeyVerified: false });
        } finally {
          set({ isChecking: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isPasskeyVerified: state.isPasskeyVerified,
      }),
    },
  ),
);
