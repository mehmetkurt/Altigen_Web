// Main Slider Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if swiper element exists to avoid errors on pages without slider
    if (document.querySelector('.main-slider')) {
        const swiper = new Swiper(".main-slider", {
            spaceBetween: 30,
            effect: "fade",
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }
});
