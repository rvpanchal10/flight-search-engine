# 🛫 Flight Finder 🗺️⁀જ✈︎

Find the best flight deals with our advanced search engine.

## 📦 Installation Steps

### 1. Create Next.js Project
```bash
  npx create-next-app@14 flight-search-engine
  cd flight-search-engine
```

### 2. Install Dependencies
```bash
  npm install @reduxjs/toolkit react-redux react-hook-form @hookform/resolvers zod recharts
  npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/lab
  npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### 3. Setup Environment Variables
Create `.env.local` file in root:
```
  AMADEUS_API_KEY=your_api_key_here
  AMADEUS_API_SECRET=your_api_secret_here
  AMADEUS_API_URL=https://test.api.amadeus.com
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Get Amadeus API Credentials
1. Visit: https://developers.amadeus.com/
2. Sign up for free account
3. Create a new self-service app
4. Copy API Key and API Secret to `.env.local`

### 5. Project Structure
Create the following folder structure:
```
src/
├── app/
│   ├── api/
│   │   ├── airports/search/route.ts
│   │   └── flights/search/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│   └── favicon.ico
├── features/
│   └── flight-search/
│       ├── components/
│       │   ├── AirportAutocomplete.tsx
│       │   ├── SearchForm.tsx
│       │   ├── FlightCard.tsx
│       │   ├── FlightResults.tsx
│       │   ├── FilterSidebar.tsx
│       │   └── PriceGraph.tsx
│       ├── hooks/
│       │   └── useAirportSearch.ts
│       │   └── useFlightFilters.ts
│       ├── store/
│       │   ├── flightSlice.ts
│       │   └── filterSlice.ts
│       ├── schemas/
│       │   └── searchSchema.ts
│       └── __tests__/
├── lib/
│   ├── amadeus/
│   │   └── client.ts
│   └── redux/
│       ├── store.ts
│       ├── hooks.ts
│       └── provider.tsx
├── shared/
│   ├── components/
│   │   └── theme/
│   │       └── ThemeProvider.tsx
│   ├── hooks/
│   │   └── useDebounce.ts
│   └── utils/
│       └── testUtils.tsx
└── types/
    └── global.d.ts
```

### 6. Run Development Server
```bash
  npm run dev
```
Open http://localhost:3000

### 7. Run Tests
```bash
  npm test
```

## 🧪 Testing

Run tests:
```bash
  npm test                # Run all tests
  npm run test:coverage   # Coverage report
```

## 🚀 Deployment

1. Build for production:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
  vercel deploy
```

3. Set environment variables in Vercel dashboard

## 📖 API Documentation

### Amadeus Endpoints Used:
1. **Airport Search**: `/v1/reference-data/locations`
2. **Flight Search**: `/v2/shopping/flight-offers`

### Rate Limits (Test Environment):
- 10 requests/second
- 100,000 requests/month (free tier)

### Production:
- Change `AMADEUS_API_URL` to `https://api.amadeus.com`
- Higher rate limits based on plan