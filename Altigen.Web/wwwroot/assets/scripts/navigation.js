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
});
