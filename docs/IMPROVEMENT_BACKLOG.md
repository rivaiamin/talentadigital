# Product Improvement Backlog

A living backlog of UX, feature, and performance enhancements for TalentaDigital. Each item links to the relevant implementation area so we can triage quickly and avoid losing context.

## Prioritized Snapshot

| Priority | Area | Recommendation | Status |
| --- | --- | --- | --- |
| High | Global navigation | Add contextual loader + skip link (baseline accessibility) | ✅ Skip link done (`src/routes/+layout.svelte`), loader live (`src/lib/NavigationLoader.svelte`) |
| High | Talent discovery | Add loading skeletons & empty-state guidance | ⏳ Pending |
| Medium | Talent filters | Persist filters & add reset/active chips | ⏳ Pending |
| Medium | Auth flows | Surface password rules + progressive disclosure | ⏳ Pending |
| Low | Footer CTA | Provide donation context + success metric | ⏳ Pending |

## Feature & Performance Opportunities

| Priority | Area | Recommendation | Status |
| --- | --- | --- | --- |
| High | Homepage storytelling | Curate talent categories & spotlight cards | ⏳ Pending |
| High | Talent search performance | Add DB indexes + caching strategy for filters | ⏳ Pending |
| Critical | Auth security | Add rate limiting & audit trail for login/register | ⏳ Pending |

## Detailed Notes

### 1. Talent discovery skeletons (High)
- **Pain**: `src/routes/talents/+page.svelte` renders results abruptly after the GET request completes. On slower connections, the page sits empty, which feels broken and causes layout shift when cards pop in.
- **Proposal**: Render 6–8 placeholder cards that mimic avatar + text structure while `data.pending` (or while `$navigating` matches `/talents`). Fade them out once real data arrives. Pair with text like "Mengambil daftar talent…" so users know the app is working.
- **Why first**: Impacts the most data-heavy screen and sets perceived performance.

### 2. Smarter filter UX (Medium)
- **Pain**: Filters (`q`, `service`, `location`, `status`) rely on multiple inputs with no indication of which ones are active once the user scrolls the list. There's also no one-click way to clear them.
- **Proposal**: After submit, show compact filter pills (e.g., `Service: Desain`) above results with an `x` to remove each, plus a "Reset" ghost button. Persist the last-used filters in `localStorage` so returning users keep context.
- **Implementation hint**: Use the existing `data.filters` in `talents/+page.svelte` to derive chips and apply `goto` with updated query params when removing one.

### 3. Login/register guidance (Medium)
- **Pain**: `src/routes/auth/login/+page.svelte` validates inputs but only shows errors after submission; users don't know password rules or why contact numbers change format.
- **Proposal**: Add inline helper text under the inputs describing rules ("Minimal 6 karakter, kombinasi huruf & angka dianjurkan") and show live validation icons (✅/⚠️) as they type. For contact numbers, show a small note explaining the automatic conversion to `62`.
- **Stretch**: Save the last selected tab (login/register) in `localStorage` so visitors land on their preferred action.

### 4. Footer donation context (Low)
- **Pain**: The footer CTA (`src/routes/+layout.svelte`) says "Support untuk pengembangan komunitas" but doesn’t explain impact.
- **Proposal**: Add a single-sentence benefit ("Dana digunakan untuk mentorship gratis & infrastruktur job board") and a subtle success indicator (e.g., "Target tercapai 60% tahun ini"). Could also include a secondary link to transparency docs if available.

### 5. Curated talent spotlight (High)
- **Pain**: The home hero (`src/routes/+page.svelte`) currently offers only two CTAs. New visitors don’t get proof of value (real talents, categories, testimonials), so bounce risk is high.
- **Proposal**: Add a "Kategori Populer" grid (Design, Engineering, Marketing, etc.) that deep links to pre-filtered `/talents` queries, plus a rotating spotlight card that pulls from `talent` rows with pictures. This doubles as a discovery feature and a merchandising surface for campaigns.
- **Extra**: Reuse `generateSrcSet` utilities for spotlight avatars so we don't duplicate logic.

### 6. Talent search performance (High)
- **Pain**: `src/routes/talents/+page.server.ts` builds `LIKE` clauses across `name`, `description`, `services`, and `location` without any supporting indexes in `src/lib/server/db/schema.ts`. Each request issues a `count(*)` plus a full select, which becomes a sequential scan as the table grows.
- **Proposal**: Create partial indexes on `status`, `LOWER(name)`, and `LOWER(location)` (or switch to trigram indexes) and materialize `services` into a searchable column (e.g., TSVECTOR). Cache popular filter combinations with `s-maxage` headers or an application-level LRU to avoid duplicate work. Also run the count/select in parallel via `Promise.all`.
- **Impact**: Prevents the search endpoint from becoming the primary bottleneck as soon as we hit a few thousand talent rows.

### 7. Auth rate limiting & audit (Critical)
- **Pain**: The login/register actions in `src/routes/auth/login/+page.server.ts` accept unlimited attempts. Each failed try still runs an Argon2 verify/hash, so an attacker can brute-force credentials while tying up CPU, and we have no visibility.
- **Proposal**: Introduce per-IP and per-identity throttling (e.g., Redis-backed leaky bucket) and log attempts to a `login_attempt` table for audit. Surface a generic "Terlalu banyak percobaan" message when throttled and require CAPTCHA/email verification after N failures. Consider short-lived account lockouts on repeated failures.
- **Bonus**: Store the normalized phone conversion step result so we can detect abuse of that branch specifically.

---

Update this file whenever we ship or reprioritize UX changes so everyone stays aligned.

