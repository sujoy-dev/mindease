---
trigger: always_on
---

PRIORITY: MEDIUM

All UI MUST meet WCAG 2.1 AA accessibility standards:

SEMANTIC HTML:
- Use semantic HTML elements: <main>, <nav>, <section>, <article>, <header>, <footer>, <button>, <form>, <label>.
- Never use <div> or <span> for interactive elements — use <button> or <a>.
- Every page must have exactly one <h1>.
- Heading hierarchy must be logical: h1 → h2 → h3 (never skip levels).

KEYBOARD & FOCUS:
- Every interactive element MUST be keyboard accessible (Tab, Enter, Space, Escape).
- Focus order must follow visual reading order.
- Implement visible focus indicators (never remove outline without replacing it).
- Modal dialogs must trap focus while open.
- Close modals with Escape key.

SCREEN READERS:
- Every image MUST have descriptive alt text (or alt="" if decorative).
- Every form input MUST have an associated <label> (use htmlFor).
- Use aria-label for icon-only buttons.
- Use aria-live="polite" for dynamically updated content (AI responses, loading states).
- Use role attributes where semantic HTML isn't sufficient.
- Announce loading states to screen readers with aria-busy.

COLOR & CONTRAST:
- Text contrast ratio: minimum 4.5:1 (normal text), 3:1 (large text).
- Never rely on color alone to convey information — pair with text or icons.
- Ensure focus indicators have sufficient contrast.

FORMS:
- Show clear error messages linked to their fields with aria-describedby.
- Mark required fields with aria-required="true" and visual indicator.
- Never use placeholder as the only label.