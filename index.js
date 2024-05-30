// Classes
const userWeather = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchContainer = document.querySelector('.search-container');
const loader = document.querySelector('.loading-container');
const weatherContainer = document.querySelector('.user-weather-info');

// Custom Attributes
const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const dataAccessBtn = document.querySelector('[data-grantAccess]');
const city = document.querySelector('[data-cityName]');
const flag = document.querySelector('[data-countryFlag]');
const searchForm = document.querySelector('[data-searchForm]');
const weatherDesc = document.querySelector('[data-weatherDescription');
const weatherIcon = document.querySelector('[data-weatherIcon]');
const temp = document.querySelector('[data-temp]');
const windspeed = document.querySelector('[data-windSpeed]');
const humidity = document.querySelector('[data-humidity]');
const cloud = document.querySelector('[data-cloud]');
const errorContainer = document.querySelector('[data-errorContainer]');


// variables
let currentTab = userTab;
let key = "82b88b1f9a65e67e737dca5caa1db1b1";
currentTab.classList.add("current-tab");
getFromSessionStorage();


// Functions
function switchTab(tab) {
    if (currentTab == tab) return;
    errorContainer.classList.remove('active');
    currentTab.classList.remove("current-tab");
    currentTab = tab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains('active')) {
        weatherContainer.classList.remove('active');
        grantAccessContainer.classList.remove('active');
        searchForm.classList.add('active');
    }
    else {
        // alert('user location');
        searchForm.classList.remove('active');
        weatherContainer.classList.remove('active');
        getFromSessionStorage();
    }
}

function getFromSessionStorage() {
    const location = sessionStorage.getItem('location')

    if (!location) {
        grantAccessContainer.classList.add('active');
    }
    else {
        const userLocation = JSON.parse(location);
        fetchUserWeatherInfo(userLocation);
        grantAccessContainer.classList.remove('active');
        loader.classList.add('active');
    }
}

function renderWeather(data) {
    city.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = data?.main?.temp + '°C';
    windspeed.innerText = data?.wind?.speed + 'm/s';
    humidity.innerText = data?.main?.humidity + '%';
    cloud.innerText = data?.clouds?.all + '%';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation);
    }
    else {
        const subtitle = document.querySelector('.subtitle');
        subtitle.innerText = "You denied the request for Geolocation.";
    }
}

function setLocation(position) {
    let location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };


    sessionStorage.setItem('location', JSON.stringify(location));
    getFromSessionStorage();
}

async function fetchUserWeatherInfo(location) {
    const { lat, lon } = location;
    grantAccessContainer.classList.remove('active');
    loader.classList.add('active');

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        let data = await response.json();
        loader.classList.remove('active');
        grantAccessContainer.classList.remove('active');
        weatherContainer.classList.add('active');
        renderWeather(data);
    }
    catch (err) {
        loader.classList.remove('active');
        // errorContainer.classList.add('active');
    }
}

async function fetchSearchWeatherInfo(city) {
    grantAccessContainer.classList.remove('active');
    weatherContainer.classList.remove('active');
    loader.classList.add('active');

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
        let data = await response.json();
        loader.classList.remove('active');
        if (data.cod !== 200) {
            throw new Error("City Not Found");
        }
        weatherContainer.classList.add('active');
        renderWeather(data);
        errorContainer.classList.remove('active');
    } catch (er) {
        // alert(er);
        errorContainer.classList.add('active');
    }

}

// EventsListners

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

dataAccessBtn.addEventListener('click', () => {
    getLocation();
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('[data-searchInput]');
    let city = input.value.trim();
    if (city === "") return;
    fetchSearchWeatherInfo(city);
    input.value = "";
});