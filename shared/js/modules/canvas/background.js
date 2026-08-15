/**
 * Initializes a dynamic background canvas with a subtle interactive grid effect.
 * The canvas responds to mouse movement, creating a slight distortion effect around the cursor.
 * Additional custom background renderers can be included via `window.bgOverlayRenderers`.
 *
 * @return {void} No return value. Sets up and manages the background canvas behavior.
 */
export function initBG() {
    // Config vars
    const step = 45;       // Grid line spacing
    const radius = 150;    // Subtle distortion radius
    const maxPush = 10;    // Very subtle push distance (10px)
    const subStep = 10;    // Smooth line resolution

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

    // CanvasRenderingContext2D - drawing API
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    // devicePixelRatio - adjusts rendering quality for high-DPI screens
    // dpr = 1 -> 1px CSS = 1 real device pixel
    // dpr = 2 -> 1px CSS = 2x2 matrix real device pixels
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
        // LERP (Linear interpolation) mouse position for smooth tracking
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        prevMouseX = mouseX;
        prevMouseY = mouseY;

        // saves current canvas state as a restore point
        ctx.save();
        // scales to avoid autofitting canvas on high-DPI screens
        ctx.scale(dpr, dpr);
        // clears previous drawing
        ctx.clearRect(0, 0, width, height);

        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        // Constant subtle gray grid line color
        const lineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 18, 20, 0.08)';

        drawGrid(lineColor);

        // 2. Draw custom background overlay renderers (e.g., Snake Engine)
        if (window.bgOverlayRenderers && Array.isArray(window.bgOverlayRenderers)) {
            window.bgOverlayRenderers.forEach((rendererFn) => {
                try {
                    rendererFn({ ctx, width, height, dpr, step, isDark, getDisplacedPoint });
                } catch (e) {
                    console.error('Error in bgOverlayRenderer:', e);
                }
            });
        }

        // restores canvas scaling and props to the last saved state
        ctx.restore();
        // runs for each frame rendering
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}