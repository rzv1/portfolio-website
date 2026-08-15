/**
 * Initializes a footer animation using GSAP. The animation slides the footer into view
 * when it enters the specified scroll trigger area and reverses the animation when scrolling out.
 *
 * @return {void} Does not return a value.
 */
export function initFooterAnimation() {
    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.fromTo(
            footer,
            { y: 35 },
            {
                y: 0,
                duration: 0.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 95%',
                    once: true,
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
}