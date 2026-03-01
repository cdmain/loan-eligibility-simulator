---
name: tailwind
description: Tailwind CSS utility-first patterns, class composition, design tokens, and responsive design guidelines
---

# Tailwind CSS

## No Redundant Defaults

Don't add Tailwind classes that are already the browser/Tailwind default:

```html
<!-- Bad - text-base is the default font size -->
<p class="text-base">Hello</p>

<!-- Good -->
<p>Hello</p>
```

## No Unnecessary Wrappers

Don't add `<div>` elements just to hold Tailwind classes when the child can take them directly:

```html
<!-- Bad -->
<div class="flex items-center">
  <MyComponent />
</div>

<!-- Good - if MyComponent accepts class -->
<MyComponent class="flex items-center" />
```

## No String Interpolation

Never use string interpolation or concatenation for Tailwind classes. It breaks static analysis and purging:

```ts
// Bad - PurgeCSS can't find these classes
const color = `text-${status === 'error' ? 'red' : 'green'}-500`

// Good - full class names are statically analyzable
const color = status === 'error' ? 'text-red-500' : 'text-green-500'
```

## Prefer Responsive Over Arbitrary

Avoid arbitrary values (`w-[347px]`) when responsive or standard utilities work:

```html
<!-- Bad -->
<div class="w-[347px]">

<!-- Good -->
<div class="w-full max-w-sm">
```

Use semantic width utilities when defined (`w-sidebar`, `max-w-content`).

## CSS for Formatting

Use CSS for visual formatting, not markup hacks:

```html
<!-- Bad - non-breaking spaces for alignment -->
<span>R&nbsp;1&nbsp;000.00</span>

<!-- Good - CSS handles formatting -->
<span class="tabular-nums">R 1 000.00</span>
```

## Spacing with Layout

Use Tailwind's gap, space-x, space-y for spacing between children. Don't use empty divs as spacers:

```html
<!-- Bad -->
<div>
  <Component />
  <div class="h-4" />
  <Component />
</div>

<!-- Good -->
<div class="flex flex-col gap-4">
  <Component />
  <Component />
</div>
```

## Dark Mode / Semantic Tokens

Prefer semantic color tokens so dark mode works automatically:

```html
<!-- Bad - breaks in dark mode -->
<div class="bg-white text-gray-900">
<span class="text-gray-500">

<!-- Good - adapts to theme -->
<div class="bg-surface text-foreground">
<span class="text-low-emphasis">
```

Common semantic tokens:

- `bg-surface`, `bg-surface-inverse` — backgrounds
- `text-foreground`, `text-low-emphasis`, `text-medium-emphasis` — text
- `text-on-primary`, `text-on-secondary` — text on colored backgrounds
- `bg-primary`, `bg-secondary`, `bg-error` — semantic colors

Don't add redundant `dark:` classes when semantic tokens already handle theming. Verify token names against the theme — names like `text-secondary-foreground` may actually be `text-on-secondary` in your token set.

If you have to use an arbitrary or non-semantic color value, always include a `dark:` variant with a desaturated counterpart:

```html
<!-- Bad - arbitrary color without dark mode consideration -->
<div class="bg-[#E8F4FD]">

<!-- Good - includes dark variant -->
<div class="bg-[#E8F4FD] dark:bg-[#1A2A3A]">
```

**Token validation**: Check Tailwind config or design system docs before using unfamiliar tokens. Non-existent tokens fail silently with no visual feedback.

> **Reference**: [Tailwind CSS docs](https://tailwindcss.com/docs/dark-mode)

## No `!important`

If you need `!important`, something is wrong with the specificity chain. Investigate the root cause rather than forcing the override.

## Zero Values

Don't add units to zero values in CSS:

```html
<!-- Bad -->
<div class="m-[0px]">

<!-- Good -->
<div class="m-0">
```
