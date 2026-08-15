/**
 * Initializes the timeline animations and interactive effects for project cards within the `.projects-container` element.
 *
 * This method applies GSAP animations to project card elements, animating their entrance into view and the appearance of their child content.
 * It also adds a 3D tilt effect to cards on mouse hover to enhance interactivity.
 *
 * @return {void} No return value. This function modifies DOM styles and applies animations to elements dynamically.
 */
export function initProjectCardsTimeline() {
    // projects-container
    const projectCards = document.querySelectorAll('.projects-container .card');
    if (projectCards.length > 0) {
        projectCards.forEach((card) => {
            card.style.overflow = 'hidden';
            const header = card.querySelector('.card-header');
            const body = card.querySelector('.card-body');
            if (header) header.style.overflow = 'hidden';
            if (body) body.style.overflow = 'hidden';
        });

        const cardsTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.projects-container',
                start: 'top 80%',
                toggleActions: 'play none none reverse' // onEnter, onLeave (scroll downwards), onEnterBack, onLeaveBack (scroll upwards)
            }
        });

        cardsTl.fromTo(
            projectCards,
            { x: -120 },
            { x: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }
        );

        // Animate card content elements from outside card bounds
        projectCards.forEach((card) => {
            const headerTitle = card.querySelector('.card-header h3');
            const badge = card.querySelector('.card-header .ghlink');
            const listItems = card.querySelectorAll('.card-body ul li');
            const pills = card.querySelectorAll('.pills .pill');

            if (headerTitle) {
                cardsTl.fromTo(
                    headerTitle,
                    { x: '-120%' },
                    { x: '0%', duration: 0.45, ease: 'power3.out' },
                    '-=0.45'
                );
            }
            if (badge) {
                cardsTl.fromTo(
                    badge,
                    { x: '150%' },
                    { x: '0%', duration: 0.45, ease: 'power3.out' },
                    '-=0.45'
                );
            }
            if (listItems.length > 0) {
                cardsTl.fromTo(
                    listItems,
                    { x: '-120%' },
                    { x: '0%', duration: 0.4, stagger: 0.08, ease: 'power3.out' },
                    '-=0.4'
                );
            }
            if (pills.length > 0) {
                cardsTl.fromTo(
                    pills,
                    { y: '150%' },
                    { y: '0%', duration: 0.35, stagger: 0.06, ease: 'power3.out' },
                    '-=0.35'
                );
            }
        });

        // Add interactive 3D Tilt Effect on mouse hover over project cards
        projectCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(card, {
                    rotationY: (x / rect.width) * 10,
                    rotationX: -(y / rect.height) * 10,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.3
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });
        });
    }

    // View more button
    const moreBtn = document.querySelector('.moreBtn');
    if (moreBtn) {
        gsap.fromTo(
            moreBtn,
            { y: 50 },
            {
                y: 0,
                duration: 0.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: moreBtn,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
}