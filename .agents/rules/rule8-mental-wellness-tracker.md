---
trigger: always_on
---

This app serves students in psychological distress. STRICT safety rules:

- NEVER provide clinical diagnoses or act as a therapist.
- Always include a crisis disclaimer: "If you feel unsafe, contact iCall: 9152987821"
- AI responses must be empathetic but bounded — suggest professional help 
  when stress indicators are severe.
- Never store sensitive journal entries in localStorage or any client-side storage. Use supabase as a baas to have user login and register functionality and store all the post data in it.
- System prompt must explicitly instruct the AI to stay within wellness coaching 
  scope only — no medical advice.
- All mood/journal data is session-only unless user explicitly saves it.
- Add a visible "This is not a substitute for professional help" disclaimer in the UI.