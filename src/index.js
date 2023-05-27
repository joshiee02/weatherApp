import './style.css';

document.addEventListener('DOMContentLoaded', function() {
  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
     // adjust as needed for the gap between slides
    navigation: {
        nextEl: '#arrow',
    },
    allowTouchMove: true,
    slidesPerGroup: 3,
  });
})