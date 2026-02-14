import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// App-level state only
interface AppState {
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // User data
  user: Record<string, unknown> | null;
  setUser: (user: Record<string, unknown> | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Loading state
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),

      // User data
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

interface SkillStore {
  selectedCategory: string;
  categories: string[];
  setSelectedCategory: (category: string) => void;
}

export const useSkillStore = create<SkillStore>((set) => ({
  selectedCategory: "All",
  categories: [
    "All",
    "Programming Languages",
    "Core Web",
    "Frontend",
    "Backend",
    "Mobile",
    "Platforms",
    "Tools",
  ],
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
