---
description: WORKFLOW 2 — AI Integration Checklist
---

Name: ai-integration
Trigger: Every time you add an AI API call

STEPS:
1. Define the system prompt in a constants file — never inline.
2. Sanitize user input before including in the prompt.
3. Wrap user input in clear delimiters: e.g., <user_input>{input}</user_input>
4. Add loading state (isLoading: true) before the API call.
5. Implement error handling: catch API errors, show user-friendly message.
6. Add aria-live="polite" on the container that will display the AI response.
7. Use aria-busy="true" on the container while loading.
8. Implement timeout handling (30s max — show error if exceeded).
9. Log errors to console in development only (not in production).
10. Test: mock the API and test happy path + error path.