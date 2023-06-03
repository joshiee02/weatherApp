import './style.css';
import { format, parse } from 'date-fns';

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    // adjust as needed for the gap between slides
    navigation: {
      nextEl: '#arrow',
    },
    allowTouchMove: true,
    slidesPerGroup: 3,
  });
});

let data;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const returnData = await response.json();
    return returnData;
  } catch (err) {
    return null;
  }
}

// gets today temperature
async function getTemperature() {
  try {
    const temperature = document.querySelector('#temperature');
    temperature.textContent = `${data.current.temp_c}°`;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

// gets today summary
async function getDailySummary() {
  try {
    // get weatherInfo and change the first letter into upperCase
    const weather = document.querySelector('#weather');
    const string = data.forecast.forecastday[0].day.condition.text;
    const upperCase = string
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
    weather.textContent = upperCase;

    // update dailySummary;
    const dailySummary = document.querySelector('#dailySummary + p');
    dailySummary.textContent = '';

    const s1 = document.createTextNode(`Now it feels like +${data.current.feelslike_c}°, actually +${data.current.temp_c}°. `);
    dailySummary.appendChild(s1);

    const br1 = document.createElement('br');
    dailySummary.appendChild(br1);

    const s2 = document.createTextNode('It feels hot because of the direct sun. Today, ');
    dailySummary.appendChild(s2);

    const br2 = document.createElement('br');
    dailySummary.appendChild(br2);

    const s3 = document.createTextNode(`the temperature is felt in the range from +${data.forecast.forecastday[0].day.mintemp_c}° to ${data.forecast.forecastday[0].day.maxtemp_c}°.`);
    dailySummary.appendChild(s3);
  } catch (err) {
    console.log(err);
  }
}

// gets the location of the weather
async function getLocation() {
  try {
    const city = document.querySelector('#city');
    city.textContent = data.location.name;
  } catch (err) {
    console.log(err);
  }
}

async function getDate() {
  try {
    const date = document.querySelector('#date');
    const currentDate = parse(data.location.localtime, 'yyyy-MM-dd HH:mm', new Date());
    const formattedDate = format(currentDate, 'EEEE, MMMM d');
    date.textContent = formattedDate;
  } catch (err) {
    console.log(err);
  }
}

async function getWeatherInfo() {
  try {
    const windSpeed = document.querySelector('#windSpeedData');
    windSpeed.textContent = `${data.current.wind_kph}km/h`;

    const humidity = document.querySelector('#humidityData');
    humidity.textContent = `${data.current.humidity}%`;

    const visibility = document.querySelector('#visibilityData');
    visibility.textContent = `${data.current.vis_km}km`;
  } catch (err) {
    console.log(err);
  }
}

(async function runsAtStart() {
  data = await fetchData('http://api.weatherapi.com/v1/forecast.json?key=5d8ec60449724cc5ad342032232605&q=Kikugawa');
  getTemperature();
  getDailySummary();
  getLocation();
  getDate();
  getWeatherInfo();
}());
