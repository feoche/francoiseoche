/**
 * Optimized Theme Switcher
 * Lightweight and performant theme management
 */
(function() {
    'use strict';

    // Cache DOM elements
    const elements = {
        themeLight: document.getElementById('theme-light'),
        themeDark: document.getElementById('theme-dark'),
        themeInverted: document.getElementById('theme-inverted'),
        accessibilityDialog: document.getElementById('accessibility-dialog'),
        accessibilityMenuToggle: document.getElementById('accessibility-menu-toggle')
    };

    // State management
    let currentTheme = localStorage.getItem('theme') || 'auto';

    // Theme management
    const themeManager = {
        applyTheme(theme) {
            const html = document.documentElement;
            
            // Remove all theme attributes
            ['light', 'dark', 'high-contrast', 'inverted-contrast'].forEach(attr => {
                html.removeAttribute('data-theme', attr);
            });
            
            if (theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            } else {
                html.setAttribute('data-theme', theme);
            }
            
            this.updateThemeSwitcher(theme);
        },

        updateThemeSwitcher(theme) {
            // Reset all theme options
            [elements.themeLight, elements.themeDark, elements.themeInverted].forEach(btn => {
                if (btn) btn.setAttribute('aria-pressed', 'false');
            });
            
            // Set active theme
            const activeBtn = theme === 'light' ? elements.themeLight : 
                              theme === 'dark' ? elements.themeDark : 
                              theme === 'inverted-contrast' ? elements.themeInverted : null;
            
            if (activeBtn) {
                activeBtn.setAttribute('aria-pressed', 'true');
            }
            
            currentTheme = theme;
            localStorage.setItem('theme', theme);
        },

        handleThemeSwitch(theme) {
            // Remove contrast/inverted states
            localStorage.setItem('highContrast', 'false');
            localStorage.setItem('invertedContrast', 'false');
            
            if (theme === 'inverted-contrast') {
                localStorage.setItem('invertedContrast', 'true');
            }
            
            this.applyTheme(theme);
        }
    };

    // Event listeners
    const setupEventListeners = () => {
        elements.themeLight?.addEventListener('click', () => themeManager.handleThemeSwitch('light'));
        elements.themeDark?.addEventListener('click', () => themeManager.handleThemeSwitch('dark'));
        elements.themeInverted?.addEventListener('click', () => themeManager.handleThemeSwitch('inverted-contrast'));

        // Handle system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (currentTheme === 'auto') {
                themeManager.applyTheme('auto');
            }
        });
    };

    // Initialize
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        themeManager.applyTheme(currentTheme);
        setupEventListeners();
    };

    init();

    // Export for external use
    window.ThemeSwitcher = themeManager;
})();
