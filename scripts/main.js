// Bauhaus Portfolio Theme & Interactions Engine

function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    updateToggleIcons(theme);
}

function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.061-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18.75a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM6.166 18.894a.75.75 0 0 1-1.06-1.061l1.59-1.59a.75.75 0 0 1 1.06 1.06l-1.59 1.591ZM4.5 12a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 4.5 12ZM6.166 5.106a.75.75 0 0 0 1.06 1.06l1.591-1.591a.75.75 0 0 0-1.06-1.06L6.166 5.106Z"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd"/></svg>`;

    toggleBtns.forEach(btn => {
        btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
}

/**
 * Bauhaus Subtle Canvas Grid Engine with Motion Blur & Constant Gray Lines
 */
function initBG() {
    let container = document.querySelector('.bg-rift');
    if (!container) return;

    let canvas;
    if (container.tagName.toLowerCase() === 'canvas') {
        canvas = container;
    } else {
        canvas = document.createElement('canvas');
        canvas.className = 'bg-rift';
        canvas.setAttribute('aria-hidden', 'true');
        container.parentNode.replaceChild(canvas, container);
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 3;
    let targetX = mouseX;
    let targetY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let isMouseOver = false;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!isMouseOver) {
            mouseX = targetX;
            mouseY = targetY;
            prevMouseX = targetX;
            prevMouseY = targetY;
        }
        isMouseOver = true;
    });

    document.addEventListener('mouseleave', () => {
        isMouseOver = false;
    });

    const step = 45;       // Grid line spacing
    const radius = 150;    // Subtle distortion radius
    const maxPush = 10;    // Very subtle push distance (10px)
    const subStep = 12;    // Smooth line resolution

    function getDisplacedPoint(x, y) {
        if (!isMouseOver) return { x, y };
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius && dist > 0) {
            const factor = Math.pow(1 - dist / radius, 2) * maxPush;
            const pushX = (dx / dist) * factor;
            const pushY = (dy / dist) * factor;
            return { x: x + pushX, y: y + pushY };
        }
        return { x, y };
    }

    function drawGrid(lineColor) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = lineColor;

        // Horizontal lines
        for (let y = 0; y <= height + step; y += step) {
            ctx.beginPath();
            let first = true;
            for (let x = 0; x <= width + step; x += subStep) {
                const pt = getDisplacedPoint(x, y);
                if (first) {
                    ctx.moveTo(pt.x, pt.y);
                    first = false;
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();
        }

        // Vertical lines
        for (let x = 0; x <= width + step; x += step) {
            ctx.beginPath();
            let first = true;
            for (let y = 0; y <= height + step; y += subStep) {
                const pt = getDisplacedPoint(x, y);
                if (first) {
                    ctx.moveTo(pt.x, pt.y);
                    first = false;
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();
        }
    }

    function render() {
        // LERP mouse position for smooth tracking
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        prevMouseX = mouseX;
        prevMouseY = mouseY;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        // Constant subtle gray grid line color
        const lineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 18, 20, 0.08)';

        // 1. Draw base crisp subtle gray grid (Without heavy GPU ctx.filter blur)
        drawGrid(lineColor);

        // 2. Draw custom background overlay renderers (e.g. Snake Engine)
        if (window.bgOverlayRenderers && Array.isArray(window.bgOverlayRenderers)) {
            window.bgOverlayRenderers.forEach((rendererFn) => {
                try {
                    rendererFn({ ctx, width, height, dpr, step, isDark, getDisplacedPoint });
                } catch (e) {
                    console.error('Error in bgOverlayRenderer:', e);
                }
            });
        }

        ctx.restore();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');

    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll('.image-container').forEach((img) => {
        if (img.tagName === 'IMG' && img.src) {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.showModal();
                document.body.style.overflow = 'hidden';
            });
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.close();
            document.body.style.overflow = 'auto';
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.close();
            document.body.style.overflow = 'auto';
        }
    });
}

function initNavbarScrollHide() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    const threshold = 12;
    let isHidden = false;

    function handleScroll() {
        const currentScrollY = window.scrollY || window.pageYOffset || 0;

        // If near top of page (less than 80px), always keep visible
        if (currentScrollY <= 80) {
            if (isHidden) {
                navbar.classList.remove('nav-hidden');
                isHidden = false;
            }
            lastScrollY = currentScrollY;
            return;
        }

        const delta = currentScrollY - lastScrollY;

        if (delta > threshold && !isHidden) {
            // Scroll down -> hide navbar
            navbar.classList.add('nav-hidden');
            isHidden = true;
        } else if (delta < -threshold && isHidden) {
            // Scroll up -> show navbar
            navbar.classList.remove('nav-hidden');
            isHidden = false;
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}

function initFPSCounter() {
    const fpsWidget = document.createElement('div');
    fpsWidget.className = 'fps-counter-widget';
    fpsWidget.setAttribute('title', 'Real-time Performance Monitor');
    fpsWidget.innerHTML = `
        <span class="fps-dot"></span>
        <span class="fps-val">--</span>
        <span class="fps-unit">FPS</span>
        <span class="fps-divider">|</span>
        <span class="fps-ms">--ms</span>
    `;
    document.body.appendChild(fpsWidget);

    const fpsValEl = fpsWidget.querySelector('.fps-val');
    const fpsDotEl = fpsWidget.querySelector('.fps-dot');
    const fpsMsEl = fpsWidget.querySelector('.fps-ms');

    let frameCount = 0;
    let lastTime = performance.now();
    let lastFpsUpdate = performance.now();

    function step(now) {
        frameCount++;
        const frameDelta = now - lastTime;
        lastTime = now;

        if (now - lastFpsUpdate >= 400) {
            const elapsedTime = now - lastFpsUpdate;
            const fps = Math.min(Math.round((frameCount * 1000) / elapsedTime), 120);
            const frameMs = frameDelta.toFixed(1);

            if (fpsValEl) fpsValEl.textContent = fps;
            if (fpsMsEl) fpsMsEl.textContent = `${frameMs}ms`;

            if (fpsDotEl) {
                if (fps >= 50) {
                    fpsDotEl.style.backgroundColor = '#27c93f';
                    fpsDotEl.style.boxShadow = '0 0 8px rgba(39, 201, 63, 0.8)';
                } else if (fps >= 30) {
                    fpsDotEl.style.backgroundColor = '#ffbd2e';
                    fpsDotEl.style.boxShadow = '0 0 8px rgba(255, 189, 46, 0.8)';
                } else {
                    fpsDotEl.style.backgroundColor = '#ff5f56';
                    fpsDotEl.style.boxShadow = '0 0 8px rgba(255, 95, 86, 0.8)';
                }
            }

            frameCount = 0;
            lastFpsUpdate = now;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function initHoloCards() {
    const allCards = document.querySelectorAll('.project-hero, .card, .diagram-3d-card, .interface-card-item, .tech-3d-card, .media-box');
    allCards.forEach((card) => {
        if (card.classList.contains('holo-card-init')) return;
        card.classList.add('holo-card', 'holo-card-init');

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

            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    rotationY: (centerX / rect.width) * 10,
                    rotationX: -(centerY / rect.height) * 10,
                    scale: 1.015,
                    duration: 0.25,
                    ease: 'power1.out',
                    overwrite: 'auto'
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--glow-opacity', '0');
            if (typeof gsap !== 'undefined') {
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
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initBG();
    initObserver();
    initHoloCards();
    initLightbox();
    initNavbarScrollHide();
    initFPSCounter();
});