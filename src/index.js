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

// const getWeather = async function () {
//   try {

//   } catch (error) {
//     console.log(error);
//   }
// }

(function runsAtStart() {
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  async function getTemperature() {
    try {
      const data = await fetchData('http://api.weatherapi.com/v1/current.json?key=5d8ec60449724cc5ad342032232605&q=Davao');
      console.log(data);

      const temperature = document.querySelector('#temperature');
      temperature.textContent = `${data.current.temp_c}°`;
    } catch (err) {
      console.log(err);
    }
  }

  getTemperature();
}());
