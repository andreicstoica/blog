"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useCallback } from "react";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "blog",
  },
  "https://andreisthoughts.substack.com/": {
    name: "substack",
  },
  "https://www.linkedin.com/in/andrei-c-stoica/": {
    name: "linkedin",
  },
  "https://x.com/andreistoica_": {
    name: "twitter",
  },
};

export function Navbar() {
  const handleThemeToggle = useCallback(() => {
    document.body.classList.add("animation-ready");
    setTimeout(() => {
      document.body.classList.remove("animation-ready");
    }, 1700);
  }, []);

  return (
    <nav className="flex flex-row w-full items-center justify-between py-6" id="nav">
      <div className="flex flex-row flex-1 gap-6 text-neutral-500 dark:text-neutral-400">
        {Object.entries(navItems).map(([path, { name }]) => (
          <Link
            key={path}
            href={path}
            className="hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="flex items-center">
        <ThemeToggle onToggle={handleThemeToggle} />
      </div>
    </nav>
  );
}
