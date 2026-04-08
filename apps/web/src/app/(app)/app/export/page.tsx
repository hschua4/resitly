"use client";

import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-api";
import { buildQueryString } from "@/lib/utils";

export default function ExportPage() {
  const [dateFrom,   setDateFrom]   = useState("");
  const [dateTo,     setDateTo]     = useState("");
  const [status,     setStatus]     = useState("all");
  const [categoryId, setCategoryId] = useState("all");

  const { data: categories = [] } = useCategories();

  const handleExport = () => {
    const params: Record<string, string> = {};
    if (dateFrom)   params.dateFrom   = dateFrom;
    if (dateTo)     params.dateTo     = dateTo;
    if (status !== "all")     params.status     = status;
    if (categoryId !== "all") params.categoryId = categoryId;

    const qs = buildQueryString(params);
    window.location.href = `/v1/export${qs}`;
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Export</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Download your invoices as a CSV file for use in Excel or accounting software.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export to CSV
          </CardTitle>
          <CardDescription>
            Filter your invoices and download as CSV. Compatible with SQL Accounting,
            AutoCount, QuickBooks, and Excel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dateFrom">From date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateTo">To date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="space-y-1.5">
            <Label>Invoice status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="review">Needs review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="exported">Previously exported</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category filter */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </CardContent>
      </Card>

      {/* Format info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">CSV Column Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
            {[
              "Date",
              "Invoice No",
              "Vendor",
              "Line Description",
              "Category",
              "Qty",
              "Unit Price (RM)",
              "Amount (RM)",
              "Tax Type",
              "Tax Rate (%)",
              "Tax Amount (RM)",
              "Invoice Total (RM)",
              "Currency",
              "Status",
            ].map((col) => (
              <div key={col} className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                {col}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            One row per line item. Invoice fields repeat for each row.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
