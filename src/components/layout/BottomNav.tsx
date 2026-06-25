"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Camera, Compass, CheckSquare } from "lucide-react";

const tabs = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/journey", label: "Journey", icon: Map },
  { href: "/vibes", label: "Vibes", icon: Camera },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/lists", label: "Lists", icon: CheckSquare },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-pb">
      <div className="flex max-w-[390px] mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2 : 1.5}
                className={active ? "text-gray-900" : "text-gray-400"}
              />
              <span
                className={`text-[10px] tracking-wide ${
                  active ? "text-gray-900 font-medium" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
