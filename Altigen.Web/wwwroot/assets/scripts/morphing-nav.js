class MorphingNav {
    constructor(element) {
        this.element = element;
        this.mainNav = this.element.querySelector('.main-nav');
        this.triggers = this.element.querySelectorAll('.has-dropdown');
        this.dropdownList = this.element.querySelector('.morph-dropdown-list');
        this.dropdownWrapper = this.element.querySelector('.morph-dropdown-wrapper');
        this.bgLayer = this.element.querySelector('.bg-layer');
        this.arrow = this.element.querySelector('.arrow');
        this.contentWrapper = this.element.querySelector('.dropdown-content-wrapper');
        
        this.dropdownListItems = this.dropdownList.querySelectorAll('.morph-content');


        
        this.bindEvents();
    }

    bindEvents() {
        const self = this;

        // Select ALL nav items, not just triggers, to handle closing when hovering siblings
        const allNavItems = this.mainNav.querySelectorAll('.nav-item');

        allNavItems.forEach(item => {
            item.addEventListener('mouseenter', (event) => {
                // Clear any pending hide timer immediately
                if (self.hideTimeout) clearTimeout(self.hideTimeout);

                const isTrigger = item.classList.contains('has-dropdown');

                if (isTrigger) {
                    self.showDropdown(item);
                } else {
                    // If hovering a simple link (like Home) while menu is open, close it
                    self.hideDropdown();
                    // Optional: You might want to remove active class from triggers here too if not handled in hideDropdown
                }
            });
        });

        this.element.addEventListener('mouseleave', () => {
             // Hover Intent: Wait before closing to allow crossing the gap
             self.hideTimeout = setTimeout(() => {
                 self.hideDropdown();
             }, 300); // 300ms delay
        });

        this.element.addEventListener('mouseenter', () => {
            // If user comes back (or enters the dropdown wrapper), cancel hide
            if (self.hideTimeout) clearTimeout(self.hideTimeout);
        });
        
        window.addEventListener('resize', () => {
             self.hideDropdown();
        });
    }

    showDropdown(trigger) {
        // 1. Get Target Content ID from Trigger
        this.activeTrigger = trigger; 
        const targetId = trigger.getAttribute('data-target');
        const selectedDropdown = document.getElementById(targetId);

        if (!selectedDropdown) return; 

        // 2. Add Active Classes
        this.triggers.forEach(t => t.querySelector('.nav-link').classList.remove('active'));
        this.dropdownListItems.forEach(c => c.classList.remove('active'));

        trigger.querySelector('.nav-link').classList.add('active'); 
        selectedDropdown.classList.add('active'); 
        
        // Check if menu is ALREADY open
        const isAlreadyVisible = this.element.classList.contains('is-dropdown-visible');

        this.element.classList.add('is-dropdown-visible');
        this.dropdownWrapper.classList.add('active');

        // 3. Calculate Dimensions & Positions
        // CRITICAL FIX: Reset wrapper width so the new content isn't clamped by the OLD width.
        // The child has max-width: 100%, so if parent is small, child wraps early. We must uncage it.
        this.contentWrapper.style.width = '';
        this.contentWrapper.style.height = ''; 

        const targetWidth = selectedDropdown.offsetWidth;
        const targetHeight = selectedDropdown.offsetHeight;
        
        const triggerRect = trigger.getBoundingClientRect();
        const navRect = this.element.getBoundingClientRect(); 

        let leftPosition = (triggerRect.left + triggerRect.width / 2) - (targetWidth / 2) - navRect.left;

        // --- Collision Detection ---
        const windowWidth = window.innerWidth;
        const absoluteRight = navRect.left + leftPosition + targetWidth;
        const offset = 15; // Padding from window edge

        // 1. Right Edge Collision
        if (absoluteRight > windowWidth - offset) {
            const excess = absoluteRight - (windowWidth - offset);
            leftPosition -= excess;
        }

        // 2. Left Edge Collision (Generic clamp)
        if (navRect.left + leftPosition < offset) {
             leftPosition = offset - navRect.left;
        }
        
        // 4. Apply Transforms
        // CRITICAL FIX: If first open, disable transition for a moment to prevent "slide from zero"
        if (!isAlreadyVisible) {
            this.bgLayer.style.transition = 'none';
            this.contentWrapper.style.transition = 'none';
            this.arrow.style.transition = 'none';
        }

        this.updateDropdown(targetHeight, targetWidth, leftPosition);

        if (!isAlreadyVisible) {
            // Force reflow
            void this.bgLayer.offsetWidth; 
            // Restore transitions
            this.bgLayer.style.transition = '';
            this.contentWrapper.style.transition = '';
            this.arrow.style.transition = '';
        }
    }

    hideDropdown() {
        this.element.classList.remove('is-dropdown-visible');
        this.dropdownWrapper.classList.remove('active');
        this.triggers.forEach(t => t.querySelector('.nav-link').classList.remove('active'));
        this.dropdownListItems.forEach(c => c.classList.remove('active'));
    }

    updateDropdown(height, width, left) {
        // Bg Layer: Scale to fit content
        this.bgLayer.style.width = width + 'px';
        this.bgLayer.style.height = height + 'px';
        this.bgLayer.style.transform = `translateX(${left}px)`;

        // Content Wrapper: Move to match bg position AND Resize to show content (Fixing 0 height issue)
        this.contentWrapper.style.transform = `translateX(${left}px)`;
        this.contentWrapper.style.width = width + 'px';
        this.contentWrapper.style.height = height + 'px';

        // Arrow: Point to the TRIGGER Center
        // This ensures if content is shifted (edge detection), arrow still points to the link
        if (this.activeTrigger) {
            const triggerRect = this.activeTrigger.getBoundingClientRect();
            const navRect = this.element.getBoundingClientRect(); // relative to main container
            const arrowX = (triggerRect.left + triggerRect.width / 2) - navRect.left - 6; // -6 for 12px width center
            this.arrow.style.transform = `translateX(${arrowX}px) rotate(45deg)`;
        }
        this.arrow.style.opacity = '1';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const morphNavs = document.querySelectorAll('.morph-navigation');
    if (morphNavs.length > 0) {
        morphNavs.forEach(nav => new MorphingNav(nav));
    }
});
