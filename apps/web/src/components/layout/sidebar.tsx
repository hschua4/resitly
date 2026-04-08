"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Upload,
  Download,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",  href: "/app/dashboard",       icon: LayoutDashboard },
  { label: "Invoices",   href: "/app/invoices",         icon: Receipt },
  { label: "Upload",     href: "/app/invoices/upload",  icon: Upload },
  { label: "Export",     href: "/app/export",           icon: Download },
  { label: "Settings",   href: "/app/settings",         icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <span className="text-base font-bold text-sidebar-primary">Resitly</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map((item) => {
          const Icon    = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50">Resitly v1.0</p>
      </div>
    </aside>
  );
}
