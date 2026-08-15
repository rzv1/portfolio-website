/**
 * Initializes interactive holo-card effects on elements matching specific selectors.
 * Adds mouse movement and hover animations to create a 3D effect with glow and rotation.
 *
 * @return {void} Does not return a value. The method applies effects to DOM elements dynamically.
 */
export function initHoloCards() {
    const allCards = document.querySelectorAll('.project-hero, .card, .diagram-3d-card, .interface-card-item, .tech-3d-card');
    if (!allCards.length) return;
    if(gsap === undefined) return;
    allCards.forEach((card) => {
        card.classList.add('holo-card');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const px = (x / rect.width) * 100;
            const py = (y / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${px}%`);
            card.style.setProperty('--mouse-y', `${py}%`);
            card.style.setProperty('--glow-opacity', '1');

            const centerX = x - rect.width / 2;
            const centerY = y - rect.height / 2;
            if (typeof gsap !== undefined) {
                gsap.to(card, {
                    rotationY: (centerX / rect.width) * 12,
                    rotationX: -(centerY / rect.height) * 12,
                    scale: 1.02,
                    duration: 0.25,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    overwrite: 'auto'
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--glow-opacity', '0');
            if (typeof gsap !== undefined) {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });
    });

    // Force ScrollTrigger refresh after initial setup
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
}