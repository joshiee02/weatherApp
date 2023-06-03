import './style.css';

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

let weatherData;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    return null;
  }
}

// gets today temperature
async function getTemperature() {
  try {
    const temperature = document.querySelector('#temperature');
    temperature.textContent = `${weatherData.current.temp_c}°`;
    console.log(weatherData);
    console.log(weatherData.forecast.forecastday[0].day.maxtemp_c);
  } catch (err) {
    console.log(err);
  }
}

// gets today summary
async function getDailySummary() {
  try {
    const dailySummary = document.querySelector('#dailySummary + p');
    dailySummary.textContent = '';

    const s1 = document.createTextNode(`Now it feels like +${weatherData.current.feelslike_c}°, actually +${weatherData.current.temp_c}°. `);
    dailySummary.appendChild(s1);

    const br1 = document.createElement('br');
    dailySummary.appendChild(br1);

    const s2 = document.createTextNode('It feels hot because of the direct sun. Today, ');
    dailySummary.appendChild(s2);

    const br2 = document.createElement('br');
    dailySummary.appendChild(br2);

    const s3 = document.createTextNode(`the temperature is felt in the range from +${weatherData.forecast.forecastday[0].day.mintemp_c}° to ${weatherData.forecast.forecastday[0].day.maxtemp_c}°.`);
    dailySummary.appendChild(s3);
  } catch (err) {
    console.log(err);
  }
}

(async function runsAtStart() {
  weatherData = await fetchData('http://api.weatherapi.com/v1/forecast.json?key=5d8ec60449724cc5ad342032232605&q=Davao')
  getTemperature();
  getDailySummary();
}());
