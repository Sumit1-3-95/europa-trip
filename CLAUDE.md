@AGENTS.md

# Europa Trip App — Project Context

## What we're building
A family travel PWA for a 22-day Europe trip (Jul 24 – Aug 14, 2026).

**Family:** Sumit + Aishwarya (admins), Dinesh + Chermanywati (seniors), Mira (child). Komal (Stockholm, view-only).

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, Storage, Realtime)
- Vercel (hosting)
- PWA (manifest + service worker)

## Auth
Supabase phone number + PIN. Admins: Sumit, Aishwarya. Others: read + Vibes tab only.

## Route Structure
```
src/app/
  (tabs)/
    today/page.tsx
    journey/page.tsx
    vibes/page.tsx
    explore/page.tsx
    lists/page.tsx
  layout.tsx
```

## Key Files
- `src/data/tripData.ts` — master data, all trip data
- `src/lib/theme.ts` — country theme config
- `src/components/layout/BottomNav.tsx` — 5-tab nav
- `src/components/cards/` — card components per type

## Country Themes
- Sweden: `#E8F0FE` (blue)
- Denmark: `#FDECEA` (red)
- Netherlands: `#FEF0E6` (orange)
- Belgium: `#FEF7E6` (amber)

## Design Rules
- Airbnb-quality cards: 16px rounded, subtle border, image top
- Font weights: 400 regular, 500 medium only — never 700/bold
- Sentence case everywhere
- Mobile-first, 390px viewport
- Card types: transport, stay, activity, ticket, alert, free

## Supabase Schema
```sql
profiles (id, name, role: admin|member, phone, avatar_url)
checklist_items (id, list_id, text, checked_by, checked_at)
checklist_lists (id, name, type: daily|packing|documents|custom)
vibe_posts (id, user_id, day_number, type: photo|text, content, sticker, created_at)
day_cards (id, day_number, type, title, description, time, image_url, document_url, metadata jsonb)
```
