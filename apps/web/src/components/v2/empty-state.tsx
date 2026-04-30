"use client";

import type { ReactNode } from "react";
import { Bracket, RK } from "./kit";

export function EmptyState({
  kicker,
  title,
  description,
  ctaLabel,
  icon,
}: {
  kicker?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "80px 24px",
        textAlign: "center",
        minHeight: "calc(100dvh - 48px)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          border: `1.5px dashed ${RK.rule}`,
          background: RK.paper2,
          display: "grid",
          placeItems: "center",
          color: RK.ink3,
          borderRadius: 6,
        }}
      >
        {icon}
      </div>
      {kicker && (
        <div
          style={{
            fontFamily: RK.mono,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            color: RK.ink3,
          }}
        >
          {kicker}
        </div>
      )}
      <div
        style={{
          fontFamily: RK.sans,
          fontSize: 22,
          fontWeight: 500,
          color: RK.ink,
          marginTop: -8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: RK.sans,
          fontSize: 13,
          color: RK.ink2,
          maxWidth: 420,
          lineHeight: 1.55,
        }}
      >
        {description}
      </div>
      {ctaLabel && (
        <div style={{ marginTop: 8 }}>
          <Bracket disabled accent>
            {ctaLabel}
          </Bracket>
          <div
            style={{
              fontFamily: RK.mono,
              fontSize: 9.5,
              color: RK.ink3,
              marginTop: 8,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            coming soon
          </div>
        </div>
      )}
    </div>
  );
}
