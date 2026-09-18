## Project

This is a modern portfolio website built with:

* React
* Vite
* TypeScript
* React Router DOM
* Tailwind CSS 4
* ESLint
* Prettier
* pnpm

The project is a production-quality personal portfolio. Code should be clean, maintainable, accessible, performant, responsive, and easy to extend.

---

## Core Principles

When modifying the project:

1. Prefer simple, readable solutions over clever abstractions.
2. Follow existing project conventions before introducing new ones.
3. Reuse existing components, utilities, styles, and patterns.
4. Do not introduce unnecessary dependencies.
5. Keep components small and focused.
6. Avoid premature abstraction.
7. Do not duplicate logic when a clear reusable abstraction already exists.
8. Keep TypeScript strict and avoid unsafe types.
9. Do not leave dead code, unused imports, commented-out code, or temporary debugging statements.
10. Preserve existing functionality unless the task explicitly requires changing it.

---

## Package Manager

**pnpm is mandatory.**

Never use:

* npm
* yarn
* bun

Use pnpm for all dependency and script operations.

Examples:

```bash
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm remove <package>
pnpm dev
pnpm build
pnpm lint
pnpm format
```

Do not generate or modify `package-lock.json` or `yarn.lock`.

The repository should use only the lockfile appropriate for pnpm:

```text
pnpm-lock.yaml
```

---

## Before Making Changes

Before implementing a non-trivial change:

1. Inspect the existing project structure.
2. Read relevant components, routes, styles, and configuration.
3. Check `package.json` for available scripts and dependencies.
4. Reuse existing patterns whenever possible.
5. Do not rewrite unrelated code.

If the existing implementation already solves the problem correctly, prefer a minimal change.

---

## TypeScript

Use TypeScript throughout the application.

### Required

* Prefer explicit, meaningful types.
* Let TypeScript infer types when inference is obvious.
* Use `interface` or `type` consistently with the surrounding codebase.
* Use discriminated unions where they improve correctness.
* Prefer `unknown` over `any`.
* Avoid type assertions unless they are genuinely necessary.
* Do not suppress TypeScript errors without a documented reason.

### Forbidden

Do not introduce:

```ts
any
```

unless there is no reasonable alternative.

Avoid:

```ts
// @ts-ignore
// @ts-nocheck
```

Do not use them merely to silence errors.

---

## React

Use modern React patterns.

### Components

* Prefer functional components.
* Keep components focused on one responsibility.
* Extract reusable UI when it is genuinely reused.
* Avoid creating abstractions for one-off code without a clear benefit.
* Keep business logic separate from presentation when complexity warrants it.

### Hooks

* Follow the Rules of Hooks.
* Keep dependency arrays correct.
* Do not disable React hook lint rules just to make code pass.
* Avoid unnecessary `useEffect`.
* Prefer derived values over synchronizing state with effects.
* Do not use state when a value can be calculated directly from props or existing state.

Before adding `useEffect`, ask whether the same result can be achieved through:

* derived values
* event handlers
* React Router state
* props
* component composition

### State

Use the simplest state solution that fits the problem.

Do not introduce a global state library unless the project actually needs one.

---

## React Router DOM

Use React Router DOM for application routing.

* Keep route definitions centralized and understandable.
* Use nested routes where they make the application structure clearer.
* Use route parameters instead of manually parsing URLs.
* Use navigation APIs provided by React Router.
* Do not manipulate browser history directly unless there is a specific reason.
* Use `<Link>` / `<NavLink>` for internal navigation instead of plain `<a>` elements.
* Preserve accessible navigation semantics.
* Handle unknown routes with a proper `404` page.
* Avoid unnecessary route-level complexity.

For internal navigation:

```tsx
<Link to="/projects">Projects</Link>
```

Do not use:

```tsx
<a href="/projects">Projects</a>
```

unless a full document navigation is intentionally required.

---

## Tailwind CSS 4

Use Tailwind CSS 4 according to the project's existing configuration and conventions.

Prefer utility classes for component styling.

Keep styles:

* consistent
* responsive
* composable
* readable

Avoid excessive arbitrary values:

```tsx
<div className="mt-[13px]">
```

when a standard Tailwind utility is appropriate.

Do not create custom CSS for something Tailwind already handles well.

Use custom CSS when it provides a real benefit, such as:

* complex animations
* third-party integration
* pseudo-elements that are awkward in utilities
* complex selectors
* reusable design-system primitives
* browser-specific behavior

Do not recreate the Tailwind 3 configuration approach unnecessarily. Tailwind CSS 4 uses its modern CSS-first configuration model.

Keep the design system consistent:

* spacing
* typography
* colors
* radii
* shadows
* breakpoints
* motion

Do not introduce random values that make the UI visually inconsistent.

---

## Responsive Design

The portfolio must work well on:

* mobile
* tablet
* desktop
* large desktop screens

Use a mobile-first approach.

Do not design exclusively for a single viewport.

Check for:

* horizontal overflow
* broken navigation
* unreadable typography
* oversized headings
* buttons that are difficult to tap
* overflowing code/text
* layout shifts
* inaccessible mobile menus

---

## Accessibility

Accessibility is mandatory.

Use semantic HTML:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

Prefer native HTML elements over custom behavior.

Examples:

* use `<button>` for actions
* use `<a>` / `<Link>` for navigation
* use headings in a logical hierarchy
* use labels for form controls

Images must have meaningful `alt` text when informative.

Decorative images should use:

```html
alt=""
```

Interactive elements must be keyboard accessible.

Do not remove focus indicators unless an accessible replacement is provided.

Respect:

* keyboard navigation
* focus management
* reduced motion preferences
* sufficient color contrast
* semantic landmarks
* screen reader usability

Never use a `<div>` as a button when a `<button>` is appropriate.

---

## SEO

This is a portfolio website, so SEO matters.

Each important route should have appropriate:

* `<title>`
* meta description
* canonical URL where applicable
* Open Graph metadata where applicable
* meaningful headings
* semantic HTML

Use descriptive page titles.

Avoid generic titles such as:

```text
Home
Page
Website
```

Prefer something meaningful, for example:

```text
John Doe — Frontend Developer
```

Do not add fake or misleading SEO content.

Do not keyword-stuff text.

---

## Performance

Keep the portfolio fast.

Prefer:

* optimized images
* modern image formats when appropriate
* lazy loading for below-the-fold images
* responsive images where useful
* code splitting for genuinely large route-level features
* minimal JavaScript
* CSS-first solutions where appropriate

Avoid unnecessary:

* dependencies
* client-side state
* effects
* re-renders
* large libraries for trivial functionality
* animations that hurt performance

Do not optimize prematurely. Measure or identify a real problem before introducing complexity.

---

## Images and Assets

Do not commit unnecessarily large assets.

Before adding an image:

1. Check its dimensions.
2. Check its file size.
3. Use an appropriate format.
4. Consider whether it needs to be loaded immediately.

Use descriptive filenames.

Avoid:

```text
image1.png
final-final-2.jpg
test.png
```

Prefer:

```text
project-dashboard.webp
profile-photo.webp
github-mark.svg
```

---

## UI / UX

This is a portfolio, so visual quality matters.

Maintain a consistent:

* spacing system
* typography scale
* color palette
* border radius
* shadow system
* interaction pattern
* animation language

Avoid:

* excessive gradients
* unnecessary animations
* visual clutter
* inconsistent spacing
* random component styles
* excessive rounded cards
* excessive use of glassmorphism
* decorative elements that reduce readability

Animations should communicate state or enhance interaction, not exist merely for decoration.

Prefer subtle transitions.

Respect:

```css
prefers-reduced-motion
```

when implementing significant motion.

---

## Content

Portfolio content should be:

* concise
* professional
* easy to scan
* specific
* truthful

Do not invent:

* work experience
* clients
* projects
* technologies
* metrics
* achievements
* testimonials

If content is unknown, use an explicit placeholder rather than fabricated information.

---

## Components

Before creating a new component:

1. Search for an existing component that can be reused.
2. Check whether an existing component can be extended cleanly.
3. Create a new component only when it has a meaningful responsibility.

Avoid giant components.

If a component becomes difficult to understand, consider extracting:

* presentational components
* data/configuration
* hooks
* utility functions

Do not split every small element into a separate component just for the sake of abstraction.

---

## File Organization

Follow the existing project structure.

Prefer grouping files by feature or responsibility rather than creating a large collection of unrelated global folders.

Keep:

* components
* pages/routes
* hooks
* utilities
* assets
* types

organized and predictable.

Do not move large parts of the project unless required by the task.

---

## Naming

Use descriptive names.

Components:

```text
ProjectCard
Navigation
ContactSection
ExperienceTimeline
```

Hooks:

```text
useTheme
useMediaQuery
```

Utilities:

```text
formatDate
cn
getProjectUrl
```

Avoid meaningless names:

```text
Thing
Component1
Helper
Data2
Stuff
```

---

## ESLint

ESLint must pass before a task is considered complete.

Run:

```bash
pnpm lint
```

Fix the underlying issue instead of disabling the rule.

Do not add:

```ts
// eslint-disable
```

unless there is a legitimate, documented exception.

Never weaken the project's ESLint configuration just to make existing code pass.

If a new rule is required, make sure it is compatible with the existing project architecture.

---

## Prettier

Prettier is the source of truth for code formatting.

Run:

```bash
pnpm format
```

or, if the project exposes a check script:

```bash
pnpm format:check
```

Do not manually fight Prettier's formatting.

Do not introduce personal formatting preferences that conflict with the repository configuration.

Keep formatting changes separate from unrelated functional changes when possible.

---

## Validation

Before declaring a task complete, run the relevant checks.

At minimum:

```bash
pnpm lint
pnpm format
pnpm build
```

If the project provides a type-check script, also run:

```bash
pnpm typecheck
```

If tests exist, run:

```bash
pnpm test
```

If there is a dedicated CI/check command, prefer running it as well.

### Expected result

The final implementation should:

* compile successfully
* pass ESLint
* be formatted with Prettier
* pass TypeScript checks
* pass tests when available
* produce a successful production build

Do not claim that checks passed unless they were actually executed.

If a check cannot be executed, explicitly state that it was not run.

---

## Build Safety

Do not introduce code that works only in development.

Always consider the production build:

```bash
pnpm build
```

Pay attention to:

* environment variables
* asset paths
* client-side routing
* dynamic imports
* browser-only APIs
* production-only errors

Do not access browser APIs during module initialization unless the environment guarantees a browser.

---

## Environment Variables

Never commit secrets.

Do not put:

* API keys
* private tokens
* passwords
* credentials
* private URLs

into source code.

For Vite client-side environment variables, remember that variables exposed to the client are not secret.

Only variables intentionally prefixed for client exposure should be used in browser code.

---

## Dependencies

Before adding a dependency:

1. Check whether the functionality can be implemented with existing tools.
2. Check whether the browser/platform already provides the functionality.
3. Consider bundle size and maintenance cost.
4. Check whether the project already has an equivalent dependency.

Do not add a library for trivial functionality.

After adding a dependency, use pnpm and ensure the lockfile is updated.

---

## Git Hygiene

Do not modify unrelated files.

Do not commit:

* `.env`
* secrets
* build output
* temporary files
* editor-specific junk
* debugging logs
* generated artifacts unless the repository intentionally tracks them

Keep changes focused.

Do not rewrite an entire file merely to change a few lines unless formatting or architecture genuinely requires it.

---

## Error Handling

Do not silently swallow errors.

Avoid:

```ts
try {
  ...
} catch {}
```

Handle errors intentionally.

For user-facing failures, provide an understandable UI state when appropriate.

Do not expose sensitive internal errors to users.

---

## Security

Never trust user-controlled input.

Avoid unsafe HTML injection.

Do not use `dangerouslySetInnerHTML` unless it is genuinely required and the content is trusted or properly sanitized.

Do not expose secrets through client-side code.

External links should be handled intentionally, especially when opening new tabs.

---

## Accessibility and UX Checklist

Before finishing UI work, verify:

* [ ] Keyboard navigation works.
* [ ] Focus states are visible.
* [ ] Interactive elements use semantic elements.
* [ ] Images have appropriate alt text.
* [ ] Headings have a logical hierarchy.
* [ ] Forms have labels.
* [ ] Mobile layout works.
* [ ] No horizontal overflow exists.
* [ ] Hover is not the only way to discover/use functionality.
* [ ] Reduced motion is respected where appropriate.
* [ ] Loading and error states are handled where needed.

---

## Final Checklist

Before considering the task complete:

### Code

* [ ] Implementation is simple and maintainable.
* [ ] Existing patterns were reused.
* [ ] No unnecessary dependencies were added.
* [ ] No dead code remains.
* [ ] No debugging statements remain.
* [ ] TypeScript is type-safe.
* [ ] React Hooks rules are respected.
* [ ] React Router DOM is used correctly.

### UI

* [ ] Responsive on mobile, tablet, and desktop.
* [ ] Accessible.
* [ ] Semantically correct HTML.
* [ ] Consistent with the existing design system.
* [ ] Animations are purposeful and restrained.
* [ ] No obvious layout shifts or overflow.

### Quality

Run:

```bash
pnpm lint
pnpm format
pnpm build
```

Also run when available:

```bash
pnpm typecheck
pnpm test
```

### Final response

When reporting completion:

1. Summarize what changed.
2. List important files/components changed.
3. Report validation commands that were actually executed.
4. Report any checks that could not be executed.
5. Mention any assumptions or follow-up work that remains.

Never state that the project is "fully tested" or "lint-free" unless the corresponding checks were actually run.
