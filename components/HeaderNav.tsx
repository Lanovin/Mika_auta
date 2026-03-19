"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { href: "/", label: "Domů" },
  { href: "/vozy", label: "Nabídka vozů" },
  { href: "/sluzby", label: "Služby" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" }
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
      {mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`transition-colors hover:text-primary ${pathname === item.href ? "text-primary underline underline-offset-4" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
