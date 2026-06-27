---
trigger: always_on
---

PRIORITY: CRITICAL

All code you write MUST follow these quality standards:

STRUCTURE:
- Use a clear, logical folder structure: /components, /hooks, /utils, /services, /types, /constants
- One responsibility per file. One responsibility per function.
- Max function length: 40 lines. If longer, refactor into smaller functions.
- No God components. Break large components into smaller focused ones.

READABILITY:
- Every function MUST have a JSDoc comment explaining: what it does, its params, and its return value.
- Every component MUST have a comment block explaining its purpose and props.
- Use meaningful variable names. No single-letter variables except loop counters (i, j).
- No magic numbers or strings — extract all to named constants in /constants.

MAINTAINABILITY:
- Use TypeScript with strict mode enabled. No 'any' types.
- All props must be typed with interfaces or types.
- Use named exports, not default exports (except for pages/routes).
- Never duplicate logic — extract to shared utilities.
- Use custom hooks to abstract business logic away from UI.

FORMATTING:
- ESLint + Prettier must be configured and all code must pass with zero warnings.
- Consistent spacing, indentation (2 spaces), and line endings.