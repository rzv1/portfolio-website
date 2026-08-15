export function initLenisScroll() {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis library not detected. Falling back to native scroll.');
        return;
    }

    let lenis;

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exp ease-out
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false
    });

    // Sync with GSAP ScrollTrigger if available, otherwise use native RAF loop
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Update scrollTrigger's scroll position based on lenis interpolated position.
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });

        // Add lenis rendering on the same rendering tick to avoid jittering animation because of
        // scroll position overwrite
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}