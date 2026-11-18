# ONIAS Product Analysis

**Scope:** product and interface research behind the independent redesign prototype in `onias-redesign-prototype/`.
**Status:** design research, not an implementation specification. Observations about the public product are paraphrased; every figure, job, company and person in the prototype is fictional.

---

## 1. Product context

ONIAS is a Brazilian product that aggregates **public Telegram hiring messages** and turns them into a structured technology job market. Its public surface is built around four candidate needs:

1. **Find a role** — browse vacancies normalised from public groups instead of scrolling chat threads.
2. **Read the market** — understand which skills are in demand, where the jobs are, and how hiring is moving month to month.
3. **Be discoverable** — keep a structured profile that recruiters can find, with a LinkedIn link instead of an uploaded CV.
4. **Understand visibility** — see which company domains opened the profile, without exposing individual recruiter identities.

A recruiter-facing area also exists in the production product (candidate pool, viewed résumés, aliases). It is intentionally **out of scope** for this redesign: the brief is the public job platform and the candidate experience, not a recruitment management system.

The interface is Brazilian Portuguese. The local conventions that shape the design are:

- salaries in **BRL** and contract models **CLT / PJ / BTC**;
- regions expressed as city/state plus **DDD**;
- **LGPD** language around consent, access and deletion;
- heavy use of **Telegram** as a hiring channel;
- a profile model built around skills, availability and a LinkedIn URL.

The redesign keeps those conventions and adds a **PT/EN interface toggle**. Job descriptions are written natively in both languages; candidate-authored content stays in Portuguese with a visible note in English mode.

---

## 2. Research method and confidence

The analysis combines:

- review of the public ONIAS routes and navigation (`/`, `/vagas`, `/estatisticas/...`, `/perfil`, `/quem-me-viu`);
- review of the official repositories that expose jobs, market statistics, profile and visibility domains;
- the supplied Stitch exploration as a visual starting point, not as a specification;
- reconstruction of flows only where public evidence was incomplete.

Confidence labels:

- **Observed** — directly supported by public screens, repositories or naming.
- **Inferred** — a reasonable workflow implied by the data model, not verified end to end.
- **Design decision** — introduced by this redesign; not a claim about production behaviour.

---

## 3. Domain model

### 3.1 Jobs

**Observed.** A job is a normalised public message, not a recruiter-authored listing. It carries:

- title, company and a short company description;
- location and region, work model (remote, hybrid, on-site) and seniority;
- salary range in BRL, skills, posted date and application count;
- the **source channel** and its member count, so the candidate can trace the signal;
- a source note explaining that the message was normalised by ONIAS.

**Design decision.** The prototype keeps source metadata visible on the detail page and in the application dialog. A job board that hides where the job came from recreates the “mystery listing” problem the product exists to solve.

### 3.2 Market statistics

**Observed.** Statistics are derived from the same public messages and compared with the candidate base:

- monthly volume of vacancies and candidates;
- skill demand, trend, median salary and remote share;
- region distribution and demand index;
- seniority split;
- **supply × demand**, classifying skills as shortage, balanced or surplus;
- editorial “curiosities” that explain patterns in the data.

**Design decision.** Every chart is localised at the axis and tooltip level (not just the page title), and every statistics screen states that the figures are a fictional November 2026 snapshot. The method section is part of the product surface, not a legal footnote.

### 3.3 Candidate profile

**Observed.** The candidate profile is richer than a file upload. It includes:

- identity and contact details, including DDD;
- desired role, last role, seniority, experience years and a free-text summary;
- skills grouped into core, adjacent and “prefer to avoid”;
- spoken languages with two levels (intermediate, fluent);
- salary expectations split by **CLT**, **PJ** and **BTC**, plus negotiable;
- notice period, temporary-role duration, travel willingness and optional PCD self-declaration;
- preferred regions including home office;
- education, certifications and a **LinkedIn URL**;
- a blocked-company list expressed as email domains.

The LinkedIn URL is a deliberate privacy choice: the product stores a link to a professional profile rather than a CV file. The redesign makes that explicit and never offers a fake upload.

### 3.4 Profile visibility

**Observed.** Candidates see that their profile was viewed at **company/domain level**. Individual recruiters are not identified. An email confirmation gates the domain list, and blocked domains receive the profile without contact details.

**Design decision.** The gate is reproduced as an honest simulation: the email is never sent, the unlock lasts for one tab, and the privacy boundary is explained next to the list. Blocking is available in context and mirrored in the profile editor.

### 3.5 Résumé preview

**Observed.** The candidate can open a print-oriented preview generated from profile fields, with section controls and an A4 layout.

**Design decision.** The preview is a real document: print CSS, no app chrome, no fabricated PDF engine. The browser print dialog is the only export path and the UI says so.

---

## 4. Key workflows

### Candidate: “Is this role worth my attention?”

1. Land on the home page and read the market pulse.
2. Search by role, skill or company.
3. Filter by region, seniority and work model; save roles that need a second look.
4. Open a role and read the full PT/EN description, salary and source channel.
5. Apply through a prepared Telegram message, clearly marked as a simulation.

**Friction in a generic job board:** salary, source and skills are buried, and “apply” jumps to an unexplained form. The redesign keeps source and salary in the first screen and makes the handoff explicit.

### Candidate: “What should I learn next?”

1. Open Telegram statistics for volume and regional context.
2. Move to supply × demand to see shortages and surpluses.
3. Inspect a skill’s salary, remote share and 12-month trend.
4. Return to jobs filtered by that skill.

**Friction:** statistics often stop at “interesting”. The redesign links each market reading to a filtered job list or a profile action.

### Candidate: “Who is looking at me?”

1. Open “Quem me viu”.
2. Confirm the email to reveal corporate domains.
3. Read views, search appearances, hiring focus and last-viewed time.
4. Block a domain that should not receive contact details.

**Friction:** privacy controls are usually detached from the signal that motivates them. Here blocking sits next to the viewer list and its consequence is explained immediately.

### Candidate: “Keep my profile current”

1. Open the profile and scan completion checks.
2. Edit fields in a sectioned form with inline validation.
3. Preview the résumé and print/save as PDF.
4. Return to the market or the job list.

**Friction:** profile editors feel like tax forms. The redesign uses a recruiter-facing preview layout, a visible strength checklist and a sticky summary of what is missing.

---

## 5. Information architecture

The public navigation is grouped by intent:

```text
Explore     Vagas · Estatísticas (Telegram, Oferta × demanda, Curiosidades)
Candidate   Meu perfil · Currículo · Quem me viu
```

The header exposes jobs, statistics, profile, résumé and visibility. The footer repeats the same destinations plus “how it works”, sources and privacy, so no route depends on a single navigation surface.

Mobile replaces the horizontal nav with a drawer and keeps a primary “Ver vagas” action. The job filters become a bottom sheet; the rest of the candidate screens stack naturally.

Routes:

```text
/                              Home / market pulse
/vagas                         Job search and filters
/vagas/[id]                    Job detail
/estatisticas/telegram         Telegram volume and sources
/estatisticas/oferta-demanda   Supply × demand
/estatisticas/curiosidades     Market curiosities
/perfil                        Candidate profile
/perfil/criar                  Create profile (3-step wizard)
/perfil/editar                 Profile editor
/curriculo                     Print-ready résumé
/quem-me-viu                   Profile visibility
```

Old management URLs (`/jobs`, `/market`, `/dashboard`, `/statistics`, `/recruitment`, `/support`, `/settings`, `/insights`, `/resume`, `/activity`, `/profile`) redirect to their new equivalents.

---

## 6. Design problems to solve

| Problem | Consequence | Redesign response |
| --- | --- | --- |
| Telegram messages are unstructured | Candidates cannot compare roles | Normalised cards with salary, model, seniority, skills and source |
| Salary context is ambiguous | Misaligned expectations | Explicit BRL ranges, CLT/PJ/BTC conventions, “/mês” labels |
| Statistics feel like a separate product | Insight does not lead to action | Linked stats, filtered job searches and profile CTAs |
| Profile pages feel like forms | Candidates abandon completion | Recruiter-facing preview, explainable completion checks, sectioned editor |
| Viewer anonymity feels opaque | Trust erosion | Domain-level model explained in place; blocking adjacent |
| Résumé flows imply uploads | Privacy and storage confusion | Print-only preview, no file storage, explicit copy |
| Prototype actions that do nothing | Loss of credibility | Every control has a local effect, a disabled reason or a simulation label |
| Fake precision in market data | False confidence | Fixed demo clock, seeded data, visible method and disclaimers |

---

## 7. Constraints carried into the prototype

- **Frontend only.** No production API, auth provider, database, email or payment integration.
- **No real personal data.** Fictional names, companies, domains, emails and phone numbers.
- **No invented backend capabilities.** Anything requiring a server is local or explicitly simulated.
- **Brazilian context preserved.** BRL, CLT/PJ/BTC, DDD, LGPD, Telegram-sourced jobs, home office.
- **Reproducible demo.** Fixed “today” (15 Nov 2026), deterministic seeded figures, local reset.
- **Accessible and responsive.** Keyboard-operable dialogs and sheets, native selects, visible focus states, reduced-motion-friendly captures.

---

## 8. What the redesign deliberately does not claim

- That ONIAS uses the exact visual system, copy or component library shown here.
- That the jobs, companies, domains, salaries or statistics are real.
- That the email gate, Telegram application or résumé export reach a server.
- That recruiter or account-management features are part of this prototype.
- That the prototype is affiliated with, endorsed by or derived from proprietary ONIAS assets.

The goal is a credible, self-contained product direction that a team could evaluate, not a clone or a backend replacement.
