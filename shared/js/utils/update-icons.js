/**
 * Updates the source URLs of skill icon images based on the specified theme.
 *
 * @param {string} theme - The theme to apply to the skill icons (e.g., "dark", "light").
 * @return {void} This method does not return a value.
 */
export function updateSkillIcons(theme) {
    const images = document.querySelectorAll('img[data-icon]');

    images.forEach(img => {
        const icons = img.getAttribute('data-icon');
        img.src = `https://skillicons.dev/icons?i=${icons}&theme=${theme}`;
    });
}