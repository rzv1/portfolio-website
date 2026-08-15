/**
 * Initializes a real-time FPS (Frames Per Second) counter and performance monitor widget in the browser.
 * The widget dynamically updates to display the current FPS, frame render time in milliseconds,
 * and provides a visual indicator for performance status using color-coded signals.
 *
 * @return {void} No value is returned from this function. The FPS counter widget is directly appended to the DOM,
 * and updates are handled automatically through "requestAnimationFrame".
 */
export function initFPSCounter() {
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