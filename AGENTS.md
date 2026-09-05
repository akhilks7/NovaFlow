<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Standards: Lean, Fast, Best-Architecture

This project is a Next.js 16 (App Router) + Supabase app. All work MUST follow these rules. They are mandatory on every task.

## Architecture requirements
- Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. This Next.js version has breaking changes vs. this agent's training data.
- Follow App Router conventions: route files minimal/thin; logic in small, single-responsibility modules under `src/`; reuse existing `src/utils/supabase/` patterns — no parallel setups.
- Server Components / Server Actions by default. Client `"use client"` only when genuinely required (interactivity, hooks, browser-only APIs).
- Plan the structure before coding; name files/exports by their single responsibility.

## Mandatory cleanup after EVERY implementation (feature, fix, refactor)
Before the task is considered done, remove:
- Unused imports, variables, params, props, exports, types, and dead branches.
- Unused components, files, and modules no longer referenced anywhere.
- Commented-out code, scratch/throwaway files, placeholder scaffold.
- `console.log`, `debugger`, and temp instrumentation.
- When a new feature replaces an existing one (or a new design supersedes an old one), the superseded/old implementation must be fully deleted in the same task — no dead fallbacks, no kept-around "old versions".
- Dependencies in `package.json` that are no longer imported; do not add deps unless actually used.

## Size & performance focus (project is speed/size focused)
- Default to Server Components; use `next/dynamic`/`import()` for heavy client-only libs; avoid needless client state.
- Prefer built-in Next.js/react behaviors over extra libraries.
- Avoid unnecessary network calls; batch and dedupe where possible.
- Keep the final bundle small; nothing ships that isn't used.

## Verification before task completion
1. Scan the diff for leftover unused/dead code (imports, files, deps).
2. Run `npm run lint` — must pass clean.
3. Run `npm run build` — must pass (also typechecks).
4. Confirm no size/weight regressions were introduced.
