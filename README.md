# OVEILE — Myanmar Garment B2B Platform (Frontend Demo)

A frontend-only React demo for a Myanmar garment-industry B2B sourcing platform.
No backend — all data is mocked and persisted to `localStorage`, shared between
the mobile-style user app and the desktop coordinator dashboard via React Context.

## Stack
Vite · React 18 · React Router · TailwindCSS · SheetJS (`xlsx`) for Excel export.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the build
```

## Routes

| Path | App |
|---|---|
| `/` → `/welcome` | Mobile app entry (language → auth → onboarding) |
| `/app` | Buyer tab shell: Home · AI Consult · Bookings · Favorites · Profile |
| `/register` | General Member (buyer) 3-step onboarding |
| `/register/manufacturer` | Manufacturer 5-step onboarding |
| `/admin` | Coordinator console (desktop, sidebar layout) |

The mobile app is centered in a phone frame (max 480px). The admin dashboard
is desktop-first. A shortcut to `/admin` sits on the Welcome screen for the demo.

## The core data contract

The single most important flow: in **AI Consult**, a buyer answers 3 guided
questions (fabric → item → location), gets matched factories, and taps
**"Book Consultation with This Factory"**. That booking writes **exactly one row**
into the shared `consultations` store — which the **Admin › Consultation
Management** table reads live. Refresh either app; the row persists.

## Structure

```
src/
  shared/        tokens, i18n (EN/MY), mockData + AI match engine, AppContext, UI components
  user/          mobile app — PhoneFrame, BottomTabNav, screens/
  admin/         coordinator dashboard — Sidebar, screens/, excel export
```

## Notes
- Bilingual (English default, Myanmar toggle in Profile / Welcome).
- Shared `<StatusBadge />` drives all status pills across both apps.
- "Reset Demo Data" (Profile or Admin › Settings) restores the seeded state.
- Admin login accepts any credentials (mock auth).
