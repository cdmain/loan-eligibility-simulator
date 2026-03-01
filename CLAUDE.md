# Nova Module Agent Instructions

## Architecture

This is a Nova micro-frontend module built with Vue 3, TypeScript, and Module Federation. It exposes a federated app consumed by the Nova shell.

```
root/
├── host/           # Shell app + shared packages
│   └── packages/   # components-vue, shared, common, tsconfig
└── module/         # The MF module (exposes ./entry + ./interface)
```

### Tech Stack

- **Framework**: Vue 3.5 with Composition API (`<script setup>`)
- **Language**: TypeScript 5.9 (strict mode)
- **Build**: Rsbuild with Module Federation
- **Styling**: Tailwind CSS 4 with PostCSS
- **Components**: Reka UI primitives + shadcn-vue patterns (`@nova/components-vue`)
- **State**: @tanstack/vue-store, VueUse
- **Data Fetching**: @tanstack/vue-query
- **Forms**: @tanstack/vue-form
- **Validation**: Zod
- **Linting**: ESLint with @stylistic (no Prettier)
- **Package Manager**: pnpm

### Principles

- **Presentational components** — props in, emits out. No routing, stores, or feature flags inside components. Pages orchestrate.
- **Colocate related code** — don't scatter related logic across distant directories.
- **Use what exists** — check `@nova/components-vue` before building custom UI; check VueUse before writing manual composables.

## Quick Reference

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm format       # Run ESLint (formatting)
pnpm type-check   # Run TypeScript type checking
```

## Do Not

- Use Prettier (we use ESLint Stylistic)
- Use `interface` for simple object types (use `type`)
- Use `reactive()` without good reason
- Use `any` type
- Use CSS modules or scoped styles
- Leave errors silent

## Error Handling

- Prefer `T | null` return types over empty defaults. Silent failures hide bugs.
- Throw errors for exceptional cases — they're easier to catch than empty returns.
- Log warnings for unhandled edge cases so they surface during development.
- Error messages shown to users should be clear and non-technical.

## Code Review

When reviewing code, apply the rules documented in:

- `.github/copilot-instructions.md` — Project overview, tech stack, and code review focus areas
- `.github/instructions/vue-typescript.instructions.md` — Detailed Vue and TypeScript patterns
- `.github/instructions/commits.instructions.md` — Commit message format and conventions
- `.github/instructions/pull-requests.instructions.md` — PR title, summary, and hygiene guidelines

These files are the single source of truth for code review standards. Consult them alongside the skills below when reviewing pull requests or suggesting improvements.

## Skills

Load the relevant skill when working in that area. Skills provide detailed patterns and guidance:

- `vue` — Composition API, reactivity, composables, template patterns
- `typescript` — Type safety, strict typing, generics, common pitfalls
- `tailwind` — Utility-first CSS, class composition, design tokens, responsive
- `component-design` — Component architecture, props/emits/slots, presentational design
- `api-patterns` — API design, data fetching with TanStack Query, error handling
- `zod` — Schema validation, transforms, boundary mapping
- `code-hygiene` — Naming conventions, code quality, PR readiness
- `git-workflow` — Git conventions and workflow
- `change-log` — Changelog management
- `pnpm` — Package manager patterns
- `nova-internal` — Nova platform internals
- `agent` — Agent configuration and self-improvement

## Library Documentation (External)

Libraries may not have dedicated skills. Use Context7 or fetch docs directly:

- <https://vuejs.org/llms.txt>
- <https://zod.dev/llms.txt>
- <https://tanstack.com/llms.txt>
- <https://rsbuild.rs/llms.txt>
- <https://rslib.rs/llms.txt>
- <https://rspack.rs/llms.txt>
- <https://vueuse.org/functions.html>
- <https://reka-ui.com/llms.txt>
- <https://shadcn-vue.com/llms.txt>
- <https://tailwindcss.com/>
- <https://pnpm.io/pnpm-cli>
- <https://module-federation.io/llms.txt>
- <https://storybook.js.org/docs>
- <https://www.typescriptlang.org/docs/>
- <https://eslint.vuejs.org/>
- <https://github.com/Wombosvideo/tw-animate-css/tree/main/docs>
- <https://lucide.dev/icons/>
- <https://module-federation.io/guide/start/index.html>
