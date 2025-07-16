"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

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
  "https://github.com/andreicstoica": {
    name: "github",
  },
};

export function Navbar() {
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
        <ThemeToggle />
      </div>
    </nav>
  );
}
