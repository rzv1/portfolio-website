/**
 * GSAP Timeline for Hero Section Animations
 */
export function initHeroTimeline() {
    const heroEl = document.querySelector('.hero');
    let heroTl;
    if (heroEl) {
        heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.45 } });

        // 4th param 'delay' is used to stagger the animation sequence
        heroTl
            .fromTo(
                '.hero-tag',
                { x: -50 },
                { x: 0, delay: 0.1 }
            )
            .fromTo(
                '.hero-text h1',
                { y: 50 },
                { y: 0 },
                '-=0.25'
            )
            .fromTo(
                '.hero-text p',
                { y: 40 },
                { y: 0 },
                '-=0.25'
            )
            .fromTo(
                '.hbutton',
                { x: 40 },
                { x: 0 },
                '-=0.2'
            )
            .fromTo(
                '.hicon',
                { y: 30 },
                { y: 0, stagger: 0.1 },
                '-=0.2'
            )
            .fromTo(
                '.hero-image-wrapper',
                { x: 60 },
                { x: 0, duration: 0.5 },
                '-=0.3'
            );

        // Subtle continuous floating motion for Citrus SVG
        gsap.to('.hero-image-wrapper', {
            y: 10,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.easeInOut'
        });
    }
}