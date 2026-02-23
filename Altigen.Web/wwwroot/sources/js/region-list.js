
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('regionFilterForm');
    
    if (filterForm) {
        const selects = filterForm.querySelectorAll('select');
        
        selects.forEach(select => {
            select.addEventListener('change', function() {
                // If district changes, we might want to reset neighborhood, but simple submit handles it server-side if we just reload
                // For better UX, we could clear child selects, but server logic will handle "invalid" combinations by ignoring them or showing empty.
                // However, to be cleaner:
                
                if (this.name === 'district') {
                    // If district changed, clear neighborhood (optional, but good practice)
                    const neighborhoodSelect = filterForm.querySelector('select[name="neighborhood"]');
                    if (neighborhoodSelect) {
                        neighborhoodSelect.value = '';
                    }
                }
                
                filterForm.submit();
            });
        });
    }
    // Scroll to results if filters or pagination are active
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('district') || urlParams.has('neighborhood') || urlParams.has('page')) {
        const element = document.getElementById('region-results');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
