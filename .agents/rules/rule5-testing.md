---
trigger: always_on
---

PRIORITY: MEDIUM

Every critical piece of logic MUST have tests:

UNIT TESTS:
- Write unit tests for all utility functions in /utils.
- Write unit tests for all custom hooks.
- Write unit tests for AI prompt-building functions.
- Use Jest + React Testing Library.
- Minimum test cases per function: happy path + 2 edge cases.

COMPONENT TESTS:
- Write component tests for all interactive components.
- Test: renders correctly, user interactions work, error states display correctly.
- Use data-testid attributes on interactive elements.

AI INTEGRATION:
- Mock the AI API in tests — never hit the real API in tests.
- Test that prompts are built correctly given various inputs.
- Test error handling when the AI API fails.

TEST COMMANDS:
- npm test must run all tests.
- Tests must pass before any deployment.
- Aim for >70% code coverage on utility functions.