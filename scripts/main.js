
function initBG(){
    const bg = document.querySelector('.bg-rift');
    const container = document.querySelector('html');
    const navbar = document.querySelector('.navbar');

    document.addEventListener('mousemove', (e) => {
        const { left, top, right, bottom } = container.getBoundingClientRect();
        let midX = (right - left) / 2;
        let midY = 75;
        navbar.style.setProperty('--y', (e.clientX - midX) / (right - left) * 30);
        navbar.style.setProperty('--x', (e.clientY - midY) / (bottom / 2) * 100);
         bg.style.setProperty('--mouse-x', `${((e.clientX - left) / right) * 100}%`);
         bg.style.setProperty('--mouse-y', `${((e.clientY - top) / bottom) * 100}%`);
    })
}

function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');

    document.querySelectorAll('.image-container').forEach((img) => {
        if(img.src) {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.showModal();
                document.body.style.overflow = 'hidden';
            });
        }
    });

    closeBtn.addEventListener('click', () => {
        lightbox.close();
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox){
            lightbox.close();
            document.body.style.overflow = 'auto';
        }
    })
}

initBG();
initObserver();
initLightbox();