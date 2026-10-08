# Task 9 – AI Code Review Documentation

## Project

**Student Attendance Management System**

## Role

**Board Lead – Demelyn Concepcion**

## Objective

The purpose of this Task 9 contribution is to help the team keep AI-assisted changes organized and reviewable before they are merged.

## Review Workflow

1. Identify a small feature or fix that needs to be reviewed.
2. Keep the related work connected to a GitHub Issue.
3. Review the AI-generated change for correctness, readability, consistency, security, and tests.
4. Record any discovered flaws in `docs/find-the-flaw.md`.
5. Leave at least one substantive review comment when reviewing a teammate's Pull Request.
6. Clearly distinguish blocking issues from non-blocking/nit comments.
7. Confirm that automated tests pass before the change is approved.
8. After review comments are addressed, the Pull Request can proceed according to the team's merge process.

## Review Questions

### Correctness
- Does the change perform the required function?
- Does it match the existing attendance-system workflow?
- Are attendance statuses, student records, classes, and other project data handled correctly?

### Readability and Consistency
- Does the code follow the project's existing naming and structure?
- Are unnecessary changes avoided?
- Is the implementation understandable to another team member?

### Validation and Edge Cases
- Are required inputs checked?
- What happens when a student, class, or attendance record does not exist?
- What happens when an input is empty, invalid, or duplicated?

### Error Handling
- Are expected failures handled?
- Are 404/500 responses handled where the project uses HTTP responses?
- Are exceptions prevented from silently breaking the application?

### Security
- Is user input handled safely?
- Are database operations protected from unsafe input?
- Does the change expose information that the user should not access?

### Testing
- Are relevant tests present?
- Do the automated tests pass?
- Was the changed behavior checked manually when appropriate?

## Review Comment Format

### Blocking
**Issue:** [Describe the problem clearly.]

**Why:** [Explain why it can cause incorrect behavior, security problems, or failed tests.]

**Suggested fix:** [Give a specific action the developer can take.]

### Non-blocking / Nit
**Suggestion:** [Small improvement that does not prevent the PR from being approved.]

## Positive Review

Reviewers should also mention something the code did well, such as:

> The change is focused and easy to follow, and the implementation is consistent with the existing project structure.

## Completion Criteria

- [ ] AI-generated change was reviewed
- [ ] At least one substantive review comment was provided
- [ ] Blocking issues were addressed
- [ ] `docs/find-the-flaw.md` was updated with actual findings
- [ ] Tests passed
- [ ] Pull Request is ready for team review/approval
