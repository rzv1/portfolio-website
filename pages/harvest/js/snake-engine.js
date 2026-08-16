export function initScrollSnakeEngine(section) {
    if (!section) return;

    let scrollProgress = 0;
    let isScrolling = false;
    let scrollTimer = null;
    let scrollPulsePhase = 0;

    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, 180);
    }, { passive: true });

    // Monitor showcase section ScrollTrigger progress
    ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=3800',
        onUpdate: (self) => {
            scrollProgress = self.progress;
        }
    });

    const activeParticles = [];

    // Milestone Node eaten states
    let node1Eaten = false;
    let node2Eaten = false;
    let node3Eaten = false;

    function triggerEatParticles(gx, gy, color) {
        // generate 24 random particles
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2; // 0 - 2 * pi angle
            const speed = 2.5 + Math.random() * 4.5;  // 2.5 - 7.5 px/frame
            activeParticles.push({
                x: gx, // init coords
                y: gy, // init coords
                vx: Math.cos(angle) * speed, // init velocity
                vy: Math.sin(angle) * speed, // init velocity
                color: color || '#E63946',
                size: 3 + Math.random() * 5, // 3 - 8 px
                alpha: 1, // opacity 100%
                decay: 0.025 + Math.random() * 0.02 // fade out over 0.3 - 0.5 sec
            });
        }
    }

    // Grid Path Generator
    let cachedWidth = 0;
    let cachedHeight = 0;
    let gridPath = [];
    let nodeIndices = { node1: 0, node2: 0, node3: 0 };

    function buildGridPath(width, height, step) {
        // prevent re-building grid path if width/height/step haven't changed'
        if (width === cachedWidth && height === cachedHeight && gridPath.length > 0) {
            return;
        }
        cachedWidth = width;
        cachedHeight = height;

        // Calculate Grid Dimensions
        const cols = Math.max(8, Math.floor(width / step));
        const rows = Math.max(8, Math.floor(height / step));

        // Grid snapped key waypoints
        const cLeft = 2;
        const cRight = cols - 3;
        const rTop = 2;
        const rMid1 = Math.floor(rows * 0.38);
        const rMid2 = Math.floor(rows * 0.68);
        const rBot = rows - 2;

        const waypoints = [
            { col: cLeft, row: rTop },                          // Start
            { col: cRight, row: rTop, isNode: 1 },              // Node 1 (Diagrams)
            { col: cRight, row: rMid1 },
            { col: cLeft, row: rMid1, isNode: 2 },              // Node 2 (Interfaces)
            { col: cLeft, row: rMid2 },
            { col: cRight, row: rMid2, isNode: 3 },              // Node 3 (Tech Stack)
            { col: cRight, row: rBot },
            { col: cLeft, row: rBot }
        ];

        gridPath = [];
        nodeIndices = { node1: 0, node2: 0, node3: 0 };

        for (let w = 0; w < waypoints.length - 1; w++) {
            const start = waypoints[w];
            const end = waypoints[w + 1];

            if (start.isNode === 1) nodeIndices.node1 = gridPath.length;
            if (start.isNode === 2) nodeIndices.node2 = gridPath.length;
            if (start.isNode === 3) nodeIndices.node3 = gridPath.length;

            // Calculate Directional Vectors
            const dCol = Math.sign(end.col - start.col);
            const dRow = Math.sign(end.row - start.row);

            let curC = start.col;
            let curR = start.row;

            // Manhattan Distance Grid Path
            while (curC !== end.col || curR !== end.row) {
                gridPath.push({ col: curC, row: curR });
                if (curC !== end.col) curC += dCol;
                else if (curR !== end.row) curR += dRow;
            }
        }
        // Add Final Grid Point
        gridPath.push({ col: waypoints[waypoints.length - 1].col, row: waypoints[waypoints.length - 1].row });
        if (waypoints[waypoints.length - 1].isNode === 3) {
            nodeIndices.node3 = gridPath.length - 1;
        }
    }

    // Register Canvas Overlay Renderer Hook
    window.bgOverlayRenderers = window.bgOverlayRenderers || [];
    window.bgOverlayRenderers.push(({ ctx, width, height, step, isDark, getDisplacedPoint }) => {
        // Check if section is near viewport
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

        buildGridPath(width, height, step);
        if (gridPath.length < 2) return;

        // Interpolate snake head position along grid path synced with GSAP stage transitions
        const maxIndex = gridPath.length - 1;

        const p1Norm = nodeIndices.node1 / maxIndex;
        const p2Norm = nodeIndices.node2 / maxIndex;
        const p3Norm = nodeIndices.node3 / maxIndex;

        // Stage transition progress keyframes matching master-timeline sequence
        const t1 = 0.233; // Stage 1 exit / Node 1 arrival
        const t2 = 0.657; // Stage 2 Manager swap / Node 2 arrival
        const t3 = 0.881; // Stage 3 Tech enter / Node 3 arrival

        let syncedProgress = scrollProgress;
        if (scrollProgress <= 0) {
            syncedProgress = 0;
        } else if (scrollProgress >= 1) {
            syncedProgress = 1;
        } else if (scrollProgress <= t1) {
            syncedProgress = (scrollProgress / t1) * p1Norm;
        } else if (scrollProgress <= t2) {
            syncedProgress = p1Norm + ((scrollProgress - t1) / (t2 - t1)) * (p2Norm - p1Norm);
        } else if (scrollProgress <= t3) {
            syncedProgress = p2Norm + ((scrollProgress - t2) / (t3 - t2)) * (p3Norm - p2Norm);
        } else {
            syncedProgress = p3Norm + ((scrollProgress - t3) / (1 - t3)) * (1 - p3Norm);
        }

        const targetHeadIndex = Math.min(Math.max(syncedProgress * maxIndex, 0), maxIndex);
        const headInt = Math.floor(targetHeadIndex);

        // Check Node eating triggers
        const n1Idx = nodeIndices.node1;
        const n2Idx = nodeIndices.node2;
        const n3Idx = nodeIndices.node3;

        const isN1EatenNow = (headInt >= n1Idx);
        const isN2EatenNow = (headInt >= n2Idx);
        const isN3EatenNow = (headInt >= n3Idx);

        if (isN1EatenNow && !node1Eaten) {
            const p1 = gridPath[n1Idx];
            triggerEatParticles(p1.col * step + step / 2, p1.row * step + step / 2, '#E63946');
        }
        if (isN2EatenNow && !node2Eaten) {
            const p2 = gridPath[n2Idx];
            triggerEatParticles(p2.col * step + step / 2, p2.row * step + step / 2, '#F4A261');
        }
        if (isN3EatenNow && !node3Eaten) {
            const p3 = gridPath[n3Idx];
            triggerEatParticles(p3.col * step + step / 2, p3.row * step + step / 2, '#2A9D8F');
        }

        node1Eaten = isN1EatenNow;
        node2Eaten = isN2EatenNow;
        node3Eaten = isN3EatenNow;

        // Dynamic Snake Length increases as nodes are eaten
        let targetSnakeLength = 6;
        if (node1Eaten) targetSnakeLength += 5;
        if (node2Eaten) targetSnakeLength += 5;
        if (node3Eaten) targetSnakeLength += 6;

        // Render Un-eaten Milestone Food Nodes on the Grid
        if (isScrolling) {
            scrollPulsePhase += 0.15;
        }
        const pulse = isScrolling ? (1 + Math.sin(scrollPulsePhase) * 0.24) : 1.0;

        const nodesInfo = [
            { idx: n1Idx, eaten: node1Eaten, label: '01 | DIAGRAMS', color: '#E63946' },
            { idx: n2Idx, eaten: node2Eaten, label: '02 | INTERFACES', color: '#F4A261' },
            { idx: n3Idx, eaten: node3Eaten, label: '03 | TECH STACK', color: '#2A9D8F' }
        ];

        nodesInfo.forEach((nd) => {
            if (!nd.eaten && gridPath[nd.idx]) {
                const cell = gridPath[nd.idx];
                const rawX = cell.col * step + step / 2;
                const rawY = cell.row * step + step / 2;
                const pt = getDisplacedPoint(rawX, rawY);

                const r = (step * 0.32) * pulse;

                ctx.save();
                // Outer aura ring
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r * 1.6, 0, Math.PI * 2);
                ctx.fillStyle = nd.color;
                ctx.globalAlpha = 0.22;
                ctx.fill();

                // Inner glowing food node with vector aura
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r * 1.25, 0, Math.PI * 2);
                ctx.fillStyle = nd.color;
                ctx.globalAlpha = 0.35;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
                ctx.fillStyle = nd.color;
                ctx.globalAlpha = 0.95;
                ctx.fill();

                // Node Label Tag
                ctx.font = '700 11px "Space Mono", monospace';
                ctx.fillStyle = isDark ? '#FFFFFF' : '#121214';
                ctx.globalAlpha = 0.85;
                ctx.fillText(nd.label, pt.x + step * 0.55, pt.y + 4);

                ctx.restore();
            }
        });

        // Calculate Trailing Snake Segments Positions
        const snakePoints = [];
        for (let seg = 0; seg < targetSnakeLength; seg++) {
            const idxFloat = targetHeadIndex - seg;
            if (idxFloat < 0) break;

            const iFloor = Math.floor(idxFloat);
            const iCeil = Math.min(iFloor + 1, maxIndex);
            const frac = idxFloat - iFloor;

            const pA = gridPath[iFloor];
            const pB = gridPath[iCeil];

            const interpCol = pA.col + (pB.col - pA.col) * frac;
            const interpRow = pA.row + (pB.row - pA.row) * frac;

            const rx = interpCol * step + step / 2;
            const ry = interpRow * step + step / 2;
            const pt = getDisplacedPoint(rx, ry);

            snakePoints.push({ x: pt.x, y: pt.y, rawX: rx, rawY: ry });
        }

        if (snakePoints.length === 0) return;

        // Render Snake Segments (Tail to Head)
        const segmentSize = step * 0.72;

        for (let i = snakePoints.length - 1; i >= 0; i--) {
            const pt = snakePoints[i];
            const isHead = (i === 0);
            const alpha = 1 - (i / targetSnakeLength) * 0.65;

            ctx.save();
            ctx.translate(pt.x, pt.y);

            // Segment Color: Red Head -> Orange Mid -> Cyan Tail
            let segColor = '#E63946'; // Red Head
            if (i > 0) {
                const ratio = i / targetSnakeLength;
                if (ratio < 0.5) {
                    segColor = '#F4A261'; // Orange Mid-body
                } else {
                    segColor = '#2A9D8F'; // Cyan Tail
                }
            }

            ctx.globalAlpha = alpha;
            ctx.fillStyle = segColor;

            const halfS = segmentSize / 2;
            const radius = isHead ? 6 : 3;

            // Outer vector aura for head
            if (isHead) {
                ctx.save();
                ctx.globalAlpha = alpha * 0.3;
                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                    ctx.roundRect(-halfS - 3, -halfS - 3, segmentSize + 6, segmentSize + 6, radius + 2);
                } else {
                    ctx.rect(-halfS - 3, -halfS - 3, segmentSize + 6, segmentSize + 6);
                }
                ctx.fill();
                ctx.restore();
            }

            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(-halfS, -halfS, segmentSize, segmentSize, radius);
            } else {
                ctx.rect(-halfS, -halfS, segmentSize, segmentSize);
            }
            ctx.fill();

            // Snake Head Directional Eyes
            if (isHead && snakePoints.length > 1) {
                const nextPt = snakePoints[1];
                const dx = pt.rawX - nextPt.rawX;
                const dy = pt.rawY - nextPt.rawY;
                const angle = Math.atan2(dy, dx);

                ctx.fillStyle = '#FFFFFF';

                const eyeDist = halfS * 0.45;
                const eyeOffset = halfS * 0.35;

                ctx.rotate(angle);
                ctx.beginPath();
                ctx.arc(eyeOffset, -eyeDist, 2.5, 0, Math.PI * 2);
                ctx.arc(eyeOffset, eyeDist, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // Render Particle Bursts
        for (let p = activeParticles.length - 1; p >= 0; p--) {
            const part = activeParticles[p];
            part.x += part.vx;
            part.y += part.vy;
            part.alpha -= part.decay;

            if (part.alpha <= 0) {
                activeParticles.splice(p, 1);
                continue;
            }

            const pt = getDisplacedPoint(part.x, part.y);
            ctx.save();
            ctx.globalAlpha = part.alpha;
            ctx.fillStyle = part.color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, part.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });
}