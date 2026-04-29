# SmartQR — Developer Documentation Implementation Plan

This document describes **what** you can document for the whole SmartQR project, **how** it fits the existing `smart-qr-dev-doc` Angular app, and a **phased, step-by-step plan** to build it out.

---

## 1. Current state (baseline)

### 1.1 Repository layout relevant to documentation

| Area | Path | Role |
|------|------|------|
| **Product UI** | `Smart_QR_UI/` | Main Smart QR Angular application (QR types, viewers, admin, loyalty, shops, auth, analytics, etc.) |
| **Developer docs site** | `smart-qr-dev-doc/` | Angular 21 standalone app: login, layout, search, domain-driven content from `src/assets/content/` |

The dev-doc site already supports:

- **Domain catalog** via `assets/content/domains.json` and per-domain folders (`<slug>/`) with `index.json`, `features.json`, `api-reference.json`, `qa.json`, and optional Markdown files loaded by `ContentService`.
- **Global search** built from those JSON sources (`buildSearchIndex()`).
- **Static doc sections** (routes in `app.routes.ts`): Welcome, Smart HR design pages, Smart HR Case, PenTest findings (with Markdown under `assets/content/pentest/`), How-to-doc.

### 1.2 Gap to close

`domains.json` today includes **HR-related domains** and **Smart QR product domains**. The **Smart QR product surface** in `Smart_QR_UI` (QR code types, wizards, viewers, loyalty, shops, admin QR configuration, email templates, etc.) should be documented as first-class domains with the same JSON + Markdown pattern.

---

## 2. What you can implement in developer documentation

Use the list below as a **table of contents** for “whole project” coverage. Prioritize by audience (new hire vs. integrator vs. security reviewer).

### 2.1 Project fundamentals

- **Vision and scope** — What SmartQR is, primary users (tenant admins, end customers scanning QR), and boundaries vs. other products (e.g. Smart HR).
- **Repository map** — `Smart_QR_UI` vs. `smart-qr-dev-doc`; where configs live (`environments`, `angular.json`).
- **Versioning and branches** — How release branches align with deployments (align with your Git workflow).
- **Glossary** — QR type, tenant, registration, loyalty program, viewer vs. editor routes, etc.

### 2.2 Getting started (local development)

- **Prerequisites** — Node/npm versions, Angular CLI, any global tools.
- **Install and run** — `npm install`, `ng serve` for `Smart_QR_UI` and `smart-qr-dev-doc`.
- **Environment configuration** — API base URLs, feature flags, mock vs. real backend (document each `environment.ts` file you use).
- **Troubleshooting** — CORS, SSL, common build errors, port conflicts.

### 2.3 Architecture and technical design

- **High-level architecture** — Browser app → API → persistence (adapt to your actual backend; if the API lives in another repo, link or submodule it here).
- **Angular application structure** (`Smart_QR_UI`)
  - `app.module` / routing entry and lazy vs. eager patterns you use.
  - Feature areas: `pages/systematic/modules/qr-code-list`, `admin`, `auth`, `analytics`, `settings`, etc.
- **Routing map** — Summarize major route groups (from `app-routing.module.ts`): QR types, edit flows, viewers, admin, loyalty, landings.
- **State and data flow** — Services (`services/`), HTTP interceptors, guards (`AuthGuard`, `AdminGuard`), how tokens or sessions are handled.
- **Shared UI** — `shared/` components and when to reuse them.
- **Styling** — Global styles (`styles.scss`), theming, BEM or other conventions.

### 2.4 Smart QR product — functional developer guides

Map documentation to **routes and folders** in `Smart_QR_UI` so developers can jump from doc to code.

| Topic | Suggested doc focus |
|--------|---------------------|
| **Authentication** | Login, forgot/set password, guards, session expiry |
| **QR code types & wizards** | Website, v-card, image gallery, menu, event, service feedback, loyalty, content — step-one/step-two flows and data models |
| **Viewers** | Public or semi-public viewers: menu, gallery, website, event, loyalty, content, feedback, v-card |
| **QR list & management** | `QrCodesComponent`, filters, tabs (e.g. products, orders, guests) |
| **Loyalty** | Registration detail, report demo, dashboard routes; link to in-repo Markdown such as `LOYALTY_*.md` where applicable |
| **Shops configuration** | Shops, categories, products, locations, maps |
| **Landings** | Per-QR-type landing components under `qr-codes-landing` |
| **Admin** | Users, roles, QR admin, email configuration, system settings |
| **Analytics** | Metrics surfaced in `AnalyticsComponent` and related services |

### 2.5 API and integration documentation

- **REST (or GraphQL) catalog** — Paths, methods, auth scheme, request/response shapes, error codes.
- **Pagination and filtering** conventions.
- **Webhooks or callbacks** (if any).
- **File uploads** — Validation, size limits, storage (ties to PenTest items if applicable).
- **OpenAPI/Swagger** — If the backend publishes a spec, embed a link or generate a static export into `assets/content/`.

*Note:* The dev-doc `api-reference.json` per domain is the natural place to host endpoint lists for search and domain pages.

### 2.6 Data model and business rules

- Entity relationship overview (QR code, type, content payload, user, role, loyalty registration, shop, product, etc.).
- Validation rules that span UI and API.
- Idempotency and concurrency (e.g. editing the same QR from two tabs).

### 2.7 Operations and quality

- **Build and deploy** — `ng build --configuration production`, artifact output, hosting (IIS, nginx, CDN).
- **CI/CD** — Pipeline stages, branch policies, required checks.
- **Observability** — Logging, client error reporting, correlation IDs.
- **Testing** — Unit (Karma/Jest/Vitest per project), e2e strategy, critical user journeys to automate.

### 2.8 Security and compliance

- **Threat model** (short): public viewers vs. authenticated admin surfaces.
- **PenTest remediation** — You already have PenTest routes and Markdown fix plans under `assets/content/pentest/`; keep this as the living index and link to secure coding guidelines.
- **Secrets** — Never commit credentials; where to store them in deployment.

### 2.9 Contributing and documentation hygiene

- Branch naming, PR checklist, code review expectations.
- How to **add a new documentation domain** (see Section 4).
- Style guide for internal Markdown (headings, code blocks, diagrams).

---

## 3. Information architecture (recommended site map)

Align the **sidebar** and **domains** with product reality:

1. **Home / Welcome** — Onboarding links and “start here” diagram.
2. **Smart QR (product)** — *New top-level section or new domains in `domains.json`*  
   - Architecture  
   - Getting started  
   - QR types & wizards  
   - Viewers & public surfaces  
   - Loyalty & shops  
   - Admin & configuration  
3. **Cross-cutting / Shared patterns** — Document shared UI/engineering patterns inside the most relevant domain pages and/or Deep Dives.
4. **HR / legacy domains** — Keep `employee`, `attendance`, `payroll`, etc., if they remain part of the same program; otherwise mark as “related product” to avoid confusion.
5. **Security** — PenTest index + secure development practices.
6. **Search** — Already powered by JSON index; extend as you add domains.

*Optional:* Add a **“Smart QR”** hub page (new component + route) that does not duplicate `domains.json` but links into new slugs such as `smart-qr-core`, `smart-qr-loyalty`, `smart-qr-admin`.

---

## 4. How content is wired (for implementers)

### 4.1 Domain content pipeline

1. Add an entry to `src/assets/content/domains.json` (`slug`, `name`, `icon`, `description`, `order`).
2. Create `src/assets/content/<slug>/` with:
   - `index.json` — Overview metadata for the domain detail page.
   - `features.json` — Features list (titles, summaries, tags) for UI and search.
   - `api-reference.json` — Endpoints for API tab and search.
   - `qa.json` — FAQ-style Q&A for search and QA tab.
3. Optional: `.md` files; load via `ContentService.getMarkdownContent(slug, filename)`.
4. Ensure **domain list/detail routes** are reachable from navigation (`DomainListComponent` / `DomainDetailComponent` — add sidebar or welcome links if they are hidden today).

### 4.2 Static guides (Angular pages)

For long interactive tutorials or screenshots, add a **standalone component + route** (pattern already used for Smart HR and other static pages).

### 4.3 Search

Any new `features.json` / `api-reference.json` / `qa.json` content is picked up automatically when `SearchService` rebuilds the index (per existing `ContentService.buildSearchIndex()` behavior).

---

## 5. Step-by-step implementation plan

Execute in phases. Adjust durations to team size.

### Phase 0 — Discovery and ownership (1–3 days)

- [ ] Identify all **deployable artifacts** (UI only vs. API repos, mobile apps, etc.).
- [ ] List **environments** (dev, staging, prod) and who owns credentials.
- [ ] Walk `Smart_QR_UI` routing and produce a **one-page route map** (spreadsheet or Markdown).
- [ ] Decide whether HR domains in `domains.json` are **in scope** for “SmartQR” branding or should be renamed/sectioned.

**Deliverable:** Short “source of truth” outline agreed with tech lead.

### Phase 1 — Foundation docs in the dev-doc app (3–7 days)

- [x] Rewrite **Welcome** content: purpose of the site, links to Getting Started + Architecture + Smart QR hub.
- [x] Add **Getting Started** (new page or Markdown): clone, install, run both apps, environment variables.
- [x] Add **Architecture overview** with a simple diagram (C4 container level or equivalent).
- [x] Expose **Domains** in the sidebar or welcome so `domains.json` entries are discoverable.
- [x] Document **how to log in** to the dev-doc app (`users.json` / `AuthService` behavior).

**Deliverable:** A new developer can run the UI and find architecture without asking the team.

### Phase 2 — Smart QR product domains (1–3 weeks)

For each major slice of `Smart_QR_UI`, add a `domains.json` entry and fill JSON/Markdown incrementally.

Suggested slug breakdown (example):

| Slug | Content focus |
|------|----------------|
| `smart-qr-auth` | Auth flows, guards, password reset |
| `smart-qr-types` | Wizards by QR type, shared step patterns |
| `smart-qr-viewers` | Viewer components, routing, public vs. protected |
| `smart-qr-loyalty` | Loyalty registration, reports, dashboards |
| `smart-qr-shops` | Shops configuration modules |
| `smart-qr-admin` | Users, roles, QR admin, email, system settings |

**Per slug, minimum viable content:**

- [x] `index.json` with a clear summary and “key files” paths.
- [x] 5–15 `features.json` entries with tags for search.
- [x] `api-reference.json` populated from backend spec or reverse-engineered from `*.service.ts` calls.
- [x] 3–10 `qa.json` entries for frequent questions.

**Deliverable:** Search returns useful hits for “loyalty”, “menu viewer”, “AdminGuard”, etc.

**Implemented (2026-04-01):** Six domains — `smart-qr-auth`, `smart-qr-types`, `smart-qr-viewers`, `smart-qr-loyalty`, `smart-qr-shops`, `smart-qr-admin` — registered in `domains.json` with full JSON packs. Domain detail page shows optional `summary` and `keyFiles` from `index.json`.

### Phase 3 — Deep dives and diagrams (ongoing, 2–4 weeks parallel to Phase 2)

- [x] Sequence diagrams for: create QR → save → publish → scan → viewer.
- [x] Data flow for **loyalty registration** and **menu ordering** (if applicable).
- [x] Component hierarchy for the largest screens (one per major feature).
- [x] Copy or link in-repo engineer notes (e.g. existing `LOYALTY_*.md`, `LOGIC.md`) into the doc site or summarize them in domain Markdown.

**Implemented (2026-04-01):** Added `deep-dives.component.ts` with sequence and data-flow diagrams, component hierarchies (menu + loyalty), and linked source notes from `LOYALTY_MAIN_DASHBOARD.md` and `LOGIC.md`. Route: `/deep-dives`; accessible from sidebar and Smart QR hub.

**Deliverable:** Onboarding time measurably reduced (survey or anecdotal).

### Phase 4 — API truth source (1–2 weeks)

- [x] If OpenAPI exists: publish or import; otherwise maintain `api-reference.json` from a single maintained list.
- [x] Document **auth** (Bearer, cookies, CSRF) consistently across all endpoint descriptions.
- [x] Add **error catalog** (HTTP status + business error codes).

**Implemented (2026-04-01):** Added centralized API reference file `src/assets/content/api/master-api-reference.json` and new page `api-truth-source.component.ts` (route `/api-truth-source`) documenting source strategy (OpenAPI import/manual), unified auth conventions (Bearer/cookie+CSRF/public), and shared error catalog (HTTP + business codes). Linked from sidebar and Smart QR hub.

**Deliverable:** Frontend and backend developers share one endpoint reference.

### Phase 5 — Ops, testing, and security (1–2 weeks)

- [ ] Build/deploy runbook; rollback steps.
- [ ] Testing strategy page; list critical paths for manual regression.
- [ ] PenTest index page links every bug doc under `assets/content/pentest/` and status (open/fixed/verified).
- [ ] “Secure coding” checklist derived from PenTest themes.

**Deliverable:** Release engineer and security reviewer can use the doc site without tribal knowledge.

### Phase 6 — Polish and maintenance (continuous)

- [ ] **Version badge** on Welcome (matches app release).
- [ ] **Last updated** dates on heavy pages.
- [ ] Quarterly **doc debt** pass: broken links, stale API paths, new routes in `Smart_QR_UI`.
- [ ] Optional: **dark mode**, **PDF export**, or **public vs. internal** build flags.

---

## 6. Success criteria

- A new **frontend developer** can run `Smart_QR_UI`, locate the module for a feature, and understand guards/services in **under one day** with only the doc site.
- An **integrator** can authenticate and call documented APIs without reading source code.
- **Security** findings and fixes are traceable from PenTest pages to code areas.
- **Search** in the dev-doc app returns relevant features, APIs, and Q&A for Smart QR terminology.

---

## 7. Quick reference — files to touch when extending docs

| Goal | Primary files |
|------|----------------|
| New doc domain | `src/assets/content/domains.json`, `src/assets/content/<slug>/*.json`, optional `.md` |
| New static page | New component under `src/app/pages/`, route in `app.routes.ts`, nav in `sidebar.component.ts` |
| Search behavior | `content.service.ts` (index build), JSON content quality |
| Welcome / home copy | `welcome.component.ts` (and template if extracted) |

---

## 8. Summary

You can implement **full-stack developer documentation** for SmartQR by combining:

1. The **existing domain + JSON + Markdown + search** pipeline in `smart-qr-dev-doc`.
2. **New Smart QR–specific domains** aligned with `Smart_QR_UI` modules and routes.
3. **Static guides** for long-form tutorials.
4. **Operational, API, and security** sections tied to real artifacts (OpenAPI, PenTest Markdown, deployment process).

Follow **Phases 0–6** above for a practical rollout: first make navigation and onboarding solid, then add Smart QR domains and API depth, then ops and security, then continuous maintenance.

---

*Document version: 1.0 — aligned with repository layout as of April 2026.*
