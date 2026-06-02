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