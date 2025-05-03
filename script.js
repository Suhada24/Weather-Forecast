const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const feels_like = document.getElementById('feels-like');
const uv_index = document.getElementById('uv-index');
const air_quality = document.getElementById('air-quality');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const forecastContainer = document.getElementById('forecast');
const hourlyForecastContainer = document.getElementById('hourly-forecast');
const loading_spinner = document.querySelector('.loading-spinner');
const darkModeBtn = document.getElementById('darkModeBtn');
const container = document.querySelector('.container');
const body = document.body;

async function checkWeather(city) {
    const api_key = "f63667648a68784c45c0ac5d2be9888f"; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weather_data = await response.json();

        if (weather_data.cod === '404') {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        temperature.innerHTML = `${Math.round(weather_data.main.temp)}°C`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;
        feels_like.innerHTML = `${Math.round(weather_data.main.feels_like)}°C`;
        uv_index.innerHTML = `${weather_data.uvi || 'N/A'}`;
        air_quality.innerHTML = `${weather_data.air_quality || 'N/A'}`;
        sunrise.innerHTML = `${new Date(weather_data.sys.sunrise * 1000).toLocaleTimeString()}`;
        sunset.innerHTML = `${new Date(weather_data.sys.sunset * 1000).toLocaleTimeString()}`;

        switch (weather_data.weather[0].main) {
            case 'Clouds':
                weather_img.src = "assets/cloud.png";
                break;
            case 'Clear':
                weather_img.src = "assets/clear.png";
                break;
            case 'Rain':
                weather_img.src = "assets/rain.png";
                break;
            case 'Mist':
                weather_img.src = "assets/mist.png";
                break;
            case 'Snow':
                weather_img.src = "assets/snow.png";
                break;
            default:
                weather_img.src = "assets/default.png";
                break;
        }
    } catch (error) {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
    }
}

async function getForecast(city) {
    const api_key = "f63667648a68784c45c0ac5d2be9888f"; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;

    try {
        const response = await fetch(url);
        const forecast_data = await response.json();

        forecastContainer.innerHTML = '';
        hourlyForecastContainer.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const dailyForecast = forecast_data.list[i * 8]; // 5-day forecast
            forecastContainer.innerHTML += `
                <div>
                    <p>${new Date(dailyForecast.dt_txt).toLocaleDateString()}</p>
                    <p>${Math.round(dailyForecast.main.temp)}°C</p>
                    <p>${dailyForecast.weather[0].description}</p>
                </div>
            `;
        }

        for (let i = 0; i < 8; i++) {
            const hourlyForecast = forecast_data.list[i]; // Next 8 hours forecast
            hourlyForecastContainer.innerHTML += `
                <div>
                    <p>${new Date(hourlyForecast.dt_txt).toLocaleTimeString()}</p>
                    <p>${Math.round(hourlyForecast.main.temp)}°C</p>
                    <p>${hourlyForecast.weather[0].description}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Unable to fetch forecast data", error);
    }
}

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const api_key = "f63667648a68784c45c0ac5d2be9888f"; // Your OpenWeatherMap API key
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`;

            try {
                const response = await fetch(url);
                const weather_data = await response.json();
                inputBox.value = weather_data.name;
                await checkWeather(weather_data.name);
                await getForecast(weather_data.name);
            } catch (error) {
                console.error("Unable to fetch weather data", error);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = 'Switch to Light Theme';
    } else {
        darkModeBtn.textContent = 'Switch to Dark Theme';
    }
}

searchBtn.addEventListener('click', async () => {
    const city = inputBox.value.trim();
    if (city) {
        await checkWeather(city);
        await getForecast(city);
    } else {
        alert("Please enter a location");
    }
});

darkModeBtn.addEventListener('click', toggleDarkMode);

// Set initial button text
darkModeBtn.textContent = 'Switch to Dark Theme';

getGeolocation();

