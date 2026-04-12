"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Upload,
  Download,
  Settings,
  LogOut,
  ChevronsUpDown,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard",  href: "/app/dashboard",       icon: LayoutDashboard },
  { label: "Invoices",   href: "/app/invoices",         icon: Receipt },
  { label: "Upload",     href: "/app/invoices/upload",  icon: Upload },
  { label: "Export",     href: "/app/export",           icon: Download },
  { label: "Settings",   href: "/app/settings",         icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const userEmail = session?.user?.email ?? "";
  const userName = session?.user?.name ?? "User";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div
                    className="size-8 rounded-full flex items-center justify-center text-[11px] shrink-0"
                    style={{
                      background: "rgba(94,106,210,0.2)",
                      color: "var(--primary)",
                      fontWeight: 590,
                    }}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none min-w-0">
                    <span className="truncate text-[13px]" style={{ fontWeight: 510 }}>
                      {userName}
                    </span>
                    <span
                      className="truncate text-[11px]"
                      style={{ color: "var(--muted-foreground)", fontWeight: 400 }}
                    >
                      {userEmail}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-popper-anchor-width]"
                style={{
                  background: "var(--card)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <DropdownMenuItem asChild>
                  <Link href="/app/settings" className="text-[13px]" style={{ fontWeight: 510 }}>
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-[13px]"
                  style={{ fontWeight: 510 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun /> : <Moon />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive text-[13px]"
                  style={{ fontWeight: 510 }}
                  onClick={handleSignOut}
                >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
