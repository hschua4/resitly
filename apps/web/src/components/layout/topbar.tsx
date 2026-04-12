"use client";

import { Upload } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

function usePageTitle(pathname: string): string {
  if (pathname === "/app/dashboard") return "Dashboard";
  if (pathname === "/app/upload") return "Upload Invoice";
  if (pathname.match(/^\/app\/invoices\/[^/]+\/processing$/)) return "Processing";
  if (pathname.match(/^\/app\/invoices\/[^/]+$/)) return "Invoice Details";
  if (pathname === "/app/invoices") return "Invoices";
  if (pathname === "/app/export") return "Export";
  if (pathname === "/app/settings") return "Settings";
  return "Resitly";
}

export function Topbar() {
  const pathname = usePathname();
  const title = usePageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-6"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/app/upload">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload Invoice
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
