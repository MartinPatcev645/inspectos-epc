# InspectOS EPC — Development TODO

## Mobile (iOS/Android) Requirements
- [ ] Ensure viewport meta tag includes maximum-scale=1 for iOS zoom prevention
- [ ] Add safe-area-inset padding for notched devices (iPhone X+, Android punch-hole)
- [ ] Use min-height: 44px for all tap targets (Apple HIG minimum)
- [ ] Touch-friendly select/dropdown inputs (native selects on mobile)
- [ ] Smooth momentum scrolling (-webkit-overflow-scrolling: touch)
- [ ] Prevent iOS rubber-banding on fixed elements
- [ ] Test input focus behavior (iOS keyboard push-up)
- [ ] Use inputmode attributes for numeric fields (inputmode="decimal")
- [ ] Add PWA manifest for home screen install capability
- [ ] Bottom navigation for thumb-reachable actions on phones

## Core Sections
- [ ] Section 1 — Property Identification
- [ ] Section 2 — Building Envelope
- [ ] Section 3 — Glazing & Windows
- [ ] Section 4 — Ventilation
- [ ] Section 5 — Heating System
- [ ] Section 6 — Cooling System
- [ ] Section 7 — Domestic Hot Water (AQS)
- [ ] Section 8 — Renewable Energy
- [ ] Section 9 — Site Observations

## Features
- [ ] Live energy rating calculation (A+ to F)
- [ ] Improvement recommendations engine
- [ ] Auto-generated EPC report
- [ ] Copy all data as JSON button
- [ ] Reset / New Assessment button
- [ ] Progress bar across all 9 sections
