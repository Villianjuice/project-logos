'use strict'
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    freeMode: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});