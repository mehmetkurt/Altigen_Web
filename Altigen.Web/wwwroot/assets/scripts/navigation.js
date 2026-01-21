document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth >= 992) {
        var dropdowns = document.querySelectorAll('.nav-item.dropdown');
        if (dropdowns.length > 0 && typeof SV !== 'undefined') {
            SV.HoverIntent(dropdowns, {
                exitDelay: 500,
                interval: 100,
                sensitivity: 7,
                onEnter: function (elem) {
                    var toggle = elem.querySelector('.dropdown-toggle');
                    if (toggle) {
                        var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                        instance.show();
                    }
                },
                onExit: function (elem) {
                    var toggle = elem.querySelector('.dropdown-toggle');
                    if (toggle) {
                        var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                        instance.hide();
                    }
                }
            });
        }
    }


    // Sticky Header Logic
    var header = document.querySelector('.main-header');
    if (header) {
        var stickyOffset = 50; // Threshold to trigger sticky state
        
        var handleScroll = function() {
            if (window.scrollY > stickyOffset) {
                header.classList.add('sticky-active');
            } else {
                header.classList.remove('sticky-active');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Check initial state
        handleScroll();
    }
});
