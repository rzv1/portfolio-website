import {initTheme} from "./modules/core/theme-picker.js";
import {initBG} from "./modules/canvas/background.js";
import {initObserver} from "./modules/core/observer.js";
import {initHoloCards} from "./modules/animations/holo-cards.js";
import {initLightbox} from "./modules/core/light-box.js";
import {initNavbarScrollHide} from "./modules/core/navbar-auto-hide.js";
import {initFPSCounter} from "./modules/canvas/fps-counter.js";
import {initLenisScroll} from "./modules/animations/lenis-scroll.js";
import {init2DGridCanvas} from "./modules/canvas/three-canvas.js";
import {initGSAPAnimations} from "./modules/animations/gsap.js";


document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initBG();
    initObserver();
    initHoloCards();
    initLightbox();
    initNavbarScrollHide();
    initFPSCounter();

    initLenisScroll();
    init2DGridCanvas();
    initGSAPAnimations();
});