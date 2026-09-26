# Task 2 report

Implemented public reviews on the homepage. The server loads the six newest approved `resenas`, and the client component renders them alongside a controlled review form. Successful submissions insert `estado: "pendiente"`, clear the fields, and show the specified moderation message. The supplied Google Maps review link opens in a new tab with `noopener noreferrer`.

## Verification

- Red: `node --test tests/resenas-publicas.test.cjs` failed before implementation because the query and component were absent.
- Green: the same focused suite passed after implementation (3 tests).
- TypeScript: `node -e "require('typescript/bin/tsc')" -- --noEmit` passed.
- Full suite: 26 passed, 1 failed. The failing `the category links are below the testimonials section` test expects `id="categorias"` in `app/page.tsx`; that ID was already absent at HEAD before Task 2.

No live Supabase project was available for an end-to-end insert check.

## Review follow-up

Signed-in visitors use an authenticated Supabase session, so the original anonymous-only INSERT grant and policy could reject their submissions. Added authenticated INSERT privilege and a matching RLS policy restricted to `estado = 'pendiente'`. The new regression test failed before the SQL change and passed afterward. Task 1 and Task 2 focused suites now pass together (5 tests).
