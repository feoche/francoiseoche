/**
 * Font family switcher — browser-safe fonts only
 */
window.fontFamilySwitcher = (function () {
    'use strict';

    const fonts = [
        { name: 'Default',         family: "'Assistant', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
        { name: 'System UI',       family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
        { name: 'Dyslexic',    family: "'OpenDyslexic', 'Comic Sans MS', cursive" },
        { name: 'Arial',           family: "Arial, Helvetica, sans-serif" },
        { name: 'Verdana',         family: "Verdana, Geneva, sans-serif" },
        { name: 'Tahoma',          family: "Tahoma, Geneva, sans-serif" },
        { name: 'Trebuchet MS',    family: "'Trebuchet MS', Helvetica, sans-serif" },
        { name: 'Segoe UI',        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }
    ];

    let _onFontChange = null;

    function onFontChange(callback) {
        _onFontChange = callback;
    }

    function init() {
        const container = document.getElementById('font-family-switcher');
        if (!container) return;

        const saved = localStorage.getItem('customFontFamily');

        fonts.forEach(font => {
            const isActive = saved ? saved === font.family : font.name === 'Default';
            const btn = document.createElement('button');
            btn.className = 'font-family-option';
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            btn.dataset.font = font.family;
            btn.style.fontFamily = font.family;
            btn.innerHTML = `<span class="font-preview">Aa</span><span class="font-label">${font.name}</span>`;

            btn.addEventListener('click', () => {
                selectFont(font.family);
                if (_onFontChange) _onFontChange(font);
            });

            container.appendChild(btn);
        });
    }

    function restore() {
        const saved = localStorage.getItem('customFontFamily');
        if (saved) {
            document.documentElement.style.setProperty('--font-sans', saved);
            document.documentElement.style.setProperty('--font-heading', saved);
        }
    }

    function selectFont(family) {
        const container = document.getElementById('font-family-switcher');
        if (!container) return;
        document.documentElement.style.setProperty('--font-sans', family);
        document.documentElement.style.setProperty('--font-heading', family);
        localStorage.setItem('customFontFamily', family);
        container.querySelectorAll('.font-family-option').forEach(b => {
            b.setAttribute('aria-pressed', b.dataset.font === family ? 'true' : 'false');
        });
    }

    function getDefaultFamily() {
        return fonts[0].family;
    }

    function getDyslexicFamily() {
        const dyslexic = fonts.find(f => f.name === 'Dyslexic');
        return dyslexic ? dyslexic.family : "'OpenDyslexic', 'Comic Sans MS', cursive";
    }

    return { init, restore, selectFont, getDefaultFamily, getDyslexicFamily, onFontChange };
})();

