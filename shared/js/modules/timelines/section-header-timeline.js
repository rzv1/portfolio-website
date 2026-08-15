/**
 * Initializes animations for section headers using GSAP and ScrollTrigger.
 * Animations include transformations and transitions for associated elements
 * such as shapes, lines, and header text within `.section-header-wrap` containers.
 *
 * This function applies animations to all elements matching the `.section-header-wrap`
 * selector. It sets up scroll-based triggers to play or reverse animations based on
 * scroll position.
 *
 * @return {void} No return value.
 */
export function initSectionHeaderTimeline() {
    document.querySelectorAll('.section-header-wrap').forEach((wrap) => {
        const line = wrap.querySelector('.section-line');
        const shape = wrap.querySelector('.bauhaus-dot, .bauhaus-square');
        const header = wrap.querySelector('.section-header');

        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: wrap,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        if (shape) {
            headerTl.fromTo(
                shape,
                { x: -30 },
                { x: 0, duration: 0.35, ease: 'power3.out' }
            );
        }

        if (header) {
            headerTl.fromTo(
                header,
                { x: -60, letterSpacing: '0.15em' },
                { x: 0, letterSpacing: '0.05em', duration: 0.45, ease: 'power3.out' },
                '-=0.25'
            );
        }

        if (line) {
            headerTl.fromTo(
                line,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 0.5, ease: 'power2.out' },
                '-=0.3'
            );
        }
    });
}