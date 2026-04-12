"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export function Topbar() {
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


    </header>
  );
}
