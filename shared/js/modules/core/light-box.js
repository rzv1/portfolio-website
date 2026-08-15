/**
 * Initializes the lightbox functionality for displaying images in a modal-like view.
 * Works with images in the 'image-zoomable', 'image-container' class.
 *
 * @return {void} Does not return anything.
 */
export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');

    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll('.image-container .image-zoomable').forEach((img) => {
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