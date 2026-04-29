/**
 * Text settings — font size, line height, letter/word spacing sliders & presets
 */
window.textSettingsManager = (function () {
    'use strict';

    function init(state, elements) {
        elements.fontSizeSlider.value = state.textSettings.fontSize;
        elements.lineHeightSlider.value = state.textSettings.lineHeight;
        elements.letterSpacingSlider.value = state.textSettings.letterSpacing;
        elements.wordSpacingSlider.value = state.textSettings.wordSpacing;
        updateDisplay(state, elements);
        applySettings(state);
    }

    function updateDisplay(state, elements) {
        elements.fontSizeValue.textContent = `${state.textSettings.fontSize}px`;
        elements.lineHeightValue.textContent = state.textSettings.lineHeight.toFixed(1);
        elements.letterSpacingValue.textContent = `${state.textSettings.letterSpacing.toFixed(2)}px`;
        elements.wordSpacingValue.textContent = `${state.textSettings.wordSpacing.toFixed(2)}px`;
    }

    function applySettings(state) {
        const root = document.documentElement;
        const fs = state.textSettings.fontSize;

        const scales = [0.75, 0.875, 1.125, 1.25, 1.5, 1.875, 2.25, 3, 3.75];
        const names = ['xs', 'sm', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

        root.style.setProperty('--text-base', `${Math.max(fs, 16)}px`);
        names.forEach((n, i) => root.style.setProperty(`--text-${n}`, `${Math.max(fs * scales[i], 16)}px`));

        document.body.style.lineHeight = state.textSettings.lineHeight;
        document.body.style.letterSpacing = `${state.textSettings.letterSpacing}em`;
        document.body.style.wordSpacing = `${state.textSettings.wordSpacing}em`;
    }

    function saveSettings(state) {
        localStorage.setItem('textFontSize', state.textSettings.fontSize);
        localStorage.setItem('textLineHeight', state.textSettings.lineHeight);
        localStorage.setItem('textLetterSpacing', state.textSettings.letterSpacing);
        localStorage.setItem('textWordSpacing', state.textSettings.wordSpacing);
    }

    function applyPreset(preset, state, elements) {
        const presets = {
            normal:      { fontSize: 16, lineHeight: 1.6, letterSpacing: 0,    wordSpacing: 0 },
            'wcag-aa':   { fontSize: 18, lineHeight: 1.5, letterSpacing: 0.12, wordSpacing: 0.16 },
            'wcag-aaa':  { fontSize: 20, lineHeight: 1.6, letterSpacing: 0.16, wordSpacing: 0.2 },
            'low-vision':{ fontSize: 22, lineHeight: 1.7, letterSpacing: 0.2,  wordSpacing: 0.25 },
            reset:       { fontSize: 16, lineHeight: 1.6, letterSpacing: 0,    wordSpacing: 0 }
        };

        if (!presets[preset]) return;

        state.textSettings = { ...presets[preset] };
        init(state, elements);
        saveSettings(state);
    }

    return { init, updateDisplay, applySettings, saveSettings, applyPreset };
})();

