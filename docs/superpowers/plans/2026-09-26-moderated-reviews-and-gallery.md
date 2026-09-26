# Moderated Reviews and Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add moderated customer reviews, a Google Maps review link, and clear navigation between product photos.

**Architecture:** Store reviews in RLS-protected Supabase table `public.resenas`. Visitors may create a pending review and read only approved rows. Authenticated administrators query and moderate all reviews; public components submit and render reviews while the existing modal owns gallery state.

**Tech Stack:** Next.js 14, React 18, TypeScript, Supabase Postgres/RLS, Tailwind CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-26-reviews-and-gallery-design.md`

## Global Constraints

- States are exactly `pendiente` and `aprobada`.
- Public reads return only approved reviews and public writes can create only pending reviews.
- Authenticated administrators may list, approve, and delete all reviews.
- Google reviews are not imported; the UI opens the supplied JBCELL Google Maps location.
- The visible address is exactly: “Plaza Fermín, Santo Domingo Oeste KM9 de la Autop. Juan Pablo Duarte, Santo Domingo 10110”.
- Photo controls appear only when products have two or more photos.

## File Structure

- `supabase/resenas.sql`: review table, validation constraints, RLS and policies.
- `lib/types.ts`: `EstadoResena` and `Resena` type definitions.
- `components/ResenasPublicas.tsx`: review form and approved review cards.
- `components/AdminResenas.tsx`: approve/delete actions for administrators.
- `components/ProductModal.tsx`: previous/next photo controls.
- `app/page.tsx`: approved-review query, public reviews section, Google link and footer location.
- `app/admin/page.tsx`: full review query and moderation component.
- `tests/resenas-*.test.cjs`, `tests/admin-resenas.test.cjs`, `tests/product-gallery.test.cjs`: regression coverage.

## Tasks

### Task 1: Review schema and access rules

- [ ] Write `tests/resenas-schema.test.cjs` to assert the schema contains `public.resenas`, a 1–5 rating constraint, a pending-only insert policy and approved-only public select policy.
- [ ] Run `node --test tests/resenas-schema.test.cjs`; it must fail because the schema file does not exist.
- [ ] Create `supabase/resenas.sql` with UUID id, 2–80 character name, 1–5 rating, 5–500 character comment, constrained status, timestamp, RLS, public approved-only SELECT, public pending-only INSERT, and authenticated SELECT/UPDATE/DELETE policies.
- [ ] Add `EstadoResena = "pendiente" | "aprobada"` and the `Resena` interface to `lib/types.ts`.
- [ ] Re-run the test and commit the schema, type, and test as `feat: add moderated review schema`.

### Task 2: Public review flow

- [ ] Write `tests/resenas-publicas.test.cjs` to assert an approved-review Supabase query, pending submission state, validation feedback, and the Google Maps review link.
- [ ] Run the test; it must fail before component creation.
- [ ] Create `ResenasPublicas` with controlled name, stars and comment fields; client validation; disabled submit during request; insert with `{ estado: "pendiente" }`; success feedback “Tu reseña será publicada después de revisión.”
- [ ] In `app/page.tsx`, query `resenas` where `estado` is `aprobada`, newest first, limit six, then render `ResenasPublicas` with results.
- [ ] Re-run the test and commit as `feat: collect and show approved customer reviews`.

### Task 3: Admin moderation

- [ ] Write `tests/admin-resenas.test.cjs` to assert the admin queries all reviews and has update-to-approved and delete-by-id calls.
- [ ] Run it and confirm it fails before the module exists.
- [ ] Create `AdminResenas` with reviewer, rating, message, state, and date; pending items show “Aprobar”; all show “Eliminar”; mutate local state only after a successful Supabase request.
- [ ] Query all reviews in `app/admin/page.tsx`, pass results to the module, then re-run test and commit as `feat: moderate customer reviews in admin`.

### Task 4: Gallery, icons and address

- [ ] Write `tests/product-gallery.test.cjs` to assert visible previous/next controls for product images plus Instagram, Facebook, exact address and supplied Maps link.
- [ ] Run it and confirm it fails before controls/address are added.
- [ ] In `ProductModal`, add accessible “Foto anterior” and “Foto siguiente” controls in the existing multi-image branch. Previous wraps from index zero to the last image; next wraps at the end. Preserve thumbnail selection.
- [ ] Update home footer with accessible Instagram, Facebook and map icons; use the supplied Google Maps location and exact address text. External links use `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] Re-run test and commit as `feat: add product gallery navigation and store links`.

### Task 5: Database apply and verification

- [ ] Read current Supabase RLS guidance and changelog before SQL execution.
- [ ] Execute `supabase/resenas.sql` against the linked JBCELL project.
- [ ] Query `information_schema.columns` and `pg_policies` to verify schema and policy behavior.
- [ ] Run all review/gallery tests, TypeScript check, production build, and a published-page check.
- [ ] Commit any required SQL correction only when verification reports a concrete issue.
