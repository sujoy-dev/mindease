---
trigger: always_on
---

PRIORITY: HIGH

All code MUST follow these security practices:

API KEYS & SECRETS:
- NEVER hardcode API keys, tokens, or secrets in source code.
- All secrets go in .env files. Add .env to .gitignore immediately.
- Use environment variable validation at startup (throw error if required env vars are missing).
- Prefix all client-side env vars with NEXT_PUBLIC_ (Next.js) or VITE_ (Vite) only when safe to expose.

INPUT VALIDATION:
- Validate and sanitize ALL user inputs before processing or sending to AI.
- Implement max character limits on all text inputs.
- Trim whitespace from all string inputs.
- Never pass raw user input directly to AI prompts without sanitization.

AI PROMPT SECURITY:
- Use system prompts to restrict AI behavior scope.
- Implement prompt injection prevention: wrap user input in clear delimiters.
- Never expose your system prompt content to the client.

HTTP & API:
- Never expose internal API errors to the client — use generic error messages.
- Implement request rate limiting on AI API calls.
- Use HTTPS only for all external calls.
- Add Content-Security-Policy headers where possible.

DEPENDENCIES:
- Use only well-maintained, widely-used packages.
- No packages with known critical vulnerabilities.