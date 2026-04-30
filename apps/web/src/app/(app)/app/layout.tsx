import type { CSSProperties } from "react";
import { App2Sidebar } from "@/components/v2/app2-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function App2Layout({ children }: { children: React.ReactNode }) {
  const rkSidebarVars: CSSProperties & Record<string, string> = {
    "--sidebar": "var(--rk-paper2)",
    "--sidebar-foreground": "var(--rk-ink)",
    "--sidebar-primary": "var(--rk-accent)",
    "--sidebar-primary-foreground": "var(--rk-paper)",
    "--sidebar-accent": "var(--rk-hi)",
    "--sidebar-accent-foreground": "var(--rk-ink)",
    "--sidebar-border": "var(--rk-rule)",
    "--sidebar-ring": "var(--rk-accent)",
    "--background": "var(--rk-paper)",
    "--foreground": "var(--rk-ink)",
    "--border": "var(--rk-rule)",
  };

  return (
    <div style={rkSidebarVars}>
      <SidebarProvider>
        <App2Sidebar />
        <SidebarInset
          style={{
            background: "var(--rk-paper)",
            color: "var(--rk-ink)",
          }}
        >
          <header
            className="flex h-12 shrink-0 items-center gap-2 px-3"
            style={{ borderBottom: "1px solid var(--rk-rule)" }}
          >
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
