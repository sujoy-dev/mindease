---
trigger: always_on
---

PRIORITY: HIGH

All code MUST be optimized for performance:

AI API CALLS:
- Never make redundant or duplicate AI API calls.
- Implement loading states for every async operation — the UI must never appear frozen.
- Cache AI responses where the same input would produce the same output.
- Use streaming responses where possible for better perceived performance.
- Implement request debouncing on user-triggered AI calls (300ms minimum).

REACT / FRONTEND:
- Memoize expensive computations with useMemo.
- Memoize callback functions passed as props with useCallback.
- Use React.memo for pure presentational components.
- Lazy load non-critical components with React.lazy + Suspense.
- Avoid unnecessary re-renders — keep state as local as possible.
- Use virtualization (react-window or similar) for lists over 50 items.

BUNDLE & ASSETS:
- Code-split by route.
- Compress and optimize all images. Use WebP format.
- Minimize external dependencies — prefer native browser APIs when available.
- Tree-shake all imports.

DATA:
- Never fetch more data than needed.
- Implement proper cleanup for useEffect subscriptions and timers.