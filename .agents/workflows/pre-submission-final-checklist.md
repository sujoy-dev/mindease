---
description: WORKFLOW 4 — Pre-Submission Final Checklist
---

Name: pre-submission
Trigger: Run this before final submission

CHECKLIST:
□ Problem Statement Alignment
  - Every requirement from the problem statement is implemented
  - App produces all required outputs (meal plan, grocery list, substitutions, budget logic)
  - AI responses are context-aware and smart

□ Code Quality
  - ESLint passes with zero errors, zero warnings
  - TypeScript strict mode: zero type errors
  - No console.log statements in production code
  - All functions have JSDoc comments
  - Folder structure is clean and logical

□ Security
  - .env file is in .gitignore
  - No hardcoded secrets in source code
  - All user inputs are validated and sanitized
  - Error messages don't expose internals

□ Efficiency
  - No redundant AI API calls
  - Loading states on all async operations
  - No memory leaks (useEffect cleanups present)
  - useMemo/useCallback used where appropriate

□ Testing
  - npm test passes
  - All utility functions have tests
  - AI prompt builders have tests
  - Error states are tested

□ Accessibility
  - All images have alt text
  - All form inputs have labels
  - Keyboard navigation works for all features
  - aria-live regions present for dynamic content
  - Color contrast passes (check with browser devtools)
  - Run axe DevTools browser extension — zero critical errors

□ Deployment
  - npm run build produces zero errors
  - Deployed URL is live and working
  - All env vars set in deployment dashboard
  - Every user flow tested on deployed URL
  - Mobile responsive (375px viewport)