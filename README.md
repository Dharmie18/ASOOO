# Asooo (Aṣọ) 🇳🇬

> **Weather-aware outfit advice for people in Nigeria.**  
> *"Wear right for where you are and where you're going."*

Asooo (*from the Yoruba word "Aṣọ" meaning clothes*) translates complex meteorological forecasts into **one clear, authoritative, plain-language clothing recommendation** in seconds — with zero technical jargon, zero required signup, and offline resilience.

---

## ✨ Signature Features

### 1. "Hot Here, Cold There" (Trip Advisory)
Leaving humid 34°C Lagos at 8:00 AM heading to cool 19°C Jos or high-altitude Plateau?
- Asooo compares the weather where you **depart** (at departure time) with the weather where you **arrive** (at arrival time).
- Gives unified travel wear and packing advice (e.g., *"Keep a sweater or jacket inside your hand luggage so you can put it on as soon as you arrive in Jos"*).

### 2. The Indoor AC Switch
Accounts for the sudden outdoor-to-air-conditioned-indoor temperature swing common in Nigerian offices, banks, malls, and churches:
- **Outside**: Light, heat-reflective clothes and hydration reminders.
- **Mostly inside with AC**: Injects cardigan/layering advice so you don't freeze indoors.
- **Both**: Layering strategy you can easily adjust on the move.

### 3. Plain-English Human Copy (Zero Jargon)
Every data point is translated into simple, friendly everyday advice:
- *No "Precipitation Probability 85%"* ➔ **"Rain is likely today. Carry an umbrella."**
- *No "UV Index 10.5"* ➔ **"The sun is very strong. Wear a cap or stay under shade."**
- *No "Relative Humidity 20%"* ➔ **"Dry and dusty Harmattan weather. Protect your lips with balm."**

### 4. WhatsApp Status Share Card
- 1-tap client-side generator producing a clean, vertical (9:16) outfit card styled for your WhatsApp Status.
- Generates 100% in the browser using HTML5 Canvas (zero server load, works offline).

### 5. Dynamic Nigerian Geocoding (Zero Hardcoded Cities)
- Search any town, city, or LGA across Nigeria (Ikeja, Yaba, Gwarinpa, Bodija, Nsukka, Jos, Kano, Aba, Calabar, etc.) on the fly.
- Real-time proxying through `/api/geocode` with zero static city lists hardcoded.

### 6. Privacy & Offline-First
- Uses location **only** to fetch forecasts — zero persistent GPS tracking or trails.
- Automatically caches the last successful forecast in `localStorage` so you can check your advice even when cellular data cuts out in transit.

---

## 🎨 Nigerian Seasonal Design System

Asooo features a warm, editorial layout inspired by Nigerian natural climate shifts and traditional textiles (no generic AI purple/blue glowing blobs):

- **Harmattan Ochre (`#C27803`)**: Dusty laterite earth and dry-season alerts.
- **Rainforest Green (`#1E5E3A`)**: Deep wet-season rainfall indicators.
- **Sun Amber (`#D97706`)**: Midday tropical sun & UV warnings.
- **Office AC Indigo (`#1E40AF`)**: Cold indoor air conditioning notices.
- **Adire Indigo (`#1A2744`)**: Deep Yoruba textile blue for primary actions.
- **Cotton Neutral (`#FBF9F5`)**: Warm, glare-free off-white base with accessible charcoal typography (WCAG AA compliant, $\ge 48\text{px}$ touch targets).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- npm or yarn

### 1. Clone & Navigate
```bash
git clone https://github.com/YOUR_USERNAME/asooo.git
cd asooo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Testing

Asooo includes a Vitest test suite that validates the deterministic rules engine and guarantees that no meteorological or technical jargon leaks into user-facing copy:

```bash
npm test
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with semantic CSS variables
- **Typography**: `Playfair Display` (editorial serif headings) + `Plus Jakarta Sans` (body & UI)
- **Weather Provider**: [Open-Meteo API](https://open-meteo.com/) (Free, open data, zero API keys required, `Africa/Lagos` timezone)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📂 Project Architecture

```
asooo/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Google Fonts (Playfair & Plus Jakarta Sans)
│   │   ├── page.tsx           # Today Screen (Instant Advice & Share Card)
│   │   ├── trip/
│   │   │   └── page.tsx       # Trip Screen ("Hot here, cold there")
│   │   ├── settings/
│   │   │   └── page.tsx       # Privacy and Settings
│   │   ├── api/
│   │   │   ├── weather/       # 15-min cached weather proxy
│   │   │   └── geocode/       # Dynamic Nigerian town search
│   │   └── globals.css        # Seasonal palette tokens & 17px base scale
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives (Button, Card, Input, SegmentedControl)
│   │   ├── weather/           # AnswerHero, PlaceTypeToggle, AlertBanner, OutfitList
│   │   ├── trip/              # TripComparisonCard, TimeSelector
│   │   ├── share/             # WhatsAppShareCard (Canvas generator)
│   │   └── navigation/        # Header, BottomNav
│   ├── config/
│   │   ├── copy.ts            # Centralized Plain-English copy dictionary
│   │   └── rulesConfig.ts     # Editable thresholds and weights
│   ├── lib/
│   │   ├── rulesEngine.ts     # Core deterministic advice engine
│   │   └── weatherService.ts  # Client fetcher & localStorage offline cache
│   └── types/
│       ├── weather.ts
│       └── rules.ts
├── tests/
│   ├── rulesEngine.test.ts    # Unit tests for clothing advice
│   └── weatherMapping.test.ts # Plain-English copy validation
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 📄 License
MIT © Asooo Project.
