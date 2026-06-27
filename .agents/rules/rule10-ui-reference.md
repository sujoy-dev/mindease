---
trigger: always_on
---

RULE 10 — UI Reference (Stitch Design System)

The Antigravity agent MUST match the Stitch-generated UI exactly:

Colors (use as CSS variables in globals.css):
  --color-primary: #6366F1
  --color-secondary: #A78BFA
  --color-accent: #2DD4BF
  --color-bg: #F8F7FF
  --color-surface: #FFFFFF
  --color-text-primary: #1E1B4B
  --color-text-secondary: #6B7280
  --color-danger: #F43F5E
  --color-success: #10B981

Border radius: --radius-card: 16px | --radius-input: 12px | --radius-pill: 50px
Shadow: --shadow-card: 0 4px 20px rgba(99,102,241,0.08)
Font: Inter (import from Google Fonts)

Component behavior rules:
- AI response card: always full-width, indigo left border 4px, never a chat bubble
- Mood picker: always a 5-item horizontal row, emoji in rounded square cards
- Crisis card: always visible on AI response screen, rose-50 bg, never hidden
- Bottom nav: always 5 items, active state indigo, 64px height
- All buttons: 44px min height, full-width primary CTAs, indigo gradient
- Breathing animation: CSS keyframes only, no JS animation libraries

When building any component, check the Stitch design reference first.
Every pixel of the UI must match the warmth and calmness of the design system.

https://stitch.withgoogle.com/projects/9938902331788637712