/**
 * Initializes a GSAP timeline animation for an element with the class 'about-container'.
 * The animation handles entrance effects for the container, headers, and paragraphs when the section enters the viewport.
 *
 * @return {void} No return value.
 */
export function initAboutCardTimeline() {
    const aboutCard = document.querySelector('.about-container');
    if (aboutCard) {
        aboutCard.style.overflow = 'hidden';

        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutCard,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        aboutTl
            .fromTo(
                aboutCard,
                { x: 120 },
                { x: 0, duration: 0.5, ease: 'power3.out' }
            );

        const aboutHeaders = aboutCard.querySelectorAll('h3, h4');
        const aboutParas = aboutCard.querySelectorAll('p');
        if (aboutHeaders.length > 0) {
            aboutTl.fromTo(
                aboutHeaders,
                { x: '-120%' },
                { x: '0%', duration: 0.45, stagger: 0.1, ease: 'power3.out' },
                '-=0.4'
            );
        }
        if (aboutParas.length > 0) {
            aboutTl.fromTo(
                aboutParas,
                { x: '120%' },
                { x: '0%', duration: 0.45, stagger: 0.1, ease: 'power3.out' },
                '-=0.4'
            );
        }
    }
}