---
description: WORKFLOW 1 — New Feature Development
---

Name: feature-dev
Trigger: Every time you start building a new feature

STEPS:
1. ALIGN: Re-read the problem statement. Write in a comment which requirement this feature addresses.
2. PLAN: List the components, hooks, utils, and API calls needed before writing any code.
3. TYPE: Define all TypeScript interfaces/types for this feature first.
4. BUILD: Write the logic layer first (utils/hooks), then the UI layer.
5. SECURE: Apply Rule 3 (Security) — validate inputs, protect secrets.
6. OPTIMIZE: Apply Rule 4 (Efficiency) — memoize, debounce, add loading states.
7. ACCESSIBILITY: Apply Rule 6 — add aria attributes, semantic HTML, keyboard support.
8. TEST: Write at least unit tests for the logic layer.
9. QUALITY CHECK: Run ESLint. Zero warnings allowed.
10. VERIFY: Test the feature manually in the browser.