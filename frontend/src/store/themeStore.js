import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDarkMode: false,

  initTheme: () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      set({ isDarkMode: savedTheme === "dark" });
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  },

  toggleTheme: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", nextMode);
      return { isDarkMode: nextMode };
    }),
}));

export default useThemeStore;
