# Oriol Valls — Portfolio

A bilingual, static Astro portfolio for technical support, application support, IT operations, and client operations roles.

## Local development

Requires Node.js 22.12 or newer. The Pages workflow uses Node.js 24.

```sh
npm install
npm run dev
```

## Build and review

```sh
npm run build
npm test
npm run preview
```

The English page is at `/oriol-portfolio/` and the Spanish page is at `/oriol-portfolio/es/` when served from GitHub Pages. The production output is written to `dist/`.

## GitHub Pages

The portfolio is hosted at [ovallsn.github.io/oriol-portfolio](https://ovallsn.github.io/oriol-portfolio/), with a [Spanish version](https://ovallsn.github.io/oriol-portfolio/es/). GitHub Pages uses GitHub Actions as its source. The workflow uses Node 24 and publishes each push to `main`. It can also be started manually from the **Actions** tab.

## Fonts and third-party notices

Manrope is self-hosted from Google Fonts and distributed under the SIL Open Font License 1.1. The license is included at `src/assets/fonts/OFL-Manrope.txt`.

The social preview has a PNG export for broad platform support and an editable SVG source at `public/social-card.svg`.
