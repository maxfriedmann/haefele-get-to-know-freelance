# HÄFELE Angular App
A small storefront Angular PWA with product listing, product detail, cart and a freely
designed homepage, running against the public "Fake Store API".

> **Status:** This README starts as a decision log and is filled out as the
> implementation lands.

---

## Overview
I got the task to create a mini Angular PWA with a Product Listing Page (PLP), a Product Detail PAge (PDP), a cart and a homepage of my own design, using latest LTS Angular with SSR, NgRx/RxJS and a basic key-value i18n.


### Getting started

```bash
npm install               # install dependencies
npm start                 # dev server
npm run build             # build the app
npm test                  # execute unit tests
npm run serve:ssr:shop    # run ssr node process (build first!!!)
```


### Decisions

#### Tech Stack
| Concern          | Choice                          | Comments                                                                                  |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| UI Framework     | Angular 21                      | not v22 as its just about to get released                                                 |
| Change detection | Zoneless                        | Angular 21 default, but differs from Intershop PWA                                        |
| Language         | TypeScript 5                    | not 6 as v5 is Angulars default                                                           |
| State            | NgRx 18 + RxJS 7                | NgRx with RxJS, not signals, to stay closer to Intershop                                  |
| i18n             | ngx-translate (+ http-loader)   | latest compatible with v21                                                                |
| PWA              | `@angular/pwa` service worker   | -                                                                                         |
| Styling          | Tailwind CSS                    | Intershop uses Bootstrap, I chose Tailwind cause its faster for me to bootstrap a project |
| Tests            | Vitest (unit), Playwright (e2e) | -                                                                                         |


##### Comparison to Intershop PWA Tech Stack

#### Zoneless

#### Standalone Components

#### Functional NgRx???

#### Intershop Project Layout???

#### I18N

#### Assumptions & Trade-Offs

### What I would improve with more time / "in production"
- I would use the project's 
  - branching model
  - commit message conventions
  - linter
- I would prefer tab indentation
- Optimize for mobile devices
- would handle loading i18n files differently
- I would not use classes if I can avoid it (e.g. ProductService). functions are tree-shakable
- I would not use RxJS, especially not Observables for http calls
- treat currency based on the selected language / ICM store
- add a breadcrumb navigation


---
## Internal Checklist

### Foundation & tooling
- [x] bootstrap Angular app (zoneless, standalone, with SSR)
- [x] add Tailwind CSS + daisyUI styling
- [x] add Biome, Vitest, Playwright
- [x] add PWA service worker + webmanifest via @angular/pwa
- [x] add basic routing for home, products, cart etc.pp.

### Internationalization (i18n)
- [x] add ngx-translate with some first translations (en + de for now)
- [x] basic language chooser with some persistence + playwright test?

### NgRx store (hybrid: Intershop facades + modern `createFeature`/functional effects)
- [x] create ProductService that does GET /products (and GET /products/:id ???)
- [ ] ngrx setup, register `provideStore` / `provideEffects` in `app.config.ts`
- [ ] products feature: `createActionGroup` actions, `createFeature` reducer+selectors, functional effects, `@ngrx/entity` adapter
- [ ] add loading + error state for products
- [ ] create ProductsFacade which the components will consume
- [ ] cart feature: actions, `createFeature`, functional effects (GET/POST/PUT/DELETE)? possible with fakestoreapi.com?
- [ ] cart loading + error state, keep all cart state in NgRx only
- [ ] add CartFacade
- [ ] avoid duplicate api calls (skip re-fetch when already loaded)

### Pages
- [x] PLP `/products`: show title, price, image, category + client-side filter + sort, loading & error ui
- [x] PDP `/product/:id`: SSR-rendered, all the fields, handle invalid/missing id (heads up: api returns empty 200, not 404!)
- [ ] cart `/cart`: add/update/remove via effects, use all of GET/POST/PUT/DELETE, error handling
- [x] homepage `/`: own design (category overview + featured, reusing the product data) + note down the why

### SSR (automatic HttpClient transfer cache)
- [x] provideClientHydration with `withHttpTransferCacheOptions` so server responses replay on the client
- [ ] check product/PDP data is already in the initial html
- [ ] check there's no double-fetch after hydration (network tab)
- [ ] `isPlatformBrowser` / `isPlatformServer` guards where needed (e.g. localStorage)

### Tests
- [ ] unit tests (vitest) for reducers, selectors, effects, facades
- [ ] e2e (playwright) for the PLP -> PDP -> cart flow

### Documentation (README)
- [ ] project overview, tech stack, app structure
- [ ] ngrx design decisions (why facades + feature folders)
- [ ] SSR strategy
- [ ] i18n approach
- [ ] homepage design rationale
- [ ] assumptions & trade-offs
- [ ] what i'd improve with more time
- [ ] fix tech-stack table: ngrx is 21, not 18

### Submission
- [ ] working SSR prod build (`npm run build` + `npm run serve:ssr:shop`)
- [x] clean, meaningful commit history
- [ ] recorded walkthrough (<= 3 min)
- [ ] public repo url + run/test instructions in README
