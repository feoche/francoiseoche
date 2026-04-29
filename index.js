/**
 * Portfolio — main entry point
 * Delegates to modules: utils, colors, theme, font-switcher, text-settings, accessibility
 */
(function () {
    'use strict';

    const { debounce, throttle, addMediaQueryChangeListener } = window.portfolioUtils;
    const colors = window.customColorManager;
    const theme = window.themeManager;
    const fontSwitcher = window.fontFamilySwitcher;
    const textMgr = window.textSettingsManager;
    const a11y = window.accessibilityToggles;

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        try {
            new PerformanceObserver(() => {}).observe({
                entryTypes: ['largest-contentful-paint', 'first-input']
            });
        } catch (_) { /* unsupported */ }
    }

    // Cached DOM elements
    const elements = {
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navBrand: document.querySelector('.nav-brand'),
        navLinks: document.querySelectorAll('.nav-link'),
        fontSizeToggle: document.getElementById('font-size-toggle'),
        dyslexicFontToggle: document.getElementById('dyslexic-font-toggle'),
        accessibilityMenuToggle: document.getElementById('accessibility-menu-toggle'),
        animationToggle: document.getElementById('animation-toggle'),
        accessibilityDrawer: document.getElementById('accessibility-drawer'),
        closeDrawerBtn: document.getElementById('close-drawer'),
        themeSelect: document.getElementById('theme-select'),
        fontSizeSlider: document.getElementById('font-size-slider'),
        lineHeightSlider: document.getElementById('line-height-slider'),
        letterSpacingSlider: document.getElementById('letter-spacing-slider'),
        wordSpacingSlider: document.getElementById('word-spacing-slider'),
        fontSizeValue: document.getElementById('font-size-value'),
        lineHeightValue: document.getElementById('line-height-value'),
        letterSpacingValue: document.getElementById('letter-spacing-value'),
        wordSpacingValue: document.getElementById('word-spacing-value'),
        primaryColorPicker: document.getElementById('primary-color-picker'),
        backgroundColorPicker: document.getElementById('background-color-picker'),
        textColorPicker: document.getElementById('text-color-picker'),
        applyColorsBtn: document.getElementById('apply-colors'),
        globalResetBtn: document.getElementById('global-reset')
    };

    // Shared state
    const state = {
        isMenuOpen: false,
        currentTheme: localStorage.getItem('theme') || 'auto',
        customColors: {
            primary: localStorage.getItem('customPrimaryColor') || '#2563eb',
            background: localStorage.getItem('customBackgroundColor') || '#ffffff',
            text: localStorage.getItem('customTextColor') || '#1e293b'
        },
        isHighContrast: localStorage.getItem('highContrast') === 'true',
        isLargeFont: localStorage.getItem('largeFont') === 'true',
        isTextSpacing: localStorage.getItem('textSpacing') === 'true',
        isReducedMotion: localStorage.getItem('reducedMotion') === 'true',
        isInvertedContrast: localStorage.getItem('invertedContrast') === 'true',
        isDyslexicFont: localStorage.getItem('dyslexicFont') === 'true',
        isDrawerOpen: false,
        textSettings: {
            fontSize: parseInt(localStorage.getItem('textFontSize')) || 16,
            lineHeight: parseFloat(localStorage.getItem('textLineHeight')) || 1.6,
            letterSpacing: parseFloat(localStorage.getItem('textLetterSpacing')) || 0,
            wordSpacing: parseFloat(localStorage.getItem('textWordSpacing')) || 0
        }
    };

    // ── Drawer ───────────────────────────────────────────────────────────
    const drawer = {
        open() {
            elements.accessibilityDrawer?.setAttribute('open', '');
            state.isDrawerOpen = true;
            elements.accessibilityMenuToggle?.setAttribute('aria-expanded', 'true');
            setTimeout(() => {
                elements.accessibilityDrawer
                    ?.querySelector('button, input, select, textarea, a')
                    ?.focus();
            }, 100);
        },
        close() {
            elements.accessibilityDrawer?.removeAttribute('open');
            state.isDrawerOpen = false;
            elements.accessibilityMenuToggle?.setAttribute('aria-expanded', 'false');
            elements.accessibilityMenuToggle?.focus();
        }
    };

    // ── Navigation ───────────────────────────────────────────────────────
    const navigation = {
        toggle() {
            state.isMenuOpen = !state.isMenuOpen;
            elements.navMenu?.classList.toggle('active');
            elements.navToggle?.classList.toggle('active');
            elements.navToggle?.setAttribute('aria-expanded', state.isMenuOpen);
            document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        },
        close() {
            if (!state.isMenuOpen) return;
            state.isMenuOpen = false;
            elements.navMenu?.classList.remove('active');
            elements.navToggle?.classList.remove('active');
            elements.navToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        },
        smoothScroll(target) {
            const el = document.querySelector(target);
            if (!el) return;
            const headerH = document.querySelector('header')?.offsetHeight || 0;
            window.scrollTo({
                top: el.getBoundingClientRect().top + window.pageYOffset - headerH - 20,
                behavior: 'smooth'
            });
        }
    };

    // ── Intersection Observer ────────────────────────────────────────────
    function setupIntersectionObserver() {
        const items = document.querySelectorAll(
            '.timeline-item, .diploma-card, .project-card, .extra-item, .section-title'
        );
        if (!('IntersectionObserver' in window)) {
            items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
            return;
        }
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        items.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            obs.observe(el);
        });
    }

    // ── Keyboard navigation ──────────────────────────────────────────────
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (state.isDrawerOpen) drawer.close();
                else if (state.isMenuOpen) navigation.close();
            }
        });

        elements.accessibilityDrawer?.addEventListener('click', e => {
            if (e.target === elements.accessibilityDrawer) drawer.close();
        });

        elements.navMenu?.addEventListener('keydown', e => {
            if (e.key !== 'Tab' || !state.isMenuOpen) return;
            const focusable = elements.navMenu.querySelectorAll('a, button');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });
    }

    // ── Event listeners ──────────────────────────────────────────────────
    function setupEventListeners() {
        // Navigation
        elements.navToggle?.addEventListener('click', navigation.toggle);
        elements.navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                navigation.smoothScroll(link.getAttribute('href'));
                navigation.close();
            });
        });

        // Drawer
        elements.accessibilityMenuToggle?.addEventListener('click', drawer.open);
        elements.closeDrawerBtn?.addEventListener('click', drawer.close);

        // Accessibility toggles (switches)
        elements.fontSizeToggle?.addEventListener('change', () => a11y.toggleLargeFont(state, elements));
        elements.dyslexicFontToggle?.addEventListener('change', () => a11y.toggleDyslexicFont(state, elements));
        elements.animationToggle?.addEventListener('change', () => a11y.toggleAnimations(state, elements));

        // Font family switcher
        fontSwitcher.onFontChange(font => {
            const isDyslexic = font.name === 'Dyslexic';
            if (isDyslexic && !state.isDyslexicFont) {
                state.isDyslexicFont = true;
                if (elements.dyslexicFontToggle) elements.dyslexicFontToggle.checked = true;
                localStorage.setItem('dyslexicFont', 'true');
            } else if (!isDyslexic && state.isDyslexicFont) {
                state.isDyslexicFont = false;
                if (elements.dyslexicFontToggle) elements.dyslexicFontToggle.checked = false;
                localStorage.setItem('dyslexicFont', 'false');
            }
        });
        fontSwitcher.init();

        // Theme switcher (select)
        elements.themeSelect?.addEventListener('change', e => {
            theme.handleThemeSwitch(e.target.value, state, elements);
        });

        // Color controls
        setupColorListeners();

        // Text setting sliders
        setupTextSettingListeners();

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                document.querySelectorAll('.preset-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
                e.target.setAttribute('aria-pressed', 'true');
                textMgr.applyPreset(e.target.dataset.preset, state, elements);
            });
        });

        // System theme changes
        addMediaQueryChangeListener(
            window.matchMedia('(prefers-color-scheme: dark)'),
            () => { if (state.currentTheme === 'auto') theme.applyTheme('auto', state, elements); }
        );

        // Global reset
        elements.globalResetBtn?.addEventListener('click', () => globalReset());

        // Resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && state.isMenuOpen) navigation.close();
        }, 250));

        // Scroll — active nav link
        window.addEventListener('scroll', throttle(() => {
            const scrollPos = window.scrollY + 100;
            const firstSection = document.querySelector('section[id]');
            const firstSectionTop = firstSection ? firstSection.offsetTop : Infinity;

            if (scrollPos < firstSectionTop) {
                // In the hero — highlight the brand
                elements.navLinks.forEach(l => l.classList.remove('active'));
                elements.navBrand?.classList.add('active');
                return;
            }

            elements.navBrand?.classList.remove('active');
            document.querySelectorAll('section[id]').forEach(section => {
                const top = section.offsetTop;
                const id = section.getAttribute('id');
                const link = document.querySelector(`.nav-link[href="#${id}"]`);
                if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
                    elements.navLinks.forEach(l => l.classList.remove('active'));
                    link?.classList.add('active');
                }
            });
        }, 100));
    }

    // ── Color listeners (helper) ─────────────────────────────────────────
    function setupColorListeners() {
        elements.applyColorsBtn?.addEventListener('click', () => {
            const ok1 = colors.applyPrimaryColor(elements.primaryColorPicker?.value, state);
            const ok2 = colors.applyBackgroundColor(elements.backgroundColorPicker?.value, state);
            const ok3 = colors.applyTextColor(elements.textColorPicker?.value, state);
            colors.showApplyFeedback(elements.applyColorsBtn, ok1 && ok2 && ok3);
        });
    }

    // ── Text setting listeners (helper) ──────────────────────────────────
    function setupTextSettingListeners() {
        const debouncedUpdate = debounce(() => {
            textMgr.applySettings(state);
            textMgr.saveSettings(state);
        }, 150);

        const sliders = [
            { el: elements.fontSizeSlider,      key: 'fontSize',      parse: parseInt },
            { el: elements.lineHeightSlider,    key: 'lineHeight',    parse: parseFloat },
            { el: elements.letterSpacingSlider, key: 'letterSpacing', parse: parseFloat },
            { el: elements.wordSpacingSlider,   key: 'wordSpacing',   parse: parseFloat }
        ];

        sliders.forEach(({ el, key, parse }) => {
            el?.addEventListener('input', e => {
                state.textSettings[key] = parse(e.target.value);
                textMgr.updateDisplay(state, elements);
                debouncedUpdate();
            });
        });
    }

    // ── Global Reset ────────────────────────────────────────────────────
    function globalReset() {
        // Reset colors
        colors.resetColors(state, elements);

        // Reset theme to auto
        theme.handleThemeSwitch('auto', state, elements);

        // Reset text settings to defaults
        textMgr.applyPreset('reset', state, elements);
        document.querySelectorAll('.preset-btn').forEach(b => {
            b.setAttribute('aria-pressed', b.dataset.preset === 'normal' ? 'true' : 'false');
        });

        // Reset font family to default
        fontSwitcher.selectFont(fontSwitcher.getDefaultFamily());
        localStorage.removeItem('customFontFamily');

        // Reset dyslexic font
        state.isDyslexicFont = false;
        if (elements.dyslexicFontToggle) elements.dyslexicFontToggle.checked = false;
        localStorage.setItem('dyslexicFont', 'false');

        // Reset reduced motion
        state.isReducedMotion = false;
        document.documentElement.setAttribute('data-reduced-motion', 'false');
        if (elements.animationToggle) elements.animationToggle.checked = false;
        localStorage.setItem('reducedMotion', 'false');

        // Visual feedback on button
        const btn = elements.globalResetBtn;
        if (btn) {
            const original = btn.textContent;
            btn.textContent = 'Done!';
            btn.style.background = '#16a34a';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#16a34a';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 1500);
        }
    }

    // ── Theme initialisation ─────────────────────────────────────────────
    function initTheme() {
        theme.applyTheme(state.currentTheme, state, elements);

        // Restore custom colours
        ['primary', 'background', 'text'].forEach(type => {
            const cap = type.charAt(0).toUpperCase() + type.slice(1);
            const saved = localStorage.getItem(`custom${cap}Color`);
            if (saved) {
                colors[`apply${cap}Color`](saved, state);
                colors.syncColorInputs(type, saved, elements);
            }
        });

        // Restore accessibility flags
        if (state.isHighContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
        }
        if (state.isLargeFont) {
            document.documentElement.setAttribute('data-theme', 'large-font');
            if (elements.fontSizeToggle) elements.fontSizeToggle.checked = true;
        }
        if (state.isDyslexicFont) {
            if (elements.dyslexicFontToggle) elements.dyslexicFontToggle.checked = true;
            fontSwitcher.selectFont(fontSwitcher.getDyslexicFamily());
        }
        if (state.isReducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
            if (elements.animationToggle) elements.animationToggle.checked = true;
        }
        if (state.isInvertedContrast) {
            document.documentElement.setAttribute('data-theme', 'inverted-contrast');
        }

        textMgr.init(state, elements);
        fontSwitcher.restore();
    }

    // ── Bootstrap ────────────────────────────────────────────────────────
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Pre-render content from data
        if (typeof window.renderPortfolio === 'function') {
            window.renderPortfolio();
        }

        // Re-cache elements that depend on rendered content
        elements.navLinks = document.querySelectorAll('.nav-link');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.navToggle = document.querySelector('.nav-toggle');
        elements.navBrand = document.querySelector('.nav-brand');

        // Mark brand as active on initial load (hero visible)
        elements.navBrand?.classList.add('active');

        initTheme();
        setupEventListeners();
        setupKeyboardNavigation();
        setupIntersectionObserver();

        // Announce to screen readers
        const msg = document.createElement('div');
        msg.setAttribute('role', 'status');
        msg.setAttribute('aria-live', 'polite');
        msg.className = 'sr-only';
        msg.textContent = 'Portfolio website loaded successfully';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1000);
    }

    init();

})();
