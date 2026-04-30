"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Inbox,
  Columns3,
  CalendarDays,
  Sparkles,
  Camera,
  Layers,
  Tag,
  PieChart,
  Download,
  FileText,
  Building2,
  CheckSquare,
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
  SidebarGroupLabel,
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
import { RK } from "./kit";

const navGroups: {
  label: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}[] = [
  {
    label: "Inbox",
    items: [
      { label: "Inbox", href: "/app/inbox", icon: Inbox },
      { label: "Pipeline", href: "/app/pipeline", icon: Columns3 },
      { label: "Calendar", href: "/app/calendar", icon: CalendarDays },
      { label: "AI brief", href: "/app/brief", icon: Sparkles },
    ],
  },
  {
    label: "Process",
    items: [
      { label: "Capture", href: "/app/capture", icon: Camera },
      { label: "Bulk", href: "/app/bulk", icon: Layers },
      { label: "SST rules", href: "/app/sst-rules", icon: Tag },
    ],
  },
  {
    label: "Output",
    items: [
      { label: "SST", href: "/app/sst", icon: PieChart },
      { label: "Export", href: "/app/export", icon: Download },
      { label: "Reports", href: "/app/reports", icon: FileText },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Vendors", href: "/app/vendors", icon: Building2 },
      { label: "Approvals", href: "/app/approvals", icon: CheckSquare },
    ],
  },
];

export function App2Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/sign-in");
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
          className="font-semibold"
          style={{
            fontFamily: RK.mono,
            fontSize: 13,
            letterSpacing: 0.5,
            color: RK.ink,
          }}
        >
          resitly
          <span style={{ color: RK.accent }}>.</span>
          <span style={{ color: RK.ink3, marginLeft: 6, fontSize: 10 }}>v2</span>
        </span>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel
              style={{
                fontFamily: RK.mono,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: RK.ink3,
              }}
            >
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        style={{
                          fontFamily: RK.mono,
                          fontSize: 11.5,
                          borderLeft: isActive
                            ? `2px solid ${RK.accent}`
                            : "2px solid transparent",
                          borderRadius: 3,
                        }}
                      >
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
                    className="size-8 flex items-center justify-center text-[11px] font-semibold shrink-0"
                    style={{
                      borderRadius: "50%",
                      background: RK.rule2,
                      border: `1px solid ${RK.rule}`,
                      color: RK.ink2,
                      fontFamily: RK.mono,
                    }}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none min-w-0">
                    <span
                      className="truncate"
                      style={{ fontFamily: RK.mono, fontSize: 12, color: RK.ink }}
                    >
                      {userName}
                    </span>
                    <span
                      className="truncate"
                      style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3 }}
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
              >
                <DropdownMenuItem asChild>
                  <Link href="/app/settings" className="text-[13px]">
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-[13px]"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun /> : <Moon />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive text-[13px]"
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
