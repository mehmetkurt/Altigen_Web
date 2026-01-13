// Main Slider Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if swiper element exists to avoid errors on pages without slider
    if (document.querySelector('.main-slider')) {
        // Initialize Thumbnails Slider
        const thumbsSwiper = new Swiper(".main-slider-thumbs", {
            spaceBetween: 10,
            slidesPerView: "auto",
            freeMode: true,
            watchSlidesProgress: true,
        });

        const swiper = new Swiper(".main-slider", {
            spaceBetween: 30,
            effect: "fade",
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            thumbs: {
                swiper: thumbsSwiper,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }
});
