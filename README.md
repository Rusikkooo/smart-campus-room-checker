# Smart Campus Room Availability Checker — Assignment #03

Myrzabayev Ruslan · Software Engineering · 24 Oct 2026

One responsive page that **checks** whether a room is free (it never creates or changes bookings).
Fictional in-memory data only — no login, database, backend, external API or payments.

- **Live demo:** https://smart-campus-room-av-kyfa.bolt.host
- **Bolt.new project:** https://bolt.new/~/sb1-gewmu6gh (v1 → v4, see report)

## Repository contents

| Path | What |
|---|---|
| `src/` | Prototype source (React + TypeScript + Tailwind, generated with Bolt.new and cleaned up) |
| `src/lib/availability.ts` | Pure rule `checkAvailability()` (AC1–AC5) |
| `src/lib/availability.test.ts` | Vitest acceptance set A01–A15 |
| `docs/A3_Myrzabayev_Ruslan_Report.pdf` | Report: scope, criteria, traceability, tests, issues, agent analysis, reflection |
| `docs/AI_Evidence.pdf` | Appendix: prompts/responses, tool/model/date, screenshots, source checks |
| `python/` | `booking.py`, `test_booking.py`, first AI version `v1/booking.py`, raw test logs |
| `screenshots/main/` | A3 project: v1, before/after for each fix, final tests, mobile, demo |
| `screenshots/practice6_project/` | Earlier Practice 6 attempt (history) |
| `diagrams/` | Agent-loop diagram (`.mmd` source + `.png`) |

## Run

```bash
npm install
npx vitest run     # 15 passed
npm run dev
```

```bash
cd python
python3 -m unittest -v test_booking                    # final -> 21/21
BOOKING_IMPL=v1 python3 -m unittest -v test_booking    # AI v1 -> 20/21 (T20 fails)
```

## Acceptance criteria

AC1 integer minutes, 0 ≤ start < end ≤ 1440, start strictly after now · AC2 ≤ 120 min (120 allowed) ·
AC3 blocked room always rejected · AC4 no overlap, touching endpoints allowed ·
AC5 unambiguous Available/Unavailable, bookings never mutated · AC6 clear feedback, mobile layout.
