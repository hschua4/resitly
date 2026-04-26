"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  Upload,
  ArrowRight,
} from "lucide-react";
import {
  useDashboardSummary,
  useSpendByCategory,
  useSpendByMonth,
  useInvoices,
} from "@/hooks/use-api";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMYR, formatDate } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: byCategory = [] } = useSpendByCategory();
  const { data: byMonth = [] } = useSpendByMonth();
  const { data: recentData } = useInvoices({ limit: 5 });

  const recentInvoices = recentData?.data ?? [];

  const thisMonthTotal = parseFloat(summary?.totalSpendThisMonth ?? "0");
  const lastMonthTotal = parseFloat(summary?.totalSpendLastMonth ?? "0");
  const pctChange =
    lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;
  const isUp = pctChange >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your expense overview
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spend This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {formatMYR(summary?.totalSpendThisMonth)}
                </p>
                <p
                  className={`text-xs mt-1 flex items-center gap-1 ${isUp ? "text-red-500" : "text-green-600"}`}
                >
                  {isUp ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(pctChange).toFixed(1)}% vs last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Invoices This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {summary?.invoiceCountThisMonth ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary?.invoiceCountTotal ?? 0} total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg per Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <p className="text-2xl font-bold">
                {formatMYR(summary?.avgPerInvoice)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Spend by Category — Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Spend by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {byCategory.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="total"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {byCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => formatMYR(String(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Spend by Month — Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Monthly Spend (last 12 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byMonth.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={byMonth}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m: string) => m.slice(5)} // "2024-01" → "01"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v: number) => `RM${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value: unknown) => [
                      formatMYR(String(value)),
                      "Total",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent invoices */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Recent Invoices</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/invoices">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
              <Receipt className="h-8 w-8 mx-auto opacity-40" />
              <p>No invoices yet.</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/upload">Upload your first invoice</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentInvoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/app/invoices/${inv.id}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {inv.vendor ?? inv.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(inv.invoiceDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <InvoiceStatusBadge status={inv.status} />
                    <p className="text-sm font-medium">
                      {formatMYR(inv.total)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
