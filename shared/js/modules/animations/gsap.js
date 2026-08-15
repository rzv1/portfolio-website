import {initHeroTimeline} from "../timelines/hero-timeline.js";
import {initSectionHeaderTimeline} from "../timelines/section-header-timeline.js";
import {initProjectCardsTimeline} from "../timelines/project-cards-timeline.js";
import {initAboutCardTimeline} from "../timelines/about-card-timeline.js";
import {initFooterAnimation} from "../timelines/footer-timeline.js";

export function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP / ScrollTrigger not available.');
        return;
    }

    // 1. HERO SECTION ENTRANCE ANIMATIONS
    initHeroTimeline();

    // 2. SECTION HEADERS REVEAL
    initSectionHeaderTimeline();

    // 3. PROJECTS CARDS STAGGERED REVEAL
    initProjectCardsTimeline();

    // 4. ABOUT SECTION REVEAL
    initAboutCardTimeline();

    // 5. FOOTER REVEAL
    initFooterAnimation();
}