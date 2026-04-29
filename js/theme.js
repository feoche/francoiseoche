/**
 * Theme management — apply, switch, restore themes and accessibility presets
 */
window.themeManager = (function () {
    'use strict';

    function applyTheme(theme, state, elements) {
        const html = document.documentElement;
        html.removeAttribute('data-theme');

        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            html.setAttribute('data-theme', theme);
        }

        updateThemeSwitcher(theme, state, elements);
        updateColorPickersForTheme(elements);
    }

    function updateThemeSwitcher(theme, state, elements) {
        if (elements.themeSelect) {
            elements.themeSelect.value = theme;
        }

        state.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    function updateColorPickersForTheme(elements) {
        const cs = getComputedStyle(document.documentElement);
        const colors = window.customColorManager;

        ['primary', 'background', 'text'].forEach(type => {
            const prop = type === 'primary' ? '--primary-color' :
                         type === 'background' ? '--bg-primary' : '--text-primary';
            const val = cs.getPropertyValue(prop).trim();
            if (val) colors.syncColorInputs(type, val, elements);
        });
    }

    function handleThemeSwitch(theme, state, elements) {
        state.isHighContrast = false;
        state.isInvertedContrast = false;
        localStorage.setItem('highContrast', 'false');
        localStorage.setItem('invertedContrast', theme === 'inverted-contrast' ? 'true' : 'false');
        applyTheme(theme, state, elements);
    }

    return { applyTheme, handleThemeSwitch };
})();

