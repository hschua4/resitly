"use client";

import { useRouter } from "next/navigation";
import { LogOut, Moon, Sun, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Topbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <header
      className="flex h-14 items-center justify-between px-4 md:px-5"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
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

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md"
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

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[11px]"
                style={{
                  background: "rgba(94,106,210,0.2)",
                  color: "var(--primary)",
                  fontWeight: 590,
                }}
              >
                U
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44"
            style={{
              background: "var(--card)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <DropdownMenuItem asChild>
              <Link href="/app/settings" className="text-[13px]" style={{ fontWeight: 510 }}>
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive text-[13px]"
              style={{ fontWeight: 510 }}
              onClick={handleSignOut}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
