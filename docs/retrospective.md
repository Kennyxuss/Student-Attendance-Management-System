# SAMS - Final Project Retrospective (Week 12)

**Date:** October 2026  
**Format:** Blameless Team Retro

## 🌟 What went well?
- **Architecture:** Decoupling the frontend (Vanilla JS + Fetch) from the backend (Python Custom Router + Thin Controllers) was a massive success. It made it incredibly easy to test backend logic independently.
- **AI as a Pair Programmer:** Using AI to scaffold the initial UI layouts, CSS, and repetitive test suites saved us weeks of manual typing. It allowed us to focus on the actual logic and data flow.
- **Unified Feedback System:** Building a centralized `showToast()` and standardizing the API response format (`{status, data, error, field}`) made error handling predictable and clean.

## 📉 What didn't go so well?
- **Async State Management:** In Week 6/7, we originally tried caching state locally and ran into synchronization issues. Moving to a strict "mutate via fetch, then reload from server" approach fixed it, but cost us time.
- **Trusting AI Code Blindly:** In Week 9/10, we discovered that the AI-generated DOM rendering was vulnerable to XSS (`innerHTML`), and backend validations were missing edge cases (Empty batches). We learned the hard way that AI code *must* be audited.

## 💡 Concrete Lessons Learned
1. **Validation goes at the boundary.** Using `guards.py` directly inside the Router ensures that bad data never even reaches our Controllers or Repository.
2. **Feature Freezes are critical.** Stopping feature development in Week 10 to just *break* the app revealed UX flaws we would have missed if we kept coding up until the deadline.
3. **AI amplifies, it doesn't replace.** AI was amazing for velocity, but it doesn't know our specific security requirements or edge cases. Human review is the final safety net.
