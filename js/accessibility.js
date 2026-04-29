/**
 * Accessibility toggles — large font, dyslexic font, reduced motion
 */
window.accessibilityToggles = (function () {
    'use strict';

    function toggleDyslexicFont(state, elements) {
        state.isDyslexicFont = !state.isDyslexicFont;
        const fs = window.fontFamilySwitcher;
        if (state.isDyslexicFont) {
            fs.selectFont(fs.getDyslexicFamily());
        } else {
            fs.selectFont(fs.getDefaultFamily());
        }
        if (elements.dyslexicFontToggle) elements.dyslexicFontToggle.checked = state.isDyslexicFont;
        localStorage.setItem('dyslexicFont', state.isDyslexicFont);
    }

    function toggleAnimations(state, elements) {
        state.isReducedMotion = !state.isReducedMotion;
        document.documentElement.setAttribute('data-reduced-motion', state.isReducedMotion);
        if (elements.animationToggle) elements.animationToggle.checked = state.isReducedMotion;
        localStorage.setItem('reducedMotion', state.isReducedMotion);
    }

    return { toggleDyslexicFont, toggleAnimations };
})();

