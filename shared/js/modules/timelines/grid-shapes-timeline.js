/**
 * Initializes timeline animations for various grid shapes associated with different sections of the webpage.
 * The animations are set up for the hero section, projects section, and about section with specific entrance transitions.
 *
 * The animations use GSAP (GreenSock Animation Platform) to control the transitions,
 * including progress, alpha values, duration, stagger timing, and easing effects for the shapes.
 * Scroll-based triggers are utilized for the projects and about sections to control when animations start.
 *
 * @return {void} This method does not return any value.
 */
export function initGridShapesTimeline(gridShapes) {
    if (gridShapes && gridShapes.length > 0) {
        // Hero Top Shapes (Left shape 0, Right shape 4)
        const heroShapes = [gridShapes[0], gridShapes[4]].filter(Boolean);
        if (heroShapes.length > 0) {
            gsap.fromTo(
                heroShapes,
                { entranceProgress: 0, entranceAlpha: 0 },
                { entranceProgress: 1, entranceAlpha: 1, duration: 0.65, ease: 'power3.out', delay: 0.2 }
            );
        }

        // Projects Section Shapes (Shapes 1, 2, 5, 6)
        const projectsEl = document.querySelector('#projects');
        const projectShapes = [gridShapes[1], gridShapes[2], gridShapes[5], gridShapes[6]].filter(Boolean);
        if (projectsEl && projectShapes.length > 0) {
            gsap.fromTo(
                projectShapes,
                { entranceProgress: 0, entranceAlpha: 0 },
                {
                    entranceProgress: 1,
                    entranceAlpha: 1,
                    duration: 0.65,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#projects',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        // About Section Shapes (Shapes 3, 7)
        const aboutEl = document.querySelector('#about');
        const aboutShapes = [gridShapes[3], gridShapes[7]].filter(Boolean);
        if (aboutEl && aboutShapes.length > 0) {
            gsap.fromTo(
                aboutShapes,
                { entranceProgress: 0, entranceAlpha: 0 },
                {
                    entranceProgress: 1,
                    entranceAlpha: 1,
                    duration: 0.65,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#about',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }
}