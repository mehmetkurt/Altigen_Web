document.addEventListener("DOMContentLoaded", function() {
    // Only init if the gallery element exists
    const galleryEl = document.getElementById('blog-lightgallery');
    if (!galleryEl) return;

    // LightGallery Init
    if (typeof lightGallery !== 'undefined') {
        lightGallery(galleryEl, {
            plugins: [lgZoom, lgThumbnail],
            speed: 500,
            mode: 'lg-fade',
            download: false,
            selector: '.gallery-item',
            getCaptionFromTitleOrAlt: false
        });
    }

    // Swiper Responsive Init
    if (typeof Swiper !== 'undefined') {
        let blogSwiper;
        const initSwiper = () => {
            const isMobile = window.innerWidth < 992;
            
            if (isMobile && !blogSwiper) {
                blogSwiper = new Swiper('#blog-gallery-slider', {
                    slidesPerView: 1.1,
                    spaceBetween: 16,
                    centeredSlides: false,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            } else if (!isMobile && blogSwiper) {
                blogSwiper.destroy(true, true);
                blogSwiper = undefined;
                // Cleanup inline styles added by Swiper
                galleryEl.removeAttribute('style');
                document.querySelectorAll('.gallery-item').forEach(slide => slide.removeAttribute('style'));
            }
        };

        window.addEventListener('resize', initSwiper);
        initSwiper(); // Initial check
    }
});
