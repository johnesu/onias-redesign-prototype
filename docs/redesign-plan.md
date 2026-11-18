# ONIAS Redesign Plan

**Deliverable:** `onias-redesign-prototype/` — an independent, frontend-only redesign of the public ONIAS job platform and candidate experience.
**Demo clock:** 15 November 2026.
**Languages:** Portuguese-first interface with a full PT/EN switch; fully bilingual job descriptions.

---

## 1. Goals

1. Make ONIAS feel like a **premium Telegram-native job platform**, not a management dashboard.
2. Make the **market data** usable: every statistic should lead to a filtered job list or a profile action.
3. Give candidates a **trustworthy visibility model** (company domains, never recruiter names) with privacy controls in context.
4. Keep the **candidate profile** recruiter-facing and the **résumé** print-ready, without inventing a file upload.
5. Ship a **credible bilingual prototype**: no dead buttons, no lorem ipsum, no fake backend claims, light and dark, 1440 → 360 px.
6. Preserve Brazilian product conventions (BRL, CLT/PJ/BTC, DDD, LGPD) while remaining readable in English.

### Non-goals

- Reimplementing authentication, persistence, billing or email.
- Replacing the production backend or database.
- Reproducing proprietary ONIAS assets, copy or exact layouts.
- Building the recruiter/management area, support center or account settings.
- Building a marketing site. This is the product surface.

---

## 2. Design principles

### A public product, not a control panel
The previous prototype drifted into a recruiter dashboard. This version removes the sidebar, the command palette and the management screens. Navigation is a public header; the home page leads with roles and market signals; candidate screens use the same shell.

### Data with a next step
Every metric has a verb: a skill opens a filtered job search, a region filters the list, a profile gap opens the editor, a viewer domain can be blocked. Insight without an action is decoration.

### Calm density
The interface is information-rich but quiet: soft neutral canvas, white cards, navy brand blocks, one professional blue accent and restrained borders. Chrome recedes; numbers, roles and companies lead.

### Honest simulation
Anything simulated says so. The Telegram application, the visibility email gate and the résumé export are labelled. Market screens repeat the fictional-data disclosure. No control pretends to reach a server.

### Privacy as a feature
Visibility is company-domain level by design. Blocking sits next to the viewer list and its consequence is explained. The product stores a LinkedIn URL and profile fields, never a CV file.

### Bilingual by construction
The interface locale is a cookie read on the server, so the first paint is correct. Job content is authored twice, not machine-translated. Charts read the locale from context and localise their own axes and tooltips.

### Mobile is a different composition
The header becomes a drawer, filters become a bottom sheet, KPI grids collapse to two columns and the résumé becomes a document that prints at A4.

---

## 3. Visual system

### Identity

- **Deep navy** `hsl(211 100% 10%)` — brand anchor, hero, dark blocks.
- **Professional blue** `hsl(212 100% 39%)` — primary actions, links, data emphasis.
- **Soft neutral canvas** `hsl(214 25% 97%)` — separates content from chrome.
- **White cards** with a hairline border and a very soft shadow.
- **Restrained accents**: success green, warning amber, danger red and six chart hues.
- **Inter** for interface text, **JetBrains Mono** for IDs, dates and metadata.

The result sits closer to Linear/Stripe/Notion than to a classic HR portal: precise typography, thin dividers, small radii and no decorative illustration.

### Tokens

All colours are HSL CSS variables in `src/app/globals.css`, consumed through Tailwind (`bg-card`, `text-muted-foreground`, `border-border`, `bg-accent`, …). Dark mode is a token remap, not a second stylesheet.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--canvas` | 214 25% 97% | 222 47% 5% | Page background |
| `--card` | 0 0% 100% | 221 40% 9% | Surfaces |
| `--foreground` | 222 47% 11% | 210 40% 96% | Primary text |
| `--muted-foreground` | 215 16% 45% | 215 20% 65% | Secondary text |
| `--primary` | 212 100% 39% | 213 94% 60% | Actions, links |
| `--navy` | 211 100% 10% | 222 47% 8% | Brand blocks |
| `--border` | 214 24% 91% | 217 30% 17% | Hairlines |
| `--success` | 160 84% 32% | 158 64% 52% | Positive signal |
| `--warning` | 32 95% 44% | 38 92% 60% | Attention |
| `--danger` | 0 72% 47% | 0 84% 65% | Destructive |

Radii: 12–14 px surfaces, 10 px controls, 8 px compact rows. Shadows: `shadow-card` for surfaces, `shadow-lift` for hover/dialog. Typography: 32–40 px page titles, 15 px card titles, 13.5 px body, 10–12 px metadata, uppercase eyebrows with 0.14em tracking.

### Components

Local shadcn-style primitives under `src/components/ui`:

- Button, Badge, Card, Input, Textarea, Label/Field, native Select, Tabs, Dialog, Sheet, Dropdown, Tooltip, Switch, Separator, Progress/RingProgress, Skeleton, EmptyState, Avatar, PageHeader/SectionHeading, StatCard, ChartCard.
- Radix powers dialogs, sheets, tabs, dropdowns, tooltips, switches and separators. Selects stay native for mobile accessibility.
- Charts are thin Recharts wrappers with shared tooltip, grid, axis and locale logic.
- Site components (`site-header`, `site-footer`, `site-search`, `job-card`, `jobs-view`, `apply-dialog`, `save-job-button`) are shared across routes.

### Motion

Motion is functional: 180–280 ms fade/zoom for overlays, 200 ms hover lifts, 500 ms progress transitions. No continuous decorative animation. Screenshots disable motion via `reducedMotion` and injected CSS.

---

## 4. Information architecture

Desktop: sticky 68 px public header with logo, “Vagas”, a statistics dropdown, “Meu perfil”, “Quem me viu”, PT/EN, theme and “Ver vagas”; content max-width 1200 px. No persistent sidebar.

Mobile: compact header with a primary action and a right-side drawer containing the full route list, language, theme and candidate shortcuts.

Routes:

```text
/                              Home
/vagas                         Job search
/vagas/[id]                    Job detail
/estatisticas/telegram         Telegram jobs
/estatisticas/oferta-demanda   Supply × demand
/estatisticas/curiosidades     Curiosities
/perfil                        Candidate profile
/perfil/criar                  Create profile wizard
/perfil/editar                 Profile editor
/curriculo                     Résumé preview
/quem-me-viu                   Who viewed me
```

Redirects preserve old management URLs (`/jobs`, `/market`, `/dashboard`, `/statistics`, `/recruitment`, `/support`, `/settings`, `/insights`, `/resume`, `/activity`, `/profile`) and point them at the new equivalents.

---

## 5. Screen decisions

### Home

- Navy hero with a plain-language promise, a search field and two trust statements: public source, fictional data.
- A “market pulse” card showing the highest-demand skill, demand index, sparkline, median salary, candidate pool and a featured role.
- Four headline KPIs, featured roles, the three statistics destinations, top skills, hiring companies and a five-step explanation of how a Telegram message becomes a role.
- Every card links to a real destination.

### Jobs

- Search by role, skill or company plus region, seniority, work model and saved-only filters.
- Sort by relevance, recency or salary. URL parameters (`q`, `regiao`, `senioridade`, `modelo`, `salvas`, `ordenar`) are kept in sync with `window.history.replaceState`.
- Job cards show company, salary, location, model, seniority, skills and posted time; save is inline.
- Active filters appear as removable chips; empty state offers a reset.
- Mobile filters open a bottom sheet with a result count and a “show results” action.
- Initial page shows eight roles with a “show more” control.

### Job detail

- Breadcrumb, title, company, salary, location, model, seniority, source channel and members.
- Summary, responsibilities, requirements and benefits in the selected language.
- Sticky application card with save, share and “apply on Telegram”.
- Related roles at the bottom.
- Application dialog composes a message from the candidate profile, copies it, and records a local demo application. Nothing is sent.

### Telegram statistics

- Volume, source groups, regions, seniority split and a 12-month trend.
- Source table with channel, focus, members, share and signal strength.
- A visible method section explains the fictional aggregation.
- Every chart localises axes and tooltips.

### Supply × demand

- Classifies skills as shortage, balanced or surplus.
- Scatter plot of demand vs supply with a median marker, plus a ranked list.
- Skill rows expose salary, remote share and trend; selecting one filters the list.
- Links back to jobs filtered by skill.

### Curiosities

- Six editorial readings of the demo market, each with a headline, evidence and a “what this means” line.
- No empty filler: every paragraph refers to a specific figure in the snapshot.

### My profile

- Candidate hero with verified LinkedIn, open-to-offers status, location, contact and work model.
- Four KPI cards: recruiter views, smart matches, search appearances and saves; the views card links to `/quem-me-viu`.
- Recruiter-facing layout: summary, experience timeline, skills grouped by core/cloud/data/avoid, languages, education, certifications, salary by contract, availability and preferences.
- Side column: profile strength computed from the saved fields, privacy and blocked domains.
- Empty fields show guided placeholders instead of blank sections; the demo profile carries a banner that links to the creation wizard.
- English mode adds a note that candidate-authored content stays in Portuguese.

### Create profile

- Three-step wizard at `/perfil/criar`: identity, professional story, preferences.
- Starts from a blank profile, so demo experience, skills, languages and LinkedIn are never inherited.
- Per-step validation with locale-aware messages; languages start with fluent Portuguese and can be edited later.
- Experience, education and certifications are added after creation in the same editor, keeping the wizard short.
- Creating replaces the demo profile only in this browser and redirects to the recruiter-facing preview.

### Profile editor

- React Hook Form + Zod with locale-aware messages.
- Sectioned cards: identity, professional story, skills/languages, background and credentials, salary/availability, regions/privacy.
- Repeatable experience, education and certification fields with add/remove controls.
- Inline validation, live completion checks and a sticky summary aside.
- Unsaved-changes guard; mobile sticky action bar.
- A two-step “restore demo” action clears the stored profile.
- Saving writes only to `localStorage` and returns to `/perfil`.

### Résumé

- A4-style document with print CSS, hidden app chrome and page margins.
- Section toggles for salary, languages, certifications, availability and compact mode.
- Contact, summary, experience, skills, education, certifications, languages, salary and availability.
- Print/save-PDF uses the browser dialog; no fake PDF engine. The page states that no file is stored.

### Who viewed me

- Simulated email gate before revealing corporate domains; unlock lasts for one tab via `sessionStorage`.
- KPIs for views, search appearances, unique domains and recruiter saves, with month-over-month change.
- Visibility chart (views line + search-appearance bars) across six months.
- Domain list with company, kind, domain, location, views, last-viewed time and hiring focus.
- Block/unblock updates the profile's blocked-domain list and persists locally.
- Activity timeline with aggregated events; privacy explainer explains why names are never shown.

---

## 6. Responsive strategy

| Width | Behaviour |
| --- | --- |
| 1440 | Full header, 4-column KPIs, side-by-side content/aside, wide charts |
| 1024 | Header intact, 2-column KPIs, charts stack selectively, job filters remain in a column |
| 768 | Drawer navigation, 2-column KPI grids, stacked profile sections, résumé scales down |
| 390 / 360 | Single column, bottom-sheet filters, stacked actions, safe-area padding |

Specific mobile decisions:

- Job filters never sit in a squeezed inline row; they open a sheet with a result count.
- Profile and visibility sidebars become normal stacked sections.
- The résumé document keeps its A4 proportions and prints without chrome.
- Touch targets are at least 36–44 px; charts reduce tick density and labels.
- Long job titles truncate in cards but remain full in the detail page and accessible labels.

---

## 7. Bilingual architecture

- **Locale source of truth:** `src/lib/locale.ts` defines `Locale`, `DEFAULT_LOCALE = "pt"` and the `onias.demo.v1.locale` cookie. `src/lib/locale-server.ts` reads the cookie in server components.
- **Provider:** `LocaleProvider` receives the server locale, updates the cookie on change and refreshes the route tree. `LanguageToggle` is the only switch.
- **Job content:** `src/data/mock-jobs.ts` stores `LocalizedString` and `Localized<string[]>` for all 14 roles.
- **Shared copy:** `src/lib/site-copy.ts` holds navigation, common labels and footer copy.
- **Page copy:** local dictionaries (`COPY`) inside each view keep route-specific copy close to the markup.
- **Charts:** read `useLocale()` and localise their own labels, axes and tooltips instead of accepting a locale prop.
- **Candidate content:** stays in Portuguese as authored; UI labels translate and a note explains the choice.

No translation library is used because the prototype has a fixed, small copy surface. This keeps the bundle small and the behaviour predictable.

---

## 8. Data simulation architecture

- `src/lib/mock/market.ts` — deterministic generator seeded by filters, producing monthly points, skills, regions, seniority split and salaries.
- `src/data/mock-jobs.ts` — 14 bilingual roles with full descriptions and source metadata.
- `src/data/mock-profile.ts` — the fictional candidate, profile stats and completion checks.
- `src/data/mock-activity.ts` — viewer domains, events and six months of visibility totals.
- `src/data/mock-market-extra.ts` — sources, hiring companies, facts and pipeline steps.
- `src/lib/jobs.ts` — saved-job and application helpers under `onias.demo.v1.*`.
- `src/lib/mock-api.ts` — the only persistence layer for the profile; writes to `localStorage` and dispatches a local event.
- `DEMO_NOW = 2026-11-15` anchors month pickers, relative times and the demo-clock label.
- Reset removes only prototype keys and preserves the theme choice.

Why deterministic: a redesign review needs stable screenshots and comparable filters. Random regeneration would make the same filter look different on every reload and undermine trust in the demo.

---

## 9. Accessibility and quality bar

- Semantic landmarks, labelled form fields, `aria-invalid` and visible error text.
- Keyboard support for dialogs, sheets, dropdowns and switches via Radix.
- Visible focus ring using the `--ring` token.
- Native selects for mobile pickers.
- Colour is never the only signal: trends pair icon + value; statuses use text.
- Contrast checked for primary, muted and semantic text in both themes.
- Charts include textual summaries and accessible labels where Recharts allows.
- Reduced-motion users get instantaneous state changes.
- Every route has metadata; 404 is designed and links to the public product.
- Screen-reader labels for icon-only actions (save, copy, filter, theme).

---

## 10. Delivery phases

1. **Foundation** — tokens, typography, primitives, theme, locale, types, job/profile/activity data.
2. **Public platform** — header/footer, home, jobs, job detail, application dialog.
3. **Market intelligence** — Telegram statistics, supply × demand, curiosities, localised charts.
4. **Candidate area** — profile, editor, résumé, who-viewed email gate and blocking.
5. **Cleanup** — remove management routes/components, add redirects, rewrite docs.
6. **Verification** — type check, build, lint, screenshots at five widths, dark theme, print, dead-button audit.

Each phase ends with a build and a visual pass; nothing ships as “coming soon”.

---

## 11. Acceptance criteria

- `npm install && npm run dev` works from a clean checkout.
- `npm run build` succeeds with type checking; `npm run lint` is clean.
- All ten routes render in both languages and both themes with no console errors.
- Every job has PT and EN title, summary, responsibilities, requirements and benefits.
- Search and filters change results deterministically; URL params reflect the state; reset clears them.
- Saving a job persists across reloads; applying records a local demo entry.
- The profile editor validates, saves locally and updates the recruiter-facing profile.
- The résumé prints without chrome and fits A4.
- “Quem me viu” hides domains until the simulated email gate is confirmed and blocks persist.
- Every visible action navigates, changes state or states that it is a simulation.
- Screenshots cover 1440, 1024, 768, 390 and 360 px, including dark mode, the mobile filter sheet, the unlocked visibility state and print.

---

## 12. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Prototype mistaken for a production marketplace | Persistent “independent prototype / fictional data” copy, no real endpoints |
| Market numbers read as real | Fixed demo clock, method section, disclaimers on every statistics surface |
| Local-only state lost | Honest storage explanation; reset restores seeded data |
| Truncated job titles on mobile | Full title in detail view and accessible label; cards truncate deliberately |
| Bilingual drift | Job content authored in both languages; shared copy in one module |
| Scope creep into management features | Explicit non-goals; management routes removed and redirected |
| Design drifting into generic SaaS | Navy identity, source-first job cards, domain-level privacy model, Brazilian specifics |

---

## 13. Future work (out of scope here)

- Real API contracts, authentication and server-side persistence.
- Live Telegram ingestion with moderation, deduplication and source verification.
- Server-side résumé generation and accessible file formats.
- Email/notification delivery and preference sync.
- Production LGPD request workflow with identity verification.
- Recruiter collaboration, notes shared across a team and audit trails.

The prototype is intentionally a complete **frontend** argument: enough screens, states and interactions to judge the direction, with every boundary made explicit.
