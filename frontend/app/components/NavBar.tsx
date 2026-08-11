import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import HamburgerMenu from "./HamburgerMenu";
import { navLinks } from "../data/navLinks";

export default function NavBar() {
  return (
    <nav className="bg-slate-700 text-white p-3 flex gap-4 items-center dark:bg-slate-900">
          {/* Desktop links: hidden on mobile, shown md and up */}
          <div className="hidden md:flex gap-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  ))}
                </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            {/* Hamburger: shown on mobile, hidden md and up */}
            <div className="md:hidden">
              <HamburgerMenu />
            </div>
          </div>
        </nav>
  );
}