"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "../data/navLinks";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="flex flex-col gap-1.5 p-2"
      >
        <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-700 dark:bg-slate-900 rounded shadow-lg flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 hover:bg-slate-600 text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}