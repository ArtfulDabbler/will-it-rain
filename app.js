// ============================================
// OPEN-METEO API (Free, no API key needed!)
// ============================================

// ============================================
// DOM ELEMENTS
// ============================================
const inputSection = document.getElementById('inputSection');
const answerSection = document.getElementById('answerSection');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

const locationInput = document.getElementById('locationInput');
const geoButton = document.getElementById('geoButton');
const answer = document.getElementById('answer');
const locationDisplay = document.getElementById('locationDisplay');
const resetButton = document.getElementById('resetButton');
const errorMessage = document.getElementById('errorMessage');
const retryButton = document.getElementById('retryButton');

// ============================================
// STATE MANAGEMENT
// ============================================
function showState(state) {
    // Hide all sections
    inputSection.classList.remove('visible');
    inputSection.classList.add('hidden');
    answerSection.classList.remove('visible');
    answerSection.classList.add('hidden');
    loading.classList.remove('visible');
    loading.classList.add('hidden');
    error.classList.remove('visible');
    error.classList.add('hidden');

    // Show requested section
    const element = {
        input: inputSection,
        answer: answerSection,
        loading: loading,
        error: error
    }[state];

    if (element) {
        element.classList.remove('hidden');
        element.classList.add('visible');
    }
}

// ============================================
// WEATHER API (Open-Meteo)
// ============================================

// First, convert city name to coordinates using geocoding
async function geocodeCity(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error('City not found. Please check the spelling.');
    }

    const result = data.results[0];
    return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country_code
    };
}

// Fetch weather data using coordinates
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Could not fetch weather data.');
    }

    return response.json();
}

// WMO Weather Codes that indicate rain
// 51-57: Drizzle, 61-67: Rain, 80-82: Rain showers, 95-99: Thunderstorm
function willItRain(weatherData) {
    const code = weatherData.current_weather.weathercode;
    const rainCodes = [
        51, 53, 55,       // Drizzle
        56, 57,           // Freezing drizzle
        61, 63, 65,       // Rain
        66, 67,           // Freezing rain
        80, 81, 82,       // Rain showers
        95, 96, 99        // Thunderstorm
    ];
    return rainCodes.includes(code);
}

// ============================================
// UI UPDATES
// ============================================
function displayAnswer(isRaining, cityName) {
    // Update body class for background color
    document.body.classList.remove('rain', 'no-rain');
    document.body.classList.add(isRaining ? 'rain' : 'no-rain');

    // Update answer text
    answer.textContent = isRaining ? 'YES' : 'NO';
    locationDisplay.textContent = cityName;

    showState('answer');
}

function displayError(message) {
    document.body.classList.remove('rain', 'no-rain');
    errorMessage.textContent = message;
    showState('error');
}

function reset() {
    document.body.classList.remove('rain', 'no-rain');
    locationInput.value = '';
    showState('input');
    locationInput.focus();
}

// ============================================
// EVENT HANDLERS
// ============================================
async function checkWeatherByCity(city) {
    if (!city.trim()) return;

    showState('loading');

    try {
        // First geocode the city
        const location = await geocodeCity(city);
        // Then fetch weather
        const weather = await fetchWeather(location.lat, location.lon);
        const isRaining = willItRain(weather);
        displayAnswer(isRaining, `${location.name}, ${location.country}`);
    } catch (err) {
        displayError(err.message);
    }
}

async function checkWeatherByLocation() {
    if (!navigator.geolocation) {
        displayError('Geolocation is not supported by your browser.');
        return;
    }

    showState('loading');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weather = await fetchWeather(latitude, longitude);
                const isRaining = willItRain(weather);
                // For geolocation, we don't have city name, so just say "Your location"
                displayAnswer(isRaining, 'Your location');
            } catch (err) {
                displayError(err.message);
            }
        },
        (err) => {
            let message = 'Could not get your location.';
            if (err.code === 1) {
                message = 'Location access denied. Please enter a city name.';
            }
            displayError(message);
        }
    );
}

// ============================================
// EVENT LISTENERS
// ============================================
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkWeatherByCity(locationInput.value);
    }
});

geoButton.addEventListener('click', checkWeatherByLocation);
resetButton.addEventListener('click', reset);
retryButton.addEventListener('click', reset);

// ============================================
// INITIALIZE
// ============================================
showState('input');
locationInput.focus();
