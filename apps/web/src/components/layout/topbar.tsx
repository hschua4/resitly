"use client";

import { Moon, Sun, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="flex h-14 items-center justify-between px-4 md:px-5"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
      }}
    >
      <SidebarTrigger className="mr-2 hidden md:flex" />

      {/* Mobile brand */}
      <span
        className="text-[15px] md:hidden"
        style={{
          color: "var(--sidebar-primary)",
          fontWeight: 590,
          letterSpacing: "-0.165px",
        }}
      >
        Resitly
      </span>

      {/* Upload CTA */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          asChild
          size="sm"
          className="text-xs h-8 px-3"
          style={{
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 510,
            borderRadius: "6px",
            border: "none",
          }}
        >
          <Link href="/app/invoices/upload">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Upload Invoice
          </Link>
        </Button>
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md ml-auto"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "var(--muted-foreground)",
        }}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </header>
  );
}
