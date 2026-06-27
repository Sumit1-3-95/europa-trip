"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Map, Sparkles, Compass, ListChecks } from "lucide-react";

const tabs = [
  { href: "/today",   label: "Today",   icon: Sun },
  { href: "/journey", label: "Journey", icon: Map },
  { href: "/vibes",   label: "Vibes",   icon: Sparkles },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/lists",   label: "Lists",   icon: ListChecks },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100">
      <div className="flex max-w-[390px] mx-auto pb-safe">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 min-h-[56px]">
              <Icon size={20} strokeWidth={active ? 2 : 1.5}
                className={active ? "text-gray-900" : "text-gray-400"} />
              <span className={`text-[10px] ${active ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
              {active && <span className="w-1 h-1 bg-gray-900 rounded-full absolute bottom-1.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
