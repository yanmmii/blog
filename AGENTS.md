# Repository Guidelines

## Project Structure & Module Organization
This repository hosts a Next.js 14 App Router project built in TypeScript. Page routes live under `src/app` with top-level segments such as `about`, `notes`, and `projects`; shared UI belongs in `src/components`. Global styles are defined in `src/app/globals.css`, with Tailwind settings in `tailwind.config.ts`. Markdown content for notes and project case studies lives in `_notes` and `_projects` respectively, using YAML front matter to drive metadata.

## Build, Test, and Development Commands
Run `npm install` once to sync dependencies. Use `npm run dev` for a hot-reloading development server, `npm run build` to produce an optimized Next.js bundle, and `npm run start` to serve the compiled output locally. `npm run lint` runs the Next.js ESLint preset and should be clean before every commit.

## Coding Style & Naming Conventions
Stick to TypeScript with 2-space indentation and semicolon-free modules, mirroring the existing files. Export React components as `PascalCase`, keep hooks in `camelCase`, and prefer `const` for module-level declarations. Tailwind utility classes belong inline on JSX elements; add new global styles only when utilities fall short. Let ESLint guide structure, and add type annotations for props and external data.

## Testing Guidelines
There is no dedicated test runner yet, so treat `npm run lint` as the minimum quality gate. When adding logic-heavy utilities, include colocated tests under `src/__tests__` or alongside the module using the `*.test.ts` or `*.test.tsx` suffix so future Jest integration is straightforward. Manual smoke tests of critical routes (`/`, `/notes/[slug]`, `/projects`) are expected before opening a pull request.

## Commit & Pull Request Guidelines
History currently follows concise, typed subject lines such as `Fix: Add .gitignore...`; continue using an imperative tone, prefixing with an optional type (`Feat`, `Fix`, `Docs`) when appropriate and keeping the subject under 72 characters. Separate unrelated changes into distinct commits. Pull requests must explain the intent, list major changes, link any tracking issue, and include screenshots or terminal output for UI or content updates. Mention any lint or manual checks performed to help reviewers.

## Content Authoring Tips
Create new note and project entries by copying an existing Markdown file in `_notes` or `_projects`, updating the front matter, and sticking to ISO dates (`YYYY-MM-DD`). Keep filenames slugified with lowercase words separated by hyphens, and avoid spaces so route generation remains predictable. Use fenced code blocks for examples and keep headings under level three to preserve layout spacing.
