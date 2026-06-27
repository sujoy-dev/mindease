---
description: WORKFLOW 3 — Component Creation Checklist
---

Name: new-component
Trigger: Every time you create a new React component

STEPS:
1. Name it clearly and descriptively (PascalCase).
2. Create in the correct folder (/components/feature-name/).
3. Write the TypeScript interface for props first.
4. Add JSDoc comment block at the top.
5. Use semantic HTML as the base.
6. Add all required aria attributes.
7. Add data-testid to all interactive elements.
8. Apply useCallback to all event handler props.
9. Wrap in React.memo if it's a pure presentational component.
10. Export as named export.