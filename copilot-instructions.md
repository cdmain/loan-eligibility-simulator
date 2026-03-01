# Nova - Copilot Instructions

## Project Overview

Nova is a micro-frontend host application built with Vue 3, TypeScript, and Module Federation. In this repo is the main shell for the Nova platform, consuming remote modules and providing shared functionality.

## Tech Stack

- **Framework**: Vue 3.5 with Composition API (`<script setup>`)
- **Language**: TypeScript 5.9 (strict mode)
- **Build**: Rsbuild/Rslib with Module Federation
- **Styling**: Tailwind CSS 4 with PostCSS
- **Components**: Reka UI primitives + shadcn-vue patterns (prefix: `nc`)
- **State**: @tanstack/vue-store, VueUse
- **Validation**: Zod for runtime validation
- **Linting**: ESLint with @stylistic (no Prettier)

## Code Style Guidelines

### TypeScript

- Use `type` over `interface` for object shapes (interfaces for class contracts only)
- Prefer type inference; add explicit types when inference is insufficient
- Use `satisfies` for type checking without widening
- Use `as const` for literal types
- Avoid `any`; use `unknown` with type guards when type is truly unknown
- Prefer `type-only` imports: `import type { Foo } from './foo'`

### Vue Components

- Always use `<script setup lang="ts">` syntax
- Order: script → template → style
- Props: Use `defineProps<T>()` with TypeScript interfaces (inline `T` if possible)
- Emits: Use `defineEmits<T>()` with typed event signatures (inline `T` if possible)
- Models: Use `defineModel<T>()` for v-model bindings
- Expose only when necessary with `defineExpose()`

### Functions and Data

- Prefer named functions over `const` arrow functions for component-level functions and composables
- Prefer `computed()` over methods for derived state
- Prefer immutable operations:
  - Use spread operator or `Object.assign({}, ...)` instead of mutation
  - Use `Array.map/filter/reduce` over `forEach` with mutation
  - Use structured cloning or spread for object copies
- Avoid side effects in computed properties

### Refs and Reactivity

- Prefer `shallowRef` for objects/arrays that are replaced wholesale
- Use `ref` for primitives and objects with nested reactivity needs
- Use `computed` for derived values
- Avoid `reactive()` in most cases; prefer `ref` for explicit `.value` access

### Error Handling

- Return error states from functions rather than throwing when feasible
- Use Zod for input validation at boundaries
- Use discriminated unions for result types when appropriate

### Styling

- Use Tailwind utility classes exclusively
- Use `reka-ui` primitives for consistent design patterns
- Use CVA (class-variance-authority) for component variants
- Avoid inline styles

### File Organization

- Components: PascalCase (`MyComponent.vue`)
- Composables: camelCase with `use` prefix (`useAuth.ts`)
- Types: Colocate with implementation or in adjacent `.types.ts` file
- Keep files focused; split large components into smaller pieces

## Package Structure

```
apps/
  shell/           # Main host application
  proxy-server/    # Dev API proxy
  documentation-site/
packages/
  components-vue/  # Shared Vue components (nc prefix)
  shared/          # Runtime shared utilities
  common/          # Build-time shared config
  eslint-config/   # Shared ESLint configuration
```

## Do Not

- Do not use Prettier (we use ESLint Stylistic)
- Do not use `interface` for simple object types
- Do not use `reactive()` without good reason
- Do not mutate props or state directly
- Do not use `any` type
- Do not create global state outside of proper state management
- Do not use CSS modules or scoped styles (use Tailwind)

