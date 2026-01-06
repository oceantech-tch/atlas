# Atlas — Cloud Infrastructure Status Dashboard

Atlas is a frontend-focused status dashboard that monitors live cloud infrastructure data and presents it in a clear, stable, and responsive way.

It was built to explore how real production status data should be **displayed**, not just fetched — especially under imperfect conditions like partial outages, missing fields, empty results, and frequent updates.

The focus of this project is UI behavior, layout stability, and observability-style UX.

---

## What Atlas Does

- Fetches live infrastructure status data from a real provider  
- Polls automatically to keep data up to date  
- Displays services, regions, status, latency, and uptime  
- Supports search and pagination without breaking layout  
- Adapts interaction patterns between desktop and mobile  
- Handles empty states and filtered views gracefully  

The goal is to make the interface **predictable and calm**, even when the underlying data is not.

---

## Why This Project Exists

Many dashboards work well when data is perfect, but struggle when:
- results are empty  
- rows are filtered down to one item  
- fields are missing or delayed  
- updates happen frequently  

Atlas was built to handle those cases intentionally.

Layout should not jump.  
Tables should not shrink.  
The interface should not feel fragile.

---

## Key UX Decisions

- **Live polling instead of manual refresh**  
  Mirrors how real status dashboards behave.

- **Stable containers**  
  Filtering or pagination never collapses the layout.

- **Different interaction models by screen size**  
  - Desktop: full table view with all key metrics visible  
  - Mobile: compact rows with expandable details  

- **Status-first design**  
  Status is always visible and readable before secondary metrics.

- **Explicit empty states**  
  Empty search results are treated as a valid UI state, not an error.

---

## Tech Stack

### Frontend
- React  
- TypeScript  
- Vite  
- CSS (custom, no UI frameworks)  
- lucide-react (icons)

### Data
- Live infrastructure status data

---

## Project Structure (simplified)

`src/` <br />
` components/` <br />
`  Dashboard` <br />
`  ServicesTable` <br />
`  StatusHeader` <br />
`  IncidentFeed` <br /><br />
`lib/` <br />
` fetchStatus` <br />
` parseRegion` <br /><br />
`types/` <br />
` status.ts` <br /><br />
`styles/` <br />
` global.css` <br /><br />

---

## Current State

- Functional and stable  
- Handles real data correctly  
- Responsive across screen sizes  
- Designed to behave well under edge cases  

This project is complete and production-oriented in scope.

---

## Notes

Atlas is intended to demonstrate frontend judgment:
- layout control  
- state handling  
- UI resilience  
- clarity over decoration  

It is intentionally focused and intentionally limited.
