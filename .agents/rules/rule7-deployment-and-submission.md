---
trigger: always_on
---

PRIORITY: CRITICAL

The deployed link MUST work at all times — a broken link = DQ:

BEFORE DEPLOYMENT:
- Run npm run build locally and verify zero errors.
- Test the production build locally with npm run preview or similar.
- Verify all environment variables are set in the deployment platform.
- Test every user flow on the deployed URL, not just localhost.

DEPLOYMENT CHECKLIST:
□ Build passes with zero errors and zero warnings
□ All environment variables set in deployment dashboard
□ AI API key is valid and has sufficient quota
□ All pages load without white screen or console errors
□ All forms submit and receive AI responses correctly
□ Mobile responsive layout works on 375px viewport
□ No 404 errors on any route

ONGOING:
- Never push breaking changes right before the deadline.
- Keep a working deployment at all times.
- If you make changes, verify the deployed link still works immediately after.

ANTI-PATTERNS TO AVOID

❌ Hardcoding API keys in code
❌ Using 'any' TypeScript type
❌ Making AI calls without loading/error states
❌ Not testing the deployed URL before the deadline
❌ Using <div onClick> instead of <button>
❌ Missing alt text on images
❌ Missing labels on form inputs
❌ Magic numbers and strings inline in code
❌ Duplicate logic across files
❌ Pushing breaking changes without verifying deployment
❌ AI responses that don't actually address the problem statement
❌ Forgetting to add .env to .gitignore
❌ console.log statements in production builds
❌ Not cleaning up useEffect subscriptions
❌ Missing error boundary or error state UI