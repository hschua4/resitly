"use client";

import {
  AppChrome,
  Bracket,
  Field,
  H,
  Legend,
  Meter,
  Pill,
  Pin,
  ReceiptScan,
  RK,
  Shell,
  type Density,
  type Tone,
} from "./kit";

type ScreenProps = { pins: boolean; density?: Density };

// ── DASHBOARDS ────────────────────────────────────────────────────────────
export function DashA({ pins, density }: ScreenProps) {
  const rows: [string, string, string, string, string, Tone][] = [
    ["MR DIY 1Utama", "RM 142.50", "6%", "Office supplies", "Verified", "ok"],
    ["Maxis Berhad", "RM 89.00", "8%", "Telecom", "Needs review", "warn"],
    ["Shopee Express", "RM 24.30", "0%", "Logistics", "Needs review", "warn"],
    ["Tealive SS15", "RM 17.40", "6%", "Meals", "Verified", "ok"],
    ["Petronas Mont Kiara", "RM 80.00", "6%", "Vehicle", "Verified", "ok"],
    ["IKEA Damansara", "RM 1,249.00", "6%", "Equipment", "Conflict", "err"],
    ["TNB Bil Elektrik", "RM 412.30", "0%", "Utilities", "Verified", "ok"],
    ["Grab for Business", "RM 38.20", "6%", "Travel", "Verified", "ok"],
  ];
  const pad = density === "compact" ? "6px 14px" : density === "comfy" ? "14px 14px" : "10px 14px";
  return (
    <Shell title="A · Inbox" sub="email-style list, single column">
      <AppChrome active="Inbox">
        <H
          kicker="inbox · 24 unread"
          title="Receipts to process"
          right={
            <>
              <Bracket>filter</Bracket>&nbsp;<Bracket>sort: newest</Bracket>&nbsp;<Bracket accent>＋ upload</Bracket>
            </>
          }
        />
        <div style={{ padding: "0 18px" }}>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1.6fr 0.8fr 0.6fr 1fr 0.9fr",
                padding: "8px 14px",
                borderBottom: `1px solid ${RK.rule}`,
                fontFamily: RK.mono,
                fontSize: 9.5,
                color: RK.ink3,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              <span>□</span>
              <span>Vendor<Pin n={1} hidden={!pins} /></span>
              <span>Total</span>
              <span>SST<Pin n={2} hidden={!pins} /></span>
              <span>Category</span>
              <span>Status<Pin n={3} hidden={!pins} /></span>
            </div>
            {rows.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1.6fr 0.8fr 0.6fr 1fr 0.9fr",
                  padding: pad,
                  borderBottom: i < rows.length - 1 ? `1px solid ${RK.rule2}` : "none",
                  alignItems: "center",
                  fontFamily: RK.mono,
                  fontSize: 11,
                }}
              >
                <span style={{ color: RK.ink3 }}>□</span>
                <span>{r[0]}</span>
                <span>{r[1]}</span>
                <span><Pill tone={r[2] === "0%" ? "ink" : "accent"}>{r[2]}</Pill></span>
                <span style={{ color: RK.ink2 }}>{r[3]}</span>
                <span><Pill tone={r[5]}>{r[4]}</Pill></span>
              </div>
            ))}
          </div>
        </div>
        <Legend
          hidden={!pins}
          items={[
            "Vendor name extracted from receipt header",
            "SST rate auto-detected from line items",
            "Status: AI confidence + manual review state",
          ]}
        />
      </AppChrome>
    </Shell>
  );
}

export function DashB({ pins }: ScreenProps) {
  const cols: { name: string; tone: Tone; items: [string, string][] }[] = [
    { name: "Captured", tone: "ink", items: [["MR DIY", "RM 142.50"], ["Tealive", "RM 17.40"], ["Grab", "RM 38.20"]] },
    { name: "Extracted", tone: "accent", items: [["Maxis", "RM 89.00"], ["Shopee", "RM 24.30"]] },
    { name: "Needs review", tone: "warn", items: [["IKEA", "RM 1,249.00"], ["Lazada", "RM 312.00"]] },
    { name: "Approved", tone: "ok", items: [["TNB", "RM 412.30"], ["Petronas", "RM 80.00"], ["Maxis Mar", "RM 89.00"], ["Astro", "RM 159.00"]] },
  ];
  return (
    <Shell title="B · Pipeline" sub="kanban by lifecycle stage">
      <AppChrome active="Inbox">
        <H
          kicker="pipeline"
          title="Receipts moving through review"
          right={<><Bracket>this week ▾</Bracket>&nbsp;<Bracket accent>＋ upload</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, height: "calc(100% - 80px)" }}>
          {cols.map((c, i) => (
            <div key={i} style={{ background: RK.paper2, border: `1px solid ${RK.rule}`, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "8px 10px", borderBottom: `1px solid ${RK.rule}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: RK.mono, fontSize: 10 }}>
                <span style={{ color: RK.ink2, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {c.name} {i === 2 && <Pin n={1} hidden={!pins} />}
                </span>
                <Pill tone={c.tone}>{c.items.length}</Pill>
              </div>
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, flex: 1, overflow: "auto" }}>
                {c.items.map((it, j) => (
                  <div key={j} style={{ background: "white", border: `1px solid ${RK.rule}`, padding: "8px 10px", fontFamily: RK.mono, fontSize: 10.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{it[0]}</span>
                      <span style={{ color: RK.ink2 }}>{it[1]}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center" }}>
                      <Pill tone="ink">SST 6%</Pill>
                      {c.tone === "warn" ? <Meter level={1} /> : c.tone === "accent" ? <Meter level={2} /> : <Meter level={3} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Legend
          hidden={!pins}
          items={[
            "Drag cards across columns to advance status",
            "Each card carries SST + AI confidence",
            'AI fills "Extracted" automatically; humans gate "Approved"',
          ]}
        />
      </AppChrome>
    </Shell>
  );
}

export function DashC({ pins }: ScreenProps) {
  return (
    <Shell title="C · SST-front" sub="filing-period dashboard">
      <AppChrome active="SST">
        <H
          kicker="taxable period · q2 2026 (apr–jun)"
          title="SST filing readiness"
          right={<><Bracket>switch period ▾</Bracket>&nbsp;<Bracket accent>generate SST-02</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white", padding: 16 }}>
            <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase", letterSpacing: 0.5 }}>
              output tax collected <Pin n={1} hidden={!pins} />
            </div>
            <div style={{ fontFamily: RK.mono, fontSize: 32, color: RK.ink, marginTop: 4 }}>RM 14,820.30</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Pill tone="accent">6% · RM 12,400</Pill>
              <Pill tone="warn">8% · RM 2,420</Pill>
              <Pill tone="ink">0% · RM 0</Pill>
            </div>
            <div style={{ height: 1, background: RK.rule2, margin: "16px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[["Receipts", "1,204"], ["Verified", "1,180"], ["In review", "24"]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: RK.mono, fontSize: 9.5, color: RK.ink3, textTransform: "uppercase" }}>{k}</div>
                  <div style={{ fontFamily: RK.mono, fontSize: 18, color: RK.ink }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: RK.rule2, margin: "16px 0" }} />
            <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase", marginBottom: 8 }}>
              category split <Pin n={2} hidden={!pins} />
            </div>
            {([
              ["Telecom & utilities", 0.32, "RM 4,742"],
              ["Office supplies", 0.18, "RM 2,668"],
              ["Vehicle & travel", 0.16, "RM 2,371"],
              ["Meals & entertainment", 0.14, "RM 2,075"],
              ["Equipment", 0.20, "RM 2,964"],
            ] as [string, number, string][]).map(([k, p, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "160px 1fr 80px", gap: 10, alignItems: "center", padding: "4px 0", fontFamily: RK.mono, fontSize: 11 }}>
                <span style={{ color: RK.ink2 }}>{k}</span>
                <div style={{ height: 8, background: RK.rule2, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${p * 100}%`, background: RK.accent }} />
                </div>
                <span style={{ textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white" }}>
            <div style={{ padding: 12, borderBottom: `1px solid ${RK.rule}`, fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase" }}>
              filing checklist <Pin n={3} hidden={!pins} />
            </div>
            {([
              ["All receipts categorized", true],
              ["Vendor TINs verified", true],
              ["Cross-period duplicates checked", true],
              ["SST-02 draft reviewed", false],
              ["Approver signed off", false],
              ["Submit to MySST portal", false],
            ] as [string, boolean][]).map(([k, done], i) => (
              <div key={i} style={{ padding: "10px 12px", display: "grid", gridTemplateColumns: "20px 1fr auto", borderBottom: `1px solid ${RK.rule2}`, fontFamily: RK.mono, fontSize: 11, alignItems: "center" }}>
                <span style={{ color: done ? RK.ok : RK.ink3 }}>{done ? "✓" : "○"}</span>
                <span style={{ color: done ? RK.ink2 : RK.ink }}>{k}</span>
                <span><Pill tone={done ? "ok" : "ink"}>{done ? "done" : "todo"}</Pill></span>
              </div>
            ))}
            <div style={{ padding: 12, borderTop: `1px solid ${RK.rule}`, background: RK.paper2 }}>
              <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase", marginBottom: 4 }}>days until due</div>
              <div style={{ fontFamily: RK.mono, fontSize: 22, color: RK.accent }}>14d</div>
              <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3 }}>SST-02 due 30 May 2026</div>
            </div>
          </div>
        </div>
        <Legend
          hidden={!pins}
          items={[
            "Headline = total output SST owed",
            "Category breakdown reflects auto-categorization",
            "Checklist gates the SST-02 export",
          ]}
        />
      </AppChrome>
    </Shell>
  );
}

export function DashD({ pins }: ScreenProps) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const counts: Record<number, number> = { 2: 1, 3: 2, 5: 4, 8: 3, 9: 1, 12: 6, 13: 2, 16: 8, 17: 1, 19: 3, 22: 5, 23: 7, 26: 9, 27: 2, 29: 4 };
  return (
    <Shell title="D · Calendar" sub="month grid timeline">
      <AppChrome active="Receipts">
        <H
          kicker="april 2026"
          title="Receipts by day"
          right={<><Bracket>◀ Mar</Bracket>&nbsp;<Bracket>May ▶</Bracket>&nbsp;<Bracket accent>＋ upload</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 14, height: "calc(100% - 80px)" }}>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white", padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, fontFamily: RK.mono, fontSize: 9.5, color: RK.ink3, textTransform: "uppercase", marginBottom: 4 }}>
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {Array.from({ length: 2 }).map((_, i) => <div key={"pad" + i} />)}
              {days.map((d) => {
                const c = counts[d] || 0;
                const intensity = Math.min(1, c / 9);
                return (
                  <div
                    key={d}
                    style={{
                      aspectRatio: "1",
                      border: `1px solid ${RK.rule}`,
                      background: c ? `oklch(0.98 ${0.05 * intensity} 50)` : "white",
                      padding: 4,
                      fontFamily: RK.mono,
                      fontSize: 10,
                      position: "relative",
                    }}
                  >
                    <span style={{ color: RK.ink3 }}>{d}</span>
                    {c > 0 && (
                      <div style={{ position: "absolute", bottom: 4, left: 4, fontSize: 11, color: RK.accent }}>
                        {c}
                        <Pin n={1} hidden={!pins || d !== 16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 12, borderBottom: `1px solid ${RK.rule}`, fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase" }}>
              16 apr · 8 receipts <Pin n={2} hidden={!pins} />
            </div>
            <div style={{ flex: 1, overflow: "auto" }}>
              {[
                ["09:14", "Petronas KLCC", "RM 80.00"],
                ["11:02", "Starbucks Pavilion", "RM 24.50"],
                ["12:38", "Grab", "RM 18.20"],
                ["13:55", "MR DIY", "RM 142.50"],
                ["15:01", "Astro Bil", "RM 159.00"],
                ["16:22", "Shopee", "RM 24.30"],
                ["17:40", "Tealive", "RM 17.40"],
                ["19:10", "Maxis", "RM 89.00"],
              ].map((r, i) => (
                <div key={i} style={{ padding: "8px 12px", display: "grid", gridTemplateColumns: "50px 1fr auto", borderBottom: `1px solid ${RK.rule2}`, fontFamily: RK.mono, fontSize: 10.5, alignItems: "center" }}>
                  <span style={{ color: RK.ink3 }}>{r[0]}</span>
                  <span>{r[1]}</span>
                  <span style={{ color: RK.ink2 }}>{r[2]}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: 10, borderTop: `1px solid ${RK.rule}`, background: RK.paper2, fontFamily: RK.mono, fontSize: 10.5, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: RK.ink3 }}>day total</span>
              <span>RM 554.90 · SST 30.42</span>
            </div>
          </div>
        </div>
        <Legend hidden={!pins} items={["Heat = receipt count per day", "Click a day → side panel shows the timeline"]} />
      </AppChrome>
    </Shell>
  );
}

export function DashE({ pins }: ScreenProps) {
  return (
    <Shell title="E · AI brief" sub="conversational summary up top">
      <AppChrome active="Inbox">
        <div style={{ padding: "14px 18px" }}>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white", padding: 16, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: RK.accent, display: "inline-grid", placeItems: "center", color: "white", fontWeight: 600 }}>r</span>
              good morning, azlan — here's the gist <Pin n={1} hidden={!pins} />
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: RK.ink, fontFamily: RK.sans }}>
              You have <Pill tone="warn">24 receipts</Pill> waiting since Monday.{" "}
              <Pill tone="err">3</Pill> have low-confidence vendor names — likely Tealive Ampang, Shopee Express, and an unrecognised one. SST collected this period sits at{" "}
              <Pill tone="accent">RM 14,820</Pill>, on track vs. last quarter. I noticed two duplicate Maxis bills for March — want me to merge?
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Bracket accent>review 24 receipts</Bracket>
              <Bracket>merge duplicates</Bracket>
              <Bracket>show SST breakdown</Bracket>
              <Bracket>ask anything →</Bracket>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {([
            { k: "this week", v: "124 receipts", s: "RM 18.4k", tone: "ink" },
            { k: "low confidence", v: "7 receipts", s: "mostly handwritten", tone: "warn" },
            { k: "unmapped vendors", v: "3 vendors", s: "pending categorization", tone: "accent" },
          ] as { k: string; v: string; s: string; tone: Tone }[]).map((c, i) => (
            <div key={i} style={{ border: `1px solid ${RK.rule}`, background: "white", padding: 14 }}>
              <div style={{ fontFamily: RK.mono, fontSize: 9.5, color: RK.ink3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {c.k} <Pin n={2} hidden={!pins || i !== 0} />
              </div>
              <div style={{ fontFamily: RK.mono, fontSize: 18, color: RK.ink, marginTop: 4 }}>{c.v}</div>
              <div style={{ fontFamily: RK.mono, fontSize: 10.5, color: RK.ink3, marginTop: 2 }}>{c.s}</div>
              <div style={{ marginTop: 8 }}><Pill tone={c.tone}>open ↗</Pill></div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase", marginBottom: 6 }}>
            recent activity <Pin n={3} hidden={!pins} />
          </div>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white" }}>
            {[
              ["10:42", "AI extracted 18 fields from MR DIY 1Utama"],
              ["10:38", "You approved Maxis Mar bill (RM 89.00)"],
              ["10:14", "AI flagged conflict on IKEA Damansara (SST 6% vs vendor history 0%)"],
              ["09:55", "Email forward · 3 new receipts from receipts@resitly.my"],
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 14px",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  borderBottom: i < 3 ? `1px solid ${RK.rule2}` : "none",
                  fontFamily: RK.mono,
                  fontSize: 10.5,
                  color: RK.ink2,
                }}
              >
                <span style={{ color: RK.ink3 }}>{r[0]}</span>
                <span>{r[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <Legend
          hidden={!pins}
          items={[
            "AI brief: plain-English summary of what changed",
            "Three quick metrics — clickable into the relevant view",
            "Activity log = audit trail for SME owner",
          ]}
        />
      </AppChrome>
    </Shell>
  );
}

// ── CAPTURE (A · Drop zone) ───────────────────────────────────────────────
export function CapA({ pins }: ScreenProps) {
  return (
    <Shell title="A · Drop zone" sub="multi-file drop, queue below">
      <AppChrome active="Receipts">
        <H kicker="upload" title="Add receipts" right={<><Bracket>browse files</Bracket>&nbsp;<Bracket>scan</Bracket></>} />
        <div style={{ padding: "0 18px" }}>
          <div
            style={{
              border: `2px dashed ${RK.accent}`,
              background: RK.accentSoft,
              padding: "36px 24px",
              textAlign: "center",
              borderRadius: 4,
              position: "relative",
            }}
          >
            <div style={{ fontFamily: RK.mono, fontSize: 22, color: RK.accent }}>＋ drop receipts here</div>
            <div style={{ fontFamily: RK.mono, fontSize: 11, color: RK.ink2, marginTop: 6 }}>
              JPG · PNG · PDF · HEIC — up to 50 at once <Pin n={1} hidden={!pins} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
              <Bracket>browse</Bracket>
              <Bracket>paste from clipboard</Bracket>
              <Bracket>scan with camera</Bracket>
            </div>
          </div>
          <div style={{ marginTop: 16, fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase" }}>
            queue · 4 of 4 ready <Pin n={2} hidden={!pins} />
          </div>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white", marginTop: 6 }}>
            {([
              ["IMG_0421.jpg", "MR DIY · RM 142.50", 3, "ok"],
              ["IMG_0422.jpg", "reading…", 2, "warn"],
              ["scan_039.pdf", "Maxis bill · RM 89.00", 3, "ok"],
              ["photo.heic", "low light · retake?", 1, "err"],
            ] as [string, string, number, Tone][]).map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 180px 1fr 100px 90px",
                  padding: "10px 14px",
                  alignItems: "center",
                  borderBottom: i < 3 ? `1px solid ${RK.rule2}` : "none",
                  fontFamily: RK.mono,
                  fontSize: 11,
                }}
              >
                <span style={{ width: 26, height: 32, background: RK.rule2, border: `1px solid ${RK.rule}`, display: "inline-block" }} />
                <span style={{ color: RK.ink2 }}>{r[0]}</span>
                <span>{r[1]}</span>
                <Meter level={r[2]} />
                <span style={{ textAlign: "right" }}>
                  <Pill tone={r[3]}>{r[3] === "ok" ? "extracted" : r[3] === "warn" ? "reading" : "retake"}</Pill>
                </span>
              </div>
            ))}
          </div>
        </div>
        <Legend hidden={!pins} items={["Drop zone is the entire content area when dragging", "Queue auto-runs OCR; cards advance as fields fill"]} />
      </AppChrome>
    </Shell>
  );
}

// ── EXTRACTION (A · Side-by-side) ─────────────────────────────────────────
export function ExtA({ pins }: ScreenProps) {
  return (
    <Shell title="A · Side-by-side" sub="receipt left, fields right">
      <AppChrome active="Receipts">
        <H
          kicker="receipt #1284 · MR DIY 1Utama"
          title="Review extracted data"
          right={<><Bracket>skip</Bracket>&nbsp;<Bracket>save draft</Bracket>&nbsp;<Bracket accent>approve →</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: RK.paper2, border: `1px solid ${RK.rule}`, padding: 18, display: "grid", placeItems: "center", position: "relative" }}>
            <ReceiptScan w={280} h={400} />
          </div>
          <div style={{ background: "white", border: `1px solid ${RK.rule}` }}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${RK.rule}`, display: "flex", justifyContent: "space-between", fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase" }}>
              <span>extracted fields <Pin n={1} hidden={!pins} /></span>
              <Meter level={3} label="overall confidence" />
            </div>
            <div>
              <Field label="vendor" value="MR DIY (M) Sdn Bhd" conf={3} hidePins={!pins} n={2} />
              <Field label="TIN" value="C20880123456" conf={2} hidePins={!pins} />
              <Field label="invoice #" value="MD-1U-04219" conf={3} hidePins={!pins} />
              <Field label="date" value="16 Apr 2026 13:55" conf={3} hidePins={!pins} />
              <Field label="subtotal" value="RM 134.43" conf={3} hidePins={!pins} />
              <Field label="SST 6%" value="RM 8.07" conf={3} hidePins={!pins} n={3} tone="warn" />
              <Field label="total" value="RM 142.50" conf={3} hidePins={!pins} edited />
              <Field label="category" value="Office supplies" conf={2} hidePins={!pins} />
              <Field label="payment" value="Card · ****4592" conf={2} hidePins={!pins} />
            </div>
            <div style={{ padding: 12, borderTop: `1px solid ${RK.rule}`, fontFamily: RK.mono, fontSize: 10, color: RK.ink3, background: RK.paper2 }}>
              ▮▯▯ low conf · ▮▮▯ medium · ▮▮▮ high
            </div>
          </div>
        </div>
        <Legend
          hidden={!pins}
          items={[
            "Per-field confidence meter (3 cells)",
            "Vendor name pulled from receipt header",
            "SST line is always shown — Malaysian SME requirement",
          ]}
        />
      </AppChrome>
    </Shell>
  );
}

// ── SST (A · Rules table) ─────────────────────────────────────────────────
export function SstA({ pins }: ScreenProps) {
  return (
    <Shell title="A · Rules table" sub="vendor → category → SST mapping">
      <AppChrome active="SST">
        <H
          kicker="sst rules · 24 active"
          title="Vendor categorization rules"
          right={<><Bracket>import CSV</Bracket>&nbsp;<Bracket accent>＋ new rule</Bracket></>}
        />
        <div style={{ padding: "0 18px" }}>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 100px 1fr 90px 80px",
                padding: "8px 14px",
                borderBottom: `1px solid ${RK.rule}`,
                fontFamily: RK.mono,
                fontSize: 9.5,
                color: RK.ink3,
                textTransform: "uppercase",
              }}
            >
              <span>Match <Pin n={1} hidden={!pins} /></span>
              <span>Vendor / pattern</span>
              <span>SST</span>
              <span>Category</span>
              <span>Hits</span>
              <span>State</span>
            </div>
            {([
              ["exact", "Maxis Berhad", "8%", "Telecom", 124, "on"],
              ["contains", "*petronas*", "6%", "Vehicle · Fuel", 88, "on"],
              ["exact", "TNB", "0%", "Utilities", 36, "on"],
              ["regex", "grab|maxim|airasia ride", "6%", "Travel", 212, "on"],
              ["contains", "*ikea*", "6%", "Equipment", 18, "review"],
              ["exact", "Tealive Holdings", "6%", "Meals", 41, "on"],
            ] as [string, string, string, string, number, string][]).map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 100px 1fr 90px 80px",
                  padding: "10px 14px",
                  borderBottom: i < 5 ? `1px solid ${RK.rule2}` : "none",
                  alignItems: "center",
                  fontFamily: RK.mono,
                  fontSize: 11,
                }}
              >
                <Pill tone="ink">{r[0]}</Pill>
                <span>{r[1]}</span>
                <Pill tone={r[2] === "0%" ? "ink" : "accent"}>{r[2]}</Pill>
                <span style={{ color: RK.ink2 }}>{r[3]}</span>
                <span style={{ color: RK.ink3 }}>{r[4]}</span>
                <Pill tone={r[5] === "on" ? "ok" : "warn"}>{r[5]}</Pill>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontFamily: RK.mono, fontSize: 10.5, color: RK.ink3 }}>
            Rules apply in order. Last match wins. <Pin n={2} hidden={!pins} />
          </div>
        </div>
        <Legend hidden={!pins} items={["Match types: exact / contains / regex", "Order matters — drag rows to reorder"]} />
      </AppChrome>
    </Shell>
  );
}

// ── BULK (B · Smart triage) ───────────────────────────────────────────────
export function BulkB({ pins }: ScreenProps) {
  const buckets: { name: string; n: number; tone: Tone; sub: string; pin?: number }[] = [
    { name: "Auto-approved", n: 96, tone: "ok", sub: "high confidence + matched rules", pin: 1 },
    { name: "Needs SST review", n: 11, tone: "warn", sub: "rate ambiguity or new vendor" },
    { name: "Possible duplicate", n: 4, tone: "warn", sub: "matches an earlier receipt" },
    { name: "Unreadable", n: 3, tone: "err", sub: "low light · retake required" },
  ];
  return (
    <Shell title="B · Smart triage" sub="auto-bucket by exception">
      <AppChrome active="Receipts">
        <H
          kicker="batch complete · 124 receipts"
          title="Triage results"
          right={<><Bracket accent>review 18 exceptions</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          {buckets.map((b, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: `1px solid ${RK.rule}`,
                padding: 14,
                display: "grid",
                gridTemplateColumns: "60px 1fr 240px",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontFamily: RK.mono, fontSize: 28, color: b.tone === "ok" ? RK.ok : b.tone === "warn" ? RK.warn : RK.err }}>{b.n}</div>
              <div>
                <div style={{ fontFamily: RK.mono, fontSize: 12 }}>
                  {b.name} {b.pin && <Pin n={b.pin} hidden={!pins} />}
                </div>
                <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3 }}>{b.sub}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                {b.tone === "ok" ? <Bracket>view list</Bracket> : <Bracket accent>resolve →</Bracket>}
              </div>
            </div>
          ))}
        </div>
        <Legend hidden={!pins} items={["Exceptions surface — successes recede", "Owner can power through 18 reviews instead of 124 rows"]} />
      </AppChrome>
    </Shell>
  );
}

// ── VENDORS (A · List) ────────────────────────────────────────────────────
export function VendA({ pins }: ScreenProps) {
  return (
    <Shell title="A · Vendor list" sub="alphabetic with health">
      <AppChrome active="Vendors">
        <H
          kicker="vendors · 142 known"
          title="All suppliers"
          right={<><Bracket>filter</Bracket>&nbsp;<Bracket accent>＋ vendor</Bracket></>}
        />
        <div style={{ padding: "0 18px" }}>
          <div style={{ border: `1px solid ${RK.rule}`, background: "white" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 110px 1fr 80px 100px 70px",
                padding: "8px 14px",
                borderBottom: `1px solid ${RK.rule}`,
                fontFamily: RK.mono,
                fontSize: 9.5,
                color: RK.ink3,
                textTransform: "uppercase",
              }}
            >
              <span>Vendor <Pin n={1} hidden={!pins} /></span>
              <span>TIN</span>
              <span>Default category</span>
              <span>SST</span>
              <span>YTD spend</span>
              <span>Health</span>
            </div>
            {([
              ["Maxis Berhad", "C20880001", "Telecom", "8%", "RM 1,068", 3],
              ["MR DIY (M) Sdn Bhd", "C20880123", "Office supplies", "6%", "RM 4,210", 3],
              ["TNB", "C20880003", "Utilities", "0%", "RM 4,940", 3],
              ["IKEA Damansara", "C20880077", "Equipment", "6% / 8%", "RM 6,120", 2],
              ["Petronas", "C20880099", "Vehicle · Fuel", "6%", "RM 2,400", 3],
              ["Lazada Malaysia", "— missing", "Unmapped", "?", "RM 312", 1],
            ] as [string, string, string, string, string, number][]).map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 110px 1fr 80px 100px 70px",
                  padding: "10px 14px",
                  borderBottom: i < 5 ? `1px solid ${RK.rule2}` : "none",
                  alignItems: "center",
                  fontFamily: RK.mono,
                  fontSize: 11,
                }}
              >
                <span>{r[0]}</span>
                <span style={{ color: r[1].startsWith("—") ? RK.err : RK.ink3 }}>{r[1]}</span>
                <span>{r[2]}</span>
                <Pill tone={r[3] === "0%" ? "ink" : r[3].includes("/") ? "warn" : "accent"}>{r[3]}</Pill>
                <span style={{ color: RK.ink2 }}>{r[4]}</span>
                <Meter level={r[5]} />
              </div>
            ))}
          </div>
        </div>
        <Legend hidden={!pins} items={["Health = TIN present + SST consistent + categorization stable"]} />
      </AppChrome>
    </Shell>
  );
}

// ── EXPORT (A · Connectors) ───────────────────────────────────────────────
export function ExpA({ pins }: ScreenProps) {
  const conns: [string, string, string, Tone, number?][] = [
    ["SQL Account", "124 receipts ready", "connected", "ok", 1],
    ["AutoCount", "124 receipts ready", "connected", "ok"],
    ["Xero", "Re-auth needed", "reconnect", "warn"],
    ["MYOB", "Not connected", "connect", "ink"],
    ["QuickBooks", "Not connected", "connect", "ink"],
    ["CSV / XLSX", "Always available", "export", "ink", 2],
  ];
  return (
    <Shell title="A · Connectors" sub="pick destination">
      <AppChrome active="Export">
        <H
          kicker="export · April 2026"
          title="Send receipts to your books"
          right={<><Bracket accent>configure connector</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {conns.map((c, i) => (
            <div key={i} style={{ background: "white", border: `1px solid ${RK.rule}`, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: RK.rule2,
                    border: `1px solid ${RK.rule}`,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: RK.mono,
                    fontSize: 10,
                    color: RK.ink3,
                  }}
                >
                  logo
                </div>
                <Pill tone={c[3]}>{c[2]}</Pill>
              </div>
              <div style={{ fontFamily: RK.mono, fontSize: 12, marginTop: 10 }}>
                {c[0]} {c[4] && <Pin n={c[4]} hidden={!pins} />}
              </div>
              <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3, marginTop: 2 }}>{c[1]}</div>
              <div style={{ marginTop: 10 }}>
                <Bracket accent={c[3] === "ok"}>{c[3] === "ok" ? "send →" : c[3] === "warn" ? "reconnect" : "connect"}</Bracket>
              </div>
            </div>
          ))}
        </div>
        <Legend hidden={!pins} items={["Malaysian-first: SQL Account, AutoCount surface up top", "CSV always available as escape hatch"]} />
      </AppChrome>
    </Shell>
  );
}

// ── REPORTS (A · SST-02 draft) ────────────────────────────────────────────
function FormField({ l, v, warn }: { l: string; v: string; warn?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: RK.mono, fontSize: 9, color: RK.ink3, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
      <div
        style={{
          fontFamily: RK.mono,
          fontSize: 12,
          color: warn ? RK.warn : RK.ink,
          padding: "4px 0",
          borderBottom: `1px solid ${RK.rule}`,
        }}
      >
        {v}
      </div>
    </div>
  );
}

export function RepA({ pins }: ScreenProps) {
  return (
    <Shell title="A · SST-02 draft" sub="MySST-shaped form">
      <AppChrome active="Reports">
        <H
          kicker="SST-02 · Q2 2026"
          title="Filing draft"
          right={<><Bracket>print</Bracket>&nbsp;<Bracket accent>export PDF</Bracket></>}
        />
        <div style={{ padding: "0 18px" }}>
          <div style={{ background: "white", border: `1px solid ${RK.rule}`, padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <FormField l="REGISTERED PERSON" v="AZLAN ENTERPRISE SDN BHD" />
                <FormField l="SST NUMBER" v="W10-1809-31000123" />
                <FormField l="TAXABLE PERIOD" v="01/04/2026 — 30/06/2026" />
              </div>
              <div>
                <FormField l="RETURN DUE BY" v="30/05/2026" warn />
                <FormField l="NTN" v="990123456789" />
                <FormField l="OWNER" v="Azlan bin Ramli" />
              </div>
            </div>
            <div style={{ height: 1, background: RK.rule, margin: "18px 0" }} />
            <div style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3, textTransform: "uppercase" }}>
              part B · taxable supplies <Pin n={1} hidden={!pins} />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontFamily: RK.mono, fontSize: 11 }}>
              <thead>
                <tr style={{ color: RK.ink3, fontSize: 9.5, textTransform: "uppercase" }}>
                  <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule}` }}>code</td>
                  <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule}` }}>description</td>
                  <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule}`, textAlign: "right" }}>value (RM)</td>
                  <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule}`, textAlign: "right" }}>SST (RM)</td>
                </tr>
              </thead>
              <tbody>
                {[
                  ["B01", "Sales tax @ 6%", "206,716.67", "12,403.00"],
                  ["B02", "Service tax @ 8%", "30,250.00", "2,420.00"],
                  ["B03", "Zero-rated supplies", "14,200.00", "0.00"],
                  ["B04", "Exempt supplies", "0.00", "0.00"],
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule2}` }}>{r[0]}</td>
                    <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule2}` }}>{r[1]}</td>
                    <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule2}`, textAlign: "right" }}>{r[2]}</td>
                    <td style={{ padding: 6, borderBottom: `1px solid ${RK.rule2}`, textAlign: "right" }}>{r[3]}</td>
                  </tr>
                ))}
                <tr style={{ background: RK.paper2 }}>
                  <td colSpan={2} style={{ padding: 8, fontWeight: 600 }}>TOTAL TAX PAYABLE</td>
                  <td style={{ padding: 8, textAlign: "right" }}>251,166.67</td>
                  <td style={{ padding: 8, textAlign: "right", color: RK.accent, fontWeight: 600 }}>14,823.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Legend hidden={!pins} items={["Form mirrors official SST-02 layout — no relearning"]} />
      </AppChrome>
    </Shell>
  );
}

// ── APPROVALS (A · Reviewer queue) ────────────────────────────────────────
export function AppA({ pins }: ScreenProps) {
  const rows: [string, string, string, string, string, string, number?][] = [
    ["#1289", "Maxis Berhad", "RM 89.00", "Telecom · 8%", "Mei (acct)", "5m ago", 1],
    ["#1288", "Petronas KLCC", "RM 80.00", "Vehicle · 6%", "Self", "12m ago"],
    ["#1287", "IKEA Damansara", "RM 1,249.00", "Equipment · 6%", "Mei (acct)", "23m ago"],
    ["#1286", "Foodpanda", "RM 54.00", "Meals · 6%", "AI auto", "1h ago"],
  ];
  return (
    <Shell title="A · Reviewer queue" sub="for the owner-as-approver">
      <AppChrome active="Inbox">
        <H
          kicker="my approvals · 12 pending"
          title="Approve as Azlan"
          right={<><Bracket>bulk approve</Bracket>&nbsp;<Bracket accent>review</Bracket></>}
        />
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: `1px solid ${RK.rule}`,
                padding: 12,
                display: "grid",
                gridTemplateColumns: "70px 1fr 100px 1fr 130px 120px",
                alignItems: "center",
                gap: 10,
                fontFamily: RK.mono,
                fontSize: 11,
              }}
            >
              <span style={{ color: RK.ink3 }}>
                {r[0]} {r[6] && <Pin n={r[6]} hidden={!pins} />}
              </span>
              <span>{r[1]}</span>
              <span>{r[2]}</span>
              <span style={{ color: RK.ink2 }}>{r[3]}</span>
              <span style={{ color: RK.ink3 }}>by {r[4]} · {r[5]}</span>
              <span style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <Bracket>edit</Bracket>
                <Bracket accent>approve</Bracket>
              </span>
            </div>
          ))}
        </div>
        <Legend hidden={!pins} items={["Single-screen approval — one row, one decision"]} />
      </AppChrome>
    </Shell>
  );
}
