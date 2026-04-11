# 🎨 DESIGN SYSTEM — AI Receipt Processor

## 1. Brand Overview

**Product Vision**
Turn messy receipts into structured, actionable financial data in seconds.

**Brand Personality**

* Reliable
* Effortless
* Intelligent
* Local-first (Malaysia-focused)

**Tone of Voice**

* Clear, simple, and direct
* Friendly, not corporate
* Avoid jargon

---

## 2. Color System

### Primary Colors

| Name  | Hex     | Usage                |
| ----- | ------- | -------------------- |
| Navy  | #0F172A | Backgrounds, headers |
| White | #FFFFFF | Base UI              |

### Accent Colors

| Name    | Hex     | Usage                       |
| ------- | ------- | --------------------------- |
| Blue    | #3B82F6 | Primary actions, highlights |
| Emerald | #10B981 | Success states, categories  |

### Neutral Colors

| Name       | Hex     |
| ---------- | ------- |
| Light Gray | #F8FAFC |
| Gray       | #64748B |
| Dark Gray  | #1E293B |

### Semantic Colors

| Type    | Hex     |
| ------- | ------- |
| Success | #22C55E |
| Warning | #F59E0B |
| Error   | #EF4444 |

---

## 3. Typography

### Font Family

* Primary: Inter
* Fallback: system-ui, sans-serif

### Scale

| Element    | Size | Weight |
| ---------- | ---- | ------ |
| H1         | 32px | 700    |
| H2         | 24px | 600    |
| H3         | 20px | 600    |
| Body       | 16px | 400    |
| Small Text | 14px | 400    |

### Guidelines

* Use bold sparingly for emphasis
* Maintain generous spacing
* Avoid dense text blocks

---

## 4. Layout & Spacing

### Grid System

* 12-column grid
* Max width: 1200px
* Padding: 24px

### Spacing Scale

* 4px, 8px, 12px, 16px, 24px, 32px, 48px

---

## 5. Components

### 5.1 Upload Area

* Large dropzone
* Dashed border
* Rounded corners (12px)
* States:

  * Default
  * Hover (highlight border)
  * Active (solid border)

**Copy Example:**
"Drop your receipt or click to upload"

---

### 5.2 Receipt Card

**Structure**

* Left: Image preview
* Right: Extracted data

**Fields**

* Merchant
* Date
* Items
* Total
* Category

**Behavior**

* Editable fields
* Inline validation

---

### 5.3 Category Tags

* Pill-shaped badges
* Padding: 6px 12px
* Rounded: full

**Examples**

* Food → Green
* Transport → Blue
* Office → Purple

---

### 5.4 Buttons

#### Primary

* Background: Blue
* Text: White
* Radius: 10px

#### Secondary

* Outline style
* Neutral colors

#### States

* Hover → slightly darker
* Disabled → opacity 50%

---

### 5.5 Inputs

* Rounded corners (10px)
* Border: light gray
* Focus:

  * Blue outline
  * Subtle shadow

---

## 6. Dashboard UI

### Sections

#### Summary Cards

* Total Expenses
* Monthly Spend
* Categories

#### Charts

* Pie chart (categories)
* Bar chart (monthly trend)

#### Table

* Recent receipts
* Sortable columns

---

## 7. Interaction & Motion

### Principles

* Fast (200–300ms transitions)
* Subtle
* Purpose-driven

### Examples

* Upload → loading spinner
* Extraction → progressive reveal
* Hover → elevation increase

---

## 8. Iconography

* Style: Outline (Lucide or similar)
* Consistent stroke width
* Minimal detail

---

## 9. Visual Style

### Design Language

* Clean
* Minimal
* Card-based
* Soft shadows

### Effects

* Light shadow:
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

* Hover elevation:
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);

---

## 10. Accessibility

* Contrast ratio ≥ 4.5:1
* Clear focus states
* Click targets ≥ 44px
* Keyboard navigable

---

## 11. Copy Guidelines

### Do

* “Scan your receipt”
* “Export to CSV”
* “We’ll handle the rest”

### Don’t

* Avoid technical language
* Avoid long sentences

---

## 12. Brand Differentiation

**Core Feeling**

* Not a tool
* A daily assistant

**Key Experience**

* Fast
* Accurate
* Effortless

---

## 13. Future Extensions

* Multi-user support
* Financial analytics
* Tax estimation
* AI assistant insights

---

## 14. Design Principles Summary

1. Clarity over complexity
2. Speed is perceived quality
3. Trust is visual
4. Simplicity wins for SMEs

---

## 15. Implementation Notes (Dev-Friendly)

* Use Tailwind CSS
* Use shadcn/ui components
* Keep components reusable
* Maintain consistent spacing + tokens

---

**End of Design System**
