import {initScrollSnakeEngine} from "./snake-engine.js";

export function initScrollShowcase() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP / ScrollTrigger not loaded.');
        return;
    }

    //gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.scroll-showcase-section');
    if (!section) return;

    const badgeEl = document.querySelector('.hud-phase-badge');
    const titleEl = document.querySelector('.hud-phase-title');
    const progressFill = document.querySelector('.hud-progress-fill');

    const stageDiagrams = document.querySelector('.stage-diagrams');
    const stageInterfaces = document.querySelector('.stage-interfaces');
    const stageTech = document.querySelector('.stage-tech');

    const diagramCards = document.querySelectorAll('.diagram-3d-card');
    const groupCustomer = document.querySelector('.group-customer');
    const groupManager = document.querySelector('.group-manager');
    const interfaceCards = document.querySelectorAll('.interface-card-item');
    const techCards = document.querySelectorAll('.tech-3d-card');

    const viewport = document.querySelector('.showcase-viewport');

    /**
     * Animate viewport height based on stage content height.
     * @param stageEl - stage container that contains multiple cards
     */
    function setDynamicViewportHeight(stageEl) {
        if (!viewport || !stageEl) return;
        // Measure natural content height
        const inner = stageEl.querySelector('.stage-diagrams-grid, .stage-interfaces-wrap, .stage-tech-grid') || stageEl;
        const h = inner.offsetHeight || inner.scrollHeight;
        if (h > 0) {
            // clamp sets min, max capping for the desired value
            const targetH = gsap.utils.clamp(360, window.innerHeight - 180, h + 40);
            gsap.to(viewport, { height: targetH, duration: 0.4, ease: 'power2.out' });
        }
    }

    // Initial Visibility & Height Setup (Hard Pan pe Axa X)
    gsap.set(stageDiagrams, { opacity: 1, x: '0%', pointerEvents: 'auto' });
    gsap.set(diagramCards, { x: 0 });
    gsap.set(stageInterfaces, { opacity: 1, x: '100%', pointerEvents: 'none' });
    if (groupCustomer) gsap.set(groupCustomer, { opacity: 1, x: '0%', pointerEvents: 'auto' });
    if (groupManager) gsap.set(groupManager, { opacity: 1, x: '100%', pointerEvents: 'none' });
    gsap.set(stageTech, { opacity: 1, x: '100%', pointerEvents: 'none' });

    // Set initial dynamic viewport height on load and HUD color
    updateHUD('01 / 03', 'SYSTEM ARCHITECTURE DIAGRAMS', 0, '#E63946');
    setTimeout(() => setDynamicViewportHeight(stageDiagrams), 50);

    // Master Scroll-Driven Timeline
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=3800', // Scroll distance for scrub sequence
            pin: true,
            pinReparent: true,
            scrub: 1, // duration is now in terms of scroll distance, not seconds
            anticipatePin: 1,
            onUpdate: (self) => {
                const realProgress = Math.round(self.progress * 100);
                updateProgressOnly(realProgress);
            }
        }
    });

    // Initialize Scroll-Driven Background Snake Game Engine
    initScrollSnakeEngine(section);

    // -------------------------------------------------------------
    // PHASE 1: SYSTEM DIAGRAMS (0.0 -> 0.30 progress)
    // -------------------------------------------------------------
    masterTl
        .to({}, {
            duration: 0.1,
            onStart: () => {
                updateHUD('01 / 03', 'SYSTEM ARCHITECTURE DIAGRAMS', 33, '#E63946');
                setDynamicViewportHeight(stageDiagrams);
            },
            onReverseComplete: () => {
                updateHUD('01 / 03', 'SYSTEM ARCHITECTURE DIAGRAMS', 33, '#E63946');
                setDynamicViewportHeight(stageDiagrams);
            }
        })
        // Hold Diagrams view on load
        .to({}, { duration: 1.0 })
        // Diagrams Exit (Hard Pan la stânga pe axa X)
        .to(stageDiagrams, { x: '-100%', pointerEvents: 'none', duration: 1.0, ease: 'power2.inOut' });

    // -------------------------------------------------------------
    // PHASE 2: USER INTERFACES (3 CONCURRENT IMAGES PER GROUP)
    // -------------------------------------------------------------
    masterTl
        // Interfaces Stage Enter (Group 1: Customer Interface - Slide direct de la dreapta)
        .to({}, {
            duration: 0.1,
            onStart: () => {
                updateHUD('02 / 03', 'CUSTOMER INTERFACE (3 CONCURRENT VIEWS)', 50, '#F4A261');
                setDynamicViewportHeight(stageInterfaces);
            },
            onReverseComplete: () => {
                updateHUD('02 / 03', 'CUSTOMER INTERFACE (3 CONCURRENT VIEWS)', 50, '#F4A261');
                setDynamicViewportHeight(stageInterfaces);
            }
        })
        .to(stageInterfaces, { x: '0%', pointerEvents: 'auto', duration: 1.0, ease: 'power2.inOut' })
        .to({}, { duration: 1.0 })

        // Swap to Group 2: Manager Interface (Hard Slide pe axa X)
        .to({}, {
            duration: 0.1,
            onStart: () => {
                updateHUD('02 / 03', 'MANAGER INTERFACE (3 CONCURRENT VIEWS)', 66, '#F4A261');
                setDynamicViewportHeight(stageInterfaces);
            },
            onReverseComplete: () => {
                updateHUD('02 / 03', 'MANAGER INTERFACE (3 CONCURRENT VIEWS)', 66, '#F4A261');
                setDynamicViewportHeight(stageInterfaces);
            }
        })
        .to(groupCustomer, { x: '-100%', pointerEvents: 'none', duration: 0.8, ease: 'power2.inOut' })
        .to(groupManager, { x: '0%', pointerEvents: 'auto', duration: 0.8, ease: 'power2.inOut' }, '-=0.8')
        .to({}, { duration: 1.0 })

        // Interfaces Stage Exit (Hard Pan la stânga pe axa X)
        .to(stageInterfaces, { x: '-100%', pointerEvents: 'none', duration: 1.0, ease: 'power2.inOut' });

    // -------------------------------------------------------------
    // PHASE 3: TECHNOLOGY ECOSYSTEM (0.70 -> 1.0 progress)
    // -------------------------------------------------------------
    masterTl
        // HUD Update for Phase 3
        .to({}, {
            duration: 0.1,
            onStart: () => {
                updateHUD('03 / 03', 'HARVEST TECHNOLOGY ECOSYSTEM', 100, '#2A9D8F');
                setDynamicViewportHeight(stageTech);
            },
            onReverseComplete: () => {
                updateHUD('03 / 03', 'HARVEST TECHNOLOGY ECOSYSTEM', 100, '#2A9D8F');
                setDynamicViewportHeight(stageTech);
            }
        })
        // Tech Stage Enter (Slide direct de la dreapta + Hard Slide carduri si continut din exterior)
        .to(stageTech, { x: '0%', pointerEvents: 'auto', duration: 1.0, ease: 'power2.inOut' })
        .fromTo(techCards,
            { x: '120%' },
            { x: '0%', stagger: 0.15, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
        );

    // Animate inner contents of tech cards from outside card bounds
    techCards.forEach((card) => {
        card.style.overflow = 'hidden';
        const icon = card.querySelector('.tech-icon-img');
        const tag = card.querySelector('.tech-tag');
        const title = card.querySelector('h4');
        const desc = card.querySelector('p');

        if (icon) {
            masterTl.fromTo(icon, { x: '-150%' }, { x: '0%', duration: 0.4, ease: 'power3.out' }, '-=0.6');
        }
        if (tag) {
            masterTl.fromTo(tag, { x: '150%' }, { x: '0%', duration: 0.4, ease: 'power3.out' }, '-=0.6');
        }
        if (title) {
            masterTl.fromTo(title, { x: '-120%' }, { x: '0%', duration: 0.4, ease: 'power3.out' }, '-=0.55');
        }
        if (desc) {
            masterTl.fromTo(desc, { y: '150%' }, { y: '0%', duration: 0.4, ease: 'power3.out' }, '-=0.5');
        }
    });

    masterTl.to({}, { duration: 1.2 });

    /**
     * Updates the HUD (Heads-Up Display) elements with the provided values.
     *
     * @param {string} badge - The badge text to display in the HUD (e.g., 1/3).
     * @param {string} title - The title text to display in the HUD.
     * @param {number} progress - The progress percentage to display in the HUD.
     * @param {string} [color] - Optional. The color to apply to the badge and progress bar.
     * @return {void} This method does not return any value.
     */
    function updateHUD(badge, title, progress, color) {
        if (badgeEl) {
            badgeEl.textContent = badge;
            if (color) badgeEl.style.backgroundColor = color;
        }
        if (titleEl) titleEl.textContent = title;
        if (progressFill) {
            if (color) progressFill.style.backgroundColor = color;
        }
    }

    function updateProgressOnly(progress) {
        if (!progressFill) return;
        progressFill.style.width = `${progress*100}%`;
    }
}