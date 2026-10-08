# Task 9 – Find the Flaw

## Purpose

This document records the review of AI-generated code for the Student Attendance Management System. The goal is to identify possible mistakes before code is approved or merged.

## Review Checklist

The AI-generated code was reviewed for:

- Correctness of the logic and expected behavior
- Readability and consistency with the existing project
- Input validation and missing edge cases
- Correct HTTP status codes, when applicable
- Proper handling of 404 and 500 errors, when applicable
- Unhandled exceptions and failure cases
- Use of real project methods, functions, variables, and database fields
- Security concerns such as unsafe input handling
- Tests or test coverage for the changed behavior

## Findings

| Area Reviewed | Finding | Why It Matters | Action |
|---|---|---|---|
| Validation | To be filled in after reviewing the assigned AI-generated snippet | Missing validation can allow invalid or unexpected input | Add appropriate validation if needed |
| Error Handling | To be filled in after reviewing the assigned AI-generated snippet | Unhandled errors can cause failed requests or unclear user feedback | Add proper error handling if needed |
| Project Consistency | To be filled in after reviewing the assigned AI-generated snippet | AI may assume methods, fields, or files that do not exist in the project | Verify against the actual codebase |
| Edge Cases | To be filled in after reviewing the assigned AI-generated snippet | Unchecked edge cases can cause incorrect attendance records or application errors | Add tests and handling for relevant cases |

## Review Decision

AI-generated code should not be accepted automatically. The reviewer must verify the code against the actual Student Attendance Management System and confirm that tests pass before approval.

## Reviewer Notes

- Blocking issues: ______________________________
- Non-blocking/nit comments: ____________________
- Positive observation: __________________________
- Tests checked: _________________________________
