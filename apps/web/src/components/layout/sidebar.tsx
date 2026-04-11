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
    <aside
      className="hidden md:flex w-56 flex-col"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Brand */}
      <div
        className="flex h-14 items-center px-4"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <span
          className="text-[15px] tracking-tight"
          style={{
            color: "var(--sidebar-primary)",
            fontWeight: 590,
            letterSpacing: "-0.165px",
          }}
        >
          Resitly
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors",
                "text-[13px]"
              )}
              style={{
                fontWeight: 510,
                color: isActive
                  ? "var(--sidebar-primary)"
                  : "var(--sidebar-foreground)",
                background: isActive
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--sidebar-foreground)";
                }
              }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <p
          className="text-[11px]"
          style={{ color: "var(--muted-foreground)", fontWeight: 510 }}
        >
          Resitly v1.0
        </p>
      </div>
    </aside>
  );
}
