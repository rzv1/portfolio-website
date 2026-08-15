/**
 * IntersectionObserver vanilla JS API for lazy loading elements with animation
 */
export function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // fade-in CSS animation
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
            // fade-out CSS animation
            else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.1 }); // % of element visible in viewport to trigger animation

    // all elements with class 'reveal' will be observed
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}