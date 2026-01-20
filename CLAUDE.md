# Will It Rain

## Project Description
Hyper-minimalist weather app that answers one question: "Will it rain today?"
Users enter location → get YES or NO. That's it.

## Tech Stack
- HTML + CSS + vanilla JavaScript
- Open-Meteo API (free, no API key needed!)
- Browser Geolocation API

## Key Logic
- **YES** if: weather.main contains "Rain", "Drizzle", or "Thunderstorm"
- **NO** otherwise

## Design Principles
- Ultra-minimalist (Google homepage simplicity)
- Large YES/NO typography
- Color coded: blue/grey for rain, warm/sunny for no rain
- No clutter, no distractions

## API
- Weather: `https://api.open-meteo.com/v1/forecast`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- No API key required!

## Progress
- [x] Project setup
- [x] Build UI (index.html)
- [x] Style minimally (style.css)
- [x] Create JavaScript logic (app.js)
- [x] Integrated Open-Meteo API (no key needed)

## Files
- index.html
- style.css
- app.js
