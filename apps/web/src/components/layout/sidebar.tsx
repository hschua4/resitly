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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Dashboard",  href: "/app/dashboard",       icon: LayoutDashboard },
  { label: "Invoices",   href: "/app/invoices",         icon: Receipt },
  { label: "Upload",     href: "/app/invoices/upload",  icon: Upload },
  { label: "Export",     href: "/app/export",           icon: Download },
  { label: "Settings",   href: "/app/settings",         icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-4 py-3">
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        <p
          className="text-[11px]"
          style={{ color: "var(--muted-foreground)", fontWeight: 510 }}
        >
          Resitly v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
