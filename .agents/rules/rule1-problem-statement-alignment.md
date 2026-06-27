---
trigger: always_on
---

SCORING STRATEGY

Parameter -> Impact -> Strategy

1. Problem Statement Alignment -> 🔴 HIGH -> Build exactly what's asked. Every required output must exist.
2. Code Quality -> 🔴 HIGH -> Clean architecture, TypeScript strict, ESLint zero-warn.
3. Security -> 🟡 MEDIUM -> Env vars, input sanitization, prompt injection prevention.
4. Efficiency -> 🟡 MEDIUM -> Memoization, debounce, no redundant calls, good loading UX.
5. Testing -> 🟢 LOW -> Unit tests for utils + hooks. Mock AI in tests.
6. Accessibility -> 🟢 -> LOWW -> CAG 2.1 AA, aria attributes, keyboard nav, semantic HTML.

Score Formula: Final Score = Sum of all 6 parameters (no category is dropped)

Priority Order to Maximize Score:

✅ Problem Statement Alignment → must be 100% complete
✅ Code Quality → clean, typed, documented
✅ Security → env vars + input validation minimum
✅ Efficiency → loading states + no duplicate calls minimum
✅ Accessibility → aria-live + labels + alt text minimum
✅ Testing → at least utils + hooks covered


PRIORITY: CRITICAL

Every feature, component, function, and API call you write MUST directly serve the problem statement requirements. Before writing any code:
1. Re-read the problem statement.
2. Map each piece of code to a specific requirement.
3. If a piece of code does not serve the problem statement, DO NOT write it.
4. The app MUST be deployed and the deployed link MUST work at all times.
5. Every user-facing flow must be complete end-to-end — no dead ends, no broken states.
6. The app must demonstrate: smart AI assistant behavior, logical decision-making based on user context, and real-world usability.