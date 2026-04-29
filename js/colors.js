/**
 * Custom color management — apply, sync, reset primary/background/text colors
 */
window.customColorManager = (function () {
    'use strict';

    function isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    function adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = ((num >> 8) & 0x00ff) + amt;
        const B = (num & 0x0000ff) + amt;
        return (
            '#' +
            (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            )
                .toString(16)
                .slice(1)
        );
    }

    function syncColorInputs(type, hexColor, elements) {
        const picker = elements[`${type}ColorPicker`];
        if (picker) picker.value = hexColor;
    }

    function showApplyFeedback(button, success) {
        if (!button) return;
        const original = button.textContent;
        button.textContent = success ? 'Done!' : 'Invalid';
        button.style.background = success ? '#16a34a' : '#dc2626';
        button.style.color = '#ffffff';
        button.style.borderColor = success ? '#16a34a' : '#dc2626';
        setTimeout(() => {
            button.textContent = original;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 1500);
    }

    function applyPrimaryColor(hexColor, state) {
        if (!isValidHex(hexColor)) return false;
        const root = document.documentElement;
        const hoverColor = adjustBrightness(hexColor, -20);

        root.style.setProperty('--primary-color', hexColor);
        root.style.setProperty('--primary-hover', hoverColor);
        root.style.setProperty('--primary-light', adjustBrightness(hexColor, 80));
        root.style.setProperty('--gradient-primary', hexColor);
        root.style.setProperty('--gradient-card', 'var(--bg-primary)');

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', hexColor);

        state.customColors.primary = hexColor;
        localStorage.setItem('customPrimaryColor', hexColor);
        return true;
    }

    function applyBackgroundColor(hexColor, state) {
        if (!isValidHex(hexColor)) return false;
        const root = document.documentElement;
        const offset = hexColor === '#ffffff' ? -1 : 1;

        root.style.setProperty('--bg-primary', hexColor);
        root.style.setProperty('--bg-secondary', adjustBrightness(hexColor, offset * 5));
        root.style.setProperty('--bg-alt', adjustBrightness(hexColor, offset * 10));

        state.customColors.background = hexColor;
        localStorage.setItem('customBackgroundColor', hexColor);
        return true;
    }

    function applyTextColor(hexColor, state) {
        if (!isValidHex(hexColor)) return false;
        const root = document.documentElement;
        const offset = hexColor === '#1e293b' ? 40 : -40;

        root.style.setProperty('--text-primary', hexColor);
        root.style.setProperty('--text-secondary', adjustBrightness(hexColor, offset));

        state.customColors.text = hexColor;
        localStorage.setItem('customTextColor', hexColor);
        return true;
    }

    function resetColors(state, elements) {
        const root = document.documentElement;

        // Remove all inline color overrides so theme defaults take effect
        ['--primary-color', '--primary-hover', '--primary-light',
         '--gradient-primary', '--gradient-card',
         '--bg-primary', '--bg-secondary', '--bg-alt',
         '--text-primary', '--text-secondary'].forEach(p => root.style.removeProperty(p));

        // Clear saved custom colors
        localStorage.removeItem('customPrimaryColor');
        localStorage.removeItem('customBackgroundColor');
        localStorage.removeItem('customTextColor');

        state.customColors = { primary: null, background: null, text: null };

        // Re-apply the current theme so its CSS variables take effect
        window.themeManager.applyTheme(state.currentTheme, state, elements);
    }

    return {
        isValidHex,
        adjustBrightness,
        syncColorInputs,
        showApplyFeedback,
        applyPrimaryColor,
        applyBackgroundColor,
        applyTextColor,
        resetColors
    };
})();

