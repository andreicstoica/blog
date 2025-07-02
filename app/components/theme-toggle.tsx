"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeToggleProps = {
  onToggle?: () => void;
};

export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (onToggle) onToggle();
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="text-neutral-500 dark:text-neutral-400 hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
