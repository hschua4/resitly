"use client";

import type { ReactNode } from "react";

const DC = {
  bg: "#f0eee9",
  grid: "rgba(0,0,0,0.06)",
  label: "rgba(60,50,40,0.7)",
  title: "rgba(40,30,20,0.85)",
  subtitle: "rgba(60,50,40,0.6)",
};

const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;

export function DesignCanvas({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: DC.bg,
        backgroundImage: gridSvg,
        backgroundSize: "120px 120px",
        padding: "60px 0 120px",
        position: "relative",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {(title || subtitle) && (
        <div style={{ padding: "0 60px 40px" }}>
          {title && (
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: DC.title,
                letterSpacing: -0.4,
                marginBottom: 6,
              }}
            >
              {title}
            </div>
          )}
          {subtitle && <div style={{ fontSize: 16, color: DC.subtitle }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function DCSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 80, position: "relative" }}>
      <div style={{ padding: "0 60px 40px" }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: DC.title,
            letterSpacing: -0.4,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 16, color: DC.subtitle }}>{subtitle}</div>}
      </div>
      <div
        style={{
          display: "flex",
          gap: 48,
          padding: "0 60px",
          alignItems: "flex-start",
          overflowX: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function DCArtboard({
  label,
  width = 1280,
  height = 760,
  children,
}: {
  label: string;
  width?: number;
  height?: number;
  children: ReactNode;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          bottom: "100%",
          left: 0,
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 500,
          color: DC.label,
          padding: "3px 6px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)",
          overflow: "hidden",
          width,
          height,
          background: "#fff",
        }}
      >
        {children}
      </div>
    </div>
  );
}
