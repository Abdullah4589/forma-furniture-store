# FORMA — Considered furniture

A responsive furniture ecommerce concept, built with React, TypeScript, Vinext and accessible Radix/Shadcn primitives.

## Included
- Nineteen sample products across seating, tables, lighting and objects, with material, finish and dimension details.
- Dedicated collection pages and shareable individual product pages with related pieces.
- Category and price filters, sorting and live catalog search.
- Product dialogs, finish selection, quantities and saved pieces.
- Persistent browser shopping bag and wishlist with validated local storage.
- Delivery options and a clearly labelled demo checkout.
- Keyboard-accessible dialogs, mobile navigation and reduced-motion support.
- Device, light and dark appearance choices; device theme is the default, and the chosen mode is saved in this browser.
- WebMCP search and add-to-bag tools with input validation.

## Development
- Install: `npm run install:ci`
- Preview: `npm run dev`
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`
- Production build: `npm run build`

On Windows, if the system npm shim misresolves its path, invoke npm's installed JavaScript entry point directly with Node.

## Before accepting real orders
The storefront uses fictional catalog data in `lib/catalog.ts`. Payments, real inventory, tax calculation, order fulfillment and transaction emails are not connected. Demo checkout collects no payment information and creates no real order. Replace sample content with verified products and connect a commerce backend before a public commercial launch.

Cart and saved items are stored in this browser only. Product photos show the first finish; additional finishes demonstrate the option selector. Image credits and sources are in `ASSETS.md`.
