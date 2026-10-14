# QuickText

QuickText is a simple, privacy-focused text editor that allows you to quickly write, save, and share frequently used text snippets.

## Privacy First

Your privacy is our priority. QuickText:

- Stores all data locally in your browser using browser storage APIs
- Never transmits your content to any server
- Has zero tracking or analytics
- Works offline as a Progressive Web App (PWA)

All text snippets, templates, and placeholder values remain exclusively on your device, ensuring complete privacy and data control.

## Lightweight & Fast

QuickText is designed with performance in mind:

- Minimal footprint (under 100KB uncompressed)
- Works offline after first load
- Optimized for mobile devices

The app starts up fast and responds quickly to user interaction, making it perfect for quickly capturing and retrieving text snippets when you need them.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

Use Node.js 22.22.2+ (22.x), 24.15.0+ (24.x), or 26+ with npm 10+.

TypeScript is kept on 6.0.3 because the current stable Vue type checker and
TypeScript ESLint tooling do not support TypeScript 7.

```sh
npm ci
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

`eslint.config.ts` configures TypeScript ESLint and the Vue parser directly,
retaining the recommended TypeScript and essential Vue rules without the
unpatched `braces` dependency pulled in by `@vue/eslint-config-typescript`.

### Run Cypress End-to-End Tests

Install Google Chrome, then run:

```sh
npm test
```

This starts the HTTPS development server and runs Cypress in headless Chrome.
Chrome replaces Cypress's deprecated Electron test browser. To use another
browser or a custom Chrome executable with an already running development server:

```sh
npm run cy:run -- --browser /path/to/chrome
```

To type-check the Cypress tests:

```sh
npx tsc --noEmit -p cypress/tsconfig.json
```
