/**
 * Auto-hide navbar on scroll
 * Uses window scroll event listener to get scrollY position and compute scroll direction and velocity.
 */
export function initNavbarScrollHide() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    const threshold = 12; // Scroll threshold in pixels for hiding/showing navbar
    let isHidden = false;

    function handleScroll() {
        const currentScrollY = window.scrollY || window.pageYOffset || 0;

        // If near top of page (less than 80px), always keep visible
        if (currentScrollY <= 80) {
            if (isHidden) {
                navbar.classList.remove('nav-hidden');
                isHidden = false;
            }
            lastScrollY = currentScrollY;
            return;
        }

        const delta = currentScrollY - lastScrollY;

        if (delta > threshold && !isHidden) {
            // Scroll down -> hide navbar
            navbar.classList.add('nav-hidden');
            isHidden = true;
        } else if (delta < -threshold && isHidden) {
            // Scroll up -> show navbar
            navbar.classList.remove('nav-hidden');
            isHidden = false;
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}