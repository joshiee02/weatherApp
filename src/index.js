import 'swiper/swiper-bundle.min.css';
import './style.css';
import { format, parse, parseISO } from 'date-fns';
import Swiper from 'swiper';

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: '#arrow',
    },
    allowTouchMove: true,
    slidesPerGroup: 4,
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
function getTemperature() {
  try {
    const temperature = document.querySelector('#temperature');
    temperature.textContent = `${data.current.temp_c}°`;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

// gets today summary
function getDailySummary() {
  try {
    // get weatherInfo and change the first letter into upperCase
    const weather = document.querySelector('#weather');
    const string = data.current.condition.text;
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
function getLocation() {
  try {
    const city = document.querySelector('#city');
    city.textContent = data.location.name;
  } catch (err) {
    console.log(err);
  }
}

function getDate() {
  try {
    const date = document.querySelector('#date');
    const currentDate = parse(data.location.localtime, 'yyyy-MM-dd HH:mm', new Date());
    const formattedDate = format(currentDate, 'EEEE, MMMM d');
    date.textContent = formattedDate;
  } catch (err) {
    console.log(err);
  }
}

function getWeatherInfo() {
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

function getTodayForecast() {
  function validateData(arr) {
    // if the array doesn't reach 10 length, add the tomorrow forecast
    if (arr.length < 8) {
      for (let i = 0; arr.length < 8; i += 1) {
        const tomorrowForecast = data.forecast.forecastday[1].hour;
        arr.push(tomorrowForecast[i]);
      }
    }

    // if array is more than 10 length, reduce it to 10 equally
    const result = [];
    const step = arr.length / 8;
    for (let i = 0; i < 8; i += 1) {
      result.push(arr[Math.round(i * step)]);
    }
    return result;
  }
  // filter the available hours to forecast based on current time
  const filteredHours = data.forecast.forecastday[0].hour.filter(
    (hour) => data.location.localtime < hour.time,
  );

  const forecastHours = validateData(filteredHours);
  return forecastHours;
}

function getIcon(param) {
  // const rainChance = param.chance_of_rain;
  // const { cloud } = param;
  // const willRain = param.will_it_rain;
  let icon;

  // sunny
  if (param.chance_of_rain === 0 && param.cloud < 50 && !param.will_it_rain) {
    icon = 'las la-sun';
  // cloudy
  } else if (param.chance_of_rain < 50 && param.cloud > 50 && !param.will_it_rain) {
    icon = 'las la-cloud-sun';
  // might rain
  } else if (param.chance_of_rain > 50 && param.cloud >= 50 && !param.will_it_rain) {
    icon = 'las la-cloud-rain';
  // rain
  } else if (param.chance_of_rain > 50 && param.cloud >= 50 && param.will_it_rain) {
    icon = 'las la-tint';
  }
  return icon;
}

function createSlide(temp, icon, time) {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const swiper = document.createElement('div');
  swiper.classList.add('swiper-slide');

  const forecastTemp = document.createElement('div');
  forecastTemp.classList.add('forecastTemp')
  forecastTemp.textContent = `${temp}°`;

  const forecastIcon = document.createElement('i');
  const iconClass = getIcon(icon);
  forecastIcon.classList.add(...iconClass.split(' '));

  const forecastTime = document.createElement('div');
  forecastTime.classList.add('forecastTime');
  const formattedTime = format(parseISO(time), 'h aa');
  forecastTime.textContent = formattedTime;

  swiper.appendChild(forecastTemp);
  swiper.appendChild(forecastIcon);
  swiper.appendChild(forecastTime);
  swiperWrapper.appendChild(swiper);
}

function createCarousel() {
  const forecastHours = getTodayForecast();
  console.log(forecastHours);

  for (let i = 0; i < forecastHours.length; i += 1) {
    createSlide(forecastHours[i].temp_c, forecastHours[i], forecastHours[i].time);
    console.log(i);
  }
}

(async function runsAtStart() {
  data = await fetchData('http://api.weatherapi.com/v1/forecast.json?key=5d8ec60449724cc5ad342032232605&q=Davao City&days=2');
  getTemperature();
  getDailySummary();
  getLocation();
  getDate();
  getWeatherInfo();
  getTodayForecast();
  createCarousel();
}());
