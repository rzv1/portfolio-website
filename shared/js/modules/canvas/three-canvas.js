import {initGridShapesTimeline} from "../timelines/grid-shapes-timeline.js";

/**
 * Initializes and configures a 2D grid canvas, supporting dynamic resizing, smooth scrolling, and animated margin-based shapes.
 * This method selectively displays or hides the canvas based on the current page context (visible only on the home page).
 * It also ensures that the canvas adapts to window resizing and enables fluid interactions and animations.
 *
 * @return {void} Does not return a value; sets up and manages the canvas directly as part of the page’s DOM lifecycle.
 */
export function init2DGridCanvas() {
    let gridShapes = [];
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Formele apar doar pe pagina principala (index.html), nu pe paginile de proiecte
    const path = window.location.pathname;
    const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    if (!isHomePage) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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

    const GRID_STEP = 45;

    // Color helper
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    function lerpColor(c1Hex, c2Hex, t) {
        const c1 = hexToRgb(c1Hex);
        const c2 = hexToRgb(c2Hex);
        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Define 2D Shapes on Left & Right Margins
    // Base positions are given in grid column/row units
    gridShapes = [
        // Left Margin Shapes
        {
            type: 'square_filled',
            side: 'left',
            colOffset: 0,
            baseRow: 3,
            startCells: 1,
            maxCells: 3,
            colorStart: '#e63946', // Accent Red
            colorEnd: '#f4a261',   // Accent Yellow
            speedFactor: 1.2,
            entranceProgress: 0,
            entranceAlpha: 0
        },
        {
            type: 'concentric_circles',
            side: 'left',
            colOffset: 0,
            baseRow: 12,
            startCells: 1.5,
            maxCells: 3,
            colorStart: '#2a9d8f', // Accent Teal
            colorEnd: '#e63946',   // Accent Red
            speedFactor: 1.5,
            entranceProgress: 0,
            entranceAlpha: 0
        },
        {
            type: 'diamond_grid',
            side: 'left',
            colOffset: 1,
            baseRow: 17,
            startCells: 1.2,
            maxCells: 2.2,
            colorStart: '#30C03F', // Accent Green
            colorEnd: '#f4a261',   // Accent Yellow
            speedFactor: 1.4,
            entranceProgress: 0,
            entranceAlpha: 0
        },
        {
            type: 'square_outline',
            side: 'left',
            colOffset: 0,
            baseRow: 22,
            startCells: 2,
            maxCells: 1,
            colorStart: '#f4a261', // Accent Yellow
            colorEnd: '#2a9d8f',   // Accent Teal
            speedFactor: 1.8,
            entranceProgress: 0,
            entranceAlpha: 0
        },

        // Right Margin Shapes
        {
            type: 'concentric_circles',
            side: 'right',
            colOffset: 0,
            baseRow: 4,
            startCells: 2,
            maxCells: 1,
            colorStart: '#f4a261', // Accent Yellow
            colorEnd: '#e63946',   // Accent Red
            speedFactor: 1.3,
            entranceProgress: 0,
            entranceAlpha: 0
        },
        {
            type: 'square_outline',
            side: 'right',
            colOffset: -1,
            baseRow: 8,
            startCells: 1.5,
            maxCells: 2.5,
            colorStart: '#97CF43', // Accent Lime
            colorEnd: '#2a9d8f',   // Accent Teal
            speedFactor: 1.7,
            entranceProgress: 0,
            entranceAlpha: 0
        },
        {
            type: 'square_filled',
            side: 'right',
            colOffset: 0,
            baseRow: 14,
            startCells: 1,
            maxCells: 2.5,
            colorStart: '#e63946', // Accent Red
            colorEnd: '#2a9d8f',   // Accent Teal
            speedFactor: 1.6,
            entranceProgress: 0,
            entranceAlpha: 0
        },
        {
            type: 'diamond_grid',
            side: 'right',
            colOffset: 0,
            baseRow: 24,
            startCells: 1,
            maxCells: 2,
            colorStart: '#2a9d8f', // Accent Teal
            colorEnd: '#f4a261',   // Accent Yellow
            speedFactor: 1.9,
            entranceProgress: 0,
            entranceAlpha: 0
        }
    ];

    let smoothScrollOffset = 0;
    let smoothScrollRatio = 0;

    initGridShapesTimeline(gridShapes);

    function render2DGrid() {
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const targetScrollOffset = window.scrollY || window.pageYOffset || 0;
        const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
        const targetScrollRatio = Math.min(Math.max(targetScrollOffset / maxScroll, 0), 1);

        // LERP smooth scroll state (0.08 factor for silky 60fps physics)
        smoothScrollOffset += (targetScrollOffset - smoothScrollOffset) * 0.08;
        smoothScrollRatio += (targetScrollRatio - smoothScrollRatio) * 0.08;

        const containerWidth = Math.min(width, 880);
        const marginWidth = Math.max((width - containerWidth) / 2, 0);

        // Don't render margin shapes if viewport is too narrow (< 768px)
        if (width >= 768 && marginWidth >= GRID_STEP) {
            const totalCols = Math.floor(width / GRID_STEP);
            const leftContainerCol = Math.floor(((width - containerWidth) / 2) / GRID_STEP);
            const rightContainerCol = Math.floor(((width + containerWidth) / 2) / GRID_STEP);

            // Target column shifted closer to outer margins (approx 35% from outer screen edge)
            const leftOuterCol = Math.max(1, Math.floor(leftContainerCol * 0.35));
            const rightMarginCols = totalCols - rightContainerCol;
            const rightOuterCol = rightContainerCol + Math.ceil(rightMarginCols * 0.65);

            gridShapes.forEach((shape) => {
                let colX = 0;
                if (shape.side === 'left') {
                    const targetCol = Math.max(0, leftOuterCol + (shape.colOffset || 0));
                    colX = targetCol * GRID_STEP;
                } else {
                    const targetCol = Math.min(totalCols - 1, rightOuterCol + (shape.colOffset || 0));
                    colX = targetCol * GRID_STEP;
                }

                // Spatial position translate entrance on X axis
                const slideDirection = shape.side === 'left' ? -1 : 1;
                const slideDist = 140;
                const translateX = (1 - (shape.entranceProgress ?? 1)) * slideDist * slideDirection;
                colX += translateX;

                const alphaMultiplier = shape.entranceAlpha ?? 1;

                // Fluid continuous vertical motion snapped to grid paths
                const rawY = shape.baseRow * GRID_STEP - (smoothScrollOffset * 0.35 * shape.speedFactor);
                const wrappedY = ((rawY % (height + 300)) + (height + 300)) % (height + 300) - 150;
                const smoothY = wrappedY;

                // Dynamic LERP size transformation based on smooth scroll ratio
                const targetCellFactor = shape.startCells + (shape.maxCells - shape.startCells) * (Math.sin(smoothScrollRatio * Math.PI) * 0.5 + 0.5);
                if (typeof shape.currentFactor === 'undefined') shape.currentFactor = targetCellFactor;
                shape.currentFactor += (targetCellFactor - shape.currentFactor) * 0.08;
                const shapePixelSize = shape.currentFactor * GRID_STEP;

                // Dynamic color transformation along smooth scroll ratio
                const currentColor = lerpColor(shape.colorStart, shape.colorEnd, smoothScrollRatio);

                ctx.save();
                ctx.fillStyle = currentColor;
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = 2;

                if (shape.type === 'square_filled') {
                    ctx.globalAlpha = 0.85 * alphaMultiplier;
                    ctx.fillRect(colX, smoothY, shapePixelSize, shapePixelSize);
                    ctx.globalAlpha = 1.0 * alphaMultiplier;
                    ctx.strokeRect(colX, smoothY, shapePixelSize, shapePixelSize);
                } else if (shape.type === 'square_outline') {
                    ctx.globalAlpha = 0.9 * alphaMultiplier;
                    ctx.strokeRect(colX, smoothY, shapePixelSize, shapePixelSize);
                    ctx.globalAlpha = 0.25 * alphaMultiplier;
                    ctx.fillRect(colX, smoothY, shapePixelSize, shapePixelSize);
                } else if (shape.type === 'concentric_circles') {
                    const centerX = colX + (shape.side === 'right' ? -shapePixelSize / 2 : shapePixelSize / 2);
                    const centerY = smoothY + shapePixelSize / 2;
                    const r1 = shapePixelSize / 2;
                    const r2 = r1 * 0.6;

                    ctx.globalAlpha = 0.9 * alphaMultiplier;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r1, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.globalAlpha = 0.4 * alphaMultiplier;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (shape.type === 'diamond_grid') {
                    const cx = colX + shapePixelSize / 2;
                    const cy = smoothY + shapePixelSize / 2;
                    const r = shapePixelSize / 2;

                    ctx.globalAlpha = 0.9 * alphaMultiplier;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - r);
                    ctx.lineTo(cx + r, cy);
                    ctx.lineTo(cx, cy + r);
                    ctx.lineTo(cx - r, cy);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.globalAlpha = 0.2 * alphaMultiplier;
                    ctx.fill();
                }

                ctx.restore();
            });
        }

        ctx.restore();
        requestAnimationFrame(render2DGrid);
    }

    requestAnimationFrame(render2DGrid);
}