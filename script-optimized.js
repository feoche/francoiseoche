/**
 * Optimized Portfolio Script
 * Performance-focused with lazy loading, debouncing, and efficient DOM manipulation
 */
(function () {
    'use strict';

    // Performance monitoring
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }
    });

    try {
        perfObserver.observe({entryTypes: ['largest-contentful-paint', 'first-input']});
    } catch (e) {
        // PerformanceObserver not supported
    }

    // Cache DOM elements for better performance
    const elements = {
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        fontSizeToggle: document.getElementById('font-size-toggle'),
        dyslexicFontToggle: document.getElementById('dyslexic-font-toggle'),
        accessibilityMenuToggle: document.getElementById('accessibility-menu-toggle'),
        animationToggle: document.getElementById('animation-toggle'),
        skipLink: document.querySelector('.skip-link'),
        accessibilityDialog: document.getElementById('accessibility-dialog'),
        closeDialogBtn: document.getElementById('close-dialog'),
        themeLight: document.getElementById('theme-light'),
        themeDark: document.getElementById('theme-dark'),
        themeInverted: document.getElementById('theme-inverted'),
        textSettingsPanel: document.querySelector('.text-settings-panel'),
        fontSizeSlider: document.getElementById('font-size-slider'),
        lineHeightSlider: document.getElementById('line-height-slider'),
        letterSpacingSlider: document.getElementById('letter-spacing-slider'),
        wordSpacingSlider: document.getElementById('word-spacing-slider'),
        fontSizeValue: document.getElementById('font-size-value'),
        lineHeightValue: document.getElementById('line-height-value'),
        letterSpacingValue: document.getElementById('letter-spacing-value'),
        wordSpacingValue: document.getElementById('word-spacing-value'),
        // Custom color elements
        primaryColorPicker: document.getElementById('primary-color-picker'),
        primaryColorHex: document.getElementById('primary-color-hex'),
        applyPrimaryColor: document.getElementById('apply-primary-color'),
        backgroundColorPicker: document.getElementById('background-color-picker'),
        backgroundColorHex: document.getElementById('background-color-hex'),
        applyBackgroundColor: document.getElementById('apply-background-color'),
        textColorPicker: document.getElementById('text-color-picker'),
        textColorHex: document.getElementById('text-color-hex'),
        applyTextColor: document.getElementById('apply-text-color'),
        resetColorsBtn: document.getElementById('reset-colors')
    };

    // State management with defaults
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
        isTextSettingsOpen: false,
        isDyslexicFont: localStorage.getItem('dyslexicFont') === 'true',
        isDialogOpen: false,
        textSettings: {
            fontSize: parseInt(localStorage.getItem('textFontSize')) || 16,
            lineHeight: parseFloat(localStorage.getItem('textLineHeight')) || 1.6,
            letterSpacing: parseFloat(localStorage.getItem('textLetterSpacing')) || 0,
            wordSpacing: parseFloat(localStorage.getItem('textWordSpacing')) || 0
        }
    };

    // Utility functions
    const utils = {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: (func, limit) => {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        formatDate: (dateObj) => {
            const options = {year: 'numeric', month: 'long'};
            const startDate = new Date(dateObj.start);
            const startFormatted = startDate.toLocaleDateString('en-US', options);

            if (dateObj.end) {
                const endDate = new Date(dateObj.end);
                const endFormatted = endDate.toLocaleDateString('en-US', options);
                return `${startFormatted} - ${endFormatted}`;
            } else {
                return `Since ${startFormatted}`;
            }
        },

        getContactIcon: (name) => {
            const icons = {
                'LinkedIn': '💼',
                'Mail': '✉️',
                'Twitter': '🐦',
                'GitHub': '🐙',
                'Codepen': '🎨'
            };
            return icons[name] || '🔗';
        }
    };

    // Custom color management
    const customColorManager = {
        applyPrimaryColor(hexColor) {
            const root = document.documentElement;
            
            if (!this.isValidHex(hexColor)) {
                return false;
            }
            
            const hoverColor = this.adjustBrightness(hexColor, -20);
            const lightColor = this.adjustBrightness(hexColor, 80);
            
            root.style.setProperty('--primary-color', hexColor);
            root.style.setProperty('--primary-hover', hoverColor);
            root.style.setProperty('--primary-light', lightColor);
            
            // Update gradients
            root.style.setProperty('--gradient-primary', 
                `linear-gradient(135deg, ${hexColor} 0%, ${hoverColor} 100%)`);
            root.style.setProperty('--gradient-card', 
                `linear-gradient(135deg, var(--bg-primary) 0%, ${hexColor}15 100%)`);
            
            // Update meta theme-color
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', hexColor);
            }
            
            state.customColors.primary = hexColor;
            localStorage.setItem('customPrimaryColor', hexColor);
            
            return true;
        },

        applyBackgroundColor(hexColor) {
            const root = document.documentElement;
            
            if (!this.isValidHex(hexColor)) {
                return false;
            }
            
            root.style.setProperty('--bg-primary', hexColor);
            
            // Generate secondary background color (slightly darker/lighter)
            const secondaryColor = this.adjustBrightness(hexColor, hexColor === '#ffffff' ? -5 : 5);
            root.style.setProperty('--bg-secondary', secondaryColor);
            
            // Generate alt background color
            const altColor = this.adjustBrightness(hexColor, hexColor === '#ffffff' ? -10 : 10);
            root.style.setProperty('--bg-alt', altColor);
            
            state.customColors.background = hexColor;
            localStorage.setItem('customBackgroundColor', hexColor);
            
            return true;
        },

        applyTextColor(hexColor) {
            const root = document.documentElement;
            
            if (!this.isValidHex(hexColor)) {
                return false;
            }
            
            root.style.setProperty('--text-primary', hexColor);
            
            // Generate secondary text color (slightly lighter/darker)
            const secondaryColor = this.adjustBrightness(hexColor, hexColor === '#1e293b' ? 40 : -40);
            root.style.setProperty('--text-secondary', secondaryColor);
            
            state.customColors.text = hexColor;
            localStorage.setItem('customTextColor', hexColor);
            
            return true;
        },

        isValidHex(hex) {
            return /^#[0-9A-F]{6}$/i.test(hex);
        },

        adjustBrightness(hex, percent) {
            const num = parseInt(hex.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255))
                .toString(16).slice(1);
        },

        syncColorInputs(type, hexColor) {
            const picker = elements[`${type}ColorPicker`];
            const hexInput = elements[`${type}ColorHex`];
            
            if (picker) picker.value = hexColor;
            if (hexInput) hexInput.value = hexColor;
        },

        showApplyFeedback(button, success) {
            if (success) {
                button.textContent = 'Applied!';
                button.style.background = '#16a34a';
            } else {
                button.textContent = 'Invalid';
                button.style.background = '#dc2626';
            }
            
            setTimeout(() => {
                button.textContent = 'Apply';
                button.style.background = '';
            }, 1500);
        },

        resetColors() {
            const root = document.documentElement;
            
            // Reset to default colors
            const defaultColors = {
                primary: '#2563eb',
                background: '#ffffff',
                text: '#1e293b'
            };
            
            // Apply default primary color
            this.applyPrimaryColor(defaultColors.primary);
            this.syncColorInputs('primary', defaultColors.primary);
            
            // Apply default background color
            this.applyBackgroundColor(defaultColors.background);
            this.syncColorInputs('background', defaultColors.background);
            
            // Apply default text color
            this.applyTextColor(defaultColors.text);
            this.syncColorInputs('text', defaultColors.text);
            
            // Show feedback
            if (elements.resetColorsBtn) {
                const originalText = elements.resetColorsBtn.querySelector('.btn-label').textContent;
                elements.resetColorsBtn.querySelector('.btn-label').textContent = 'Reset!';
                elements.resetColorsBtn.style.color = '#16a34a';
                elements.resetColorsBtn.style.borderColor = '#16a34a';
                
                setTimeout(() => {
                    elements.resetColorsBtn.querySelector('.btn-label').textContent = originalText;
                    elements.resetColorsBtn.style.color = '';
                    elements.resetColorsBtn.style.borderColor = '';
                }, 1500);
            }
        }
    };

    // Theme management
    const themeManager = {
        applyTheme(theme) {
            const html = document.documentElement;

            // Remove all theme attributes first
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
            
            // Update color pickers to match current theme
            this.updateColorPickersForTheme(theme);
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

            state.currentTheme = theme;
            localStorage.setItem('theme', theme);
        },

        updateColorPickersForTheme(theme) {
            const root = document.documentElement;
            const computedStyle = getComputedStyle(root);
            
            // Get current color values from computed styles
            const currentPrimary = computedStyle.getPropertyValue('--primary-color').trim();
            const currentBackground = computedStyle.getPropertyValue('--bg-primary').trim();
            const currentText = computedStyle.getPropertyValue('--text-primary').trim();
            
            // Update color pickers and hex inputs
            if (currentPrimary && currentPrimary !== '') {
                customColorManager.syncColorInputs('primary', currentPrimary);
            }
            
            if (currentBackground && currentBackground !== '') {
                customColorManager.syncColorInputs('background', currentBackground);
            }
            
            if (currentText && currentText !== '') {
                customColorManager.syncColorInputs('text', currentText);
            }
        },

        handleThemeSwitch(theme) {
            state.isHighContrast = false;
            state.isInvertedContrast = false;

            if (theme !== 'inverted-contrast') {
                localStorage.setItem('highContrast', 'false');
                localStorage.setItem('invertedContrast', 'false');
            }

            if (theme === 'inverted-contrast') {
                localStorage.setItem('invertedContrast', 'true');
            }

            this.applyTheme(theme);
        }
    };

    // Accessibility controls
    const accessibility = {
        toggleLargeFont() {
            state.isLargeFont = !state.isLargeFont;
            const html = document.documentElement;

            if (state.isLargeFont) {
                html.setAttribute('data-theme', 'large-font');
                elements.fontSizeToggle?.setAttribute('aria-expanded', 'true');
            } else {
                html.removeAttribute('data-theme', 'large-font');
                elements.fontSizeToggle?.setAttribute('aria-expanded', 'false');
            }
            localStorage.setItem('largeFont', state.isLargeFont);
        },

        toggleDyslexicFont() {
            state.isDyslexicFont = !state.isDyslexicFont;
            const html = document.documentElement;

            if (state.isDyslexicFont) {
                html.setAttribute('data-theme', 'dyslexic-font');
                elements.dyslexicFontToggle?.setAttribute('aria-expanded', 'true');
            } else {
                html.removeAttribute('data-theme', 'dyslexic-font');
                elements.dyslexicFontToggle?.setAttribute('aria-expanded', 'false');
            }
            localStorage.setItem('dyslexicFont', state.isDyslexicFont);
        },

        toggleAnimations() {
            state.isReducedMotion = !state.isReducedMotion;
            const html = document.documentElement;

            if (state.isReducedMotion) {
                html.setAttribute('data-theme', 'reduced-motion');
                elements.animationToggle?.setAttribute('aria-expanded', 'true');
            } else {
                html.removeAttribute('data-theme', 'reduced-motion');
                elements.animationToggle?.setAttribute('aria-expanded', 'false');
            }
            localStorage.setItem('reducedMotion', state.isReducedMotion);
        },

        toggleHighContrast() {
            state.isHighContrast = !state.isHighContrast;
            const html = document.documentElement;
            const contrastToggle = document.getElementById('contrast-toggle');

            if (state.isHighContrast) {
                html.setAttribute('data-theme', 'high-contrast');
                contrastToggle?.setAttribute('aria-expanded', 'true');
            } else {
                html.removeAttribute('data-theme', 'high-contrast');
                contrastToggle?.setAttribute('aria-expanded', 'false');
            }
            localStorage.setItem('highContrast', state.isHighContrast);
        }
    };

    // Text settings management
    const textSettings = {
        init() {
            // Set slider values
            elements.fontSizeSlider.value = state.textSettings.fontSize;
            elements.lineHeightSlider.value = state.textSettings.lineHeight;
            elements.letterSpacingSlider.value = state.textSettings.letterSpacing;
            elements.wordSpacingSlider.value = state.textSettings.wordSpacing;

            this.updateDisplay();
            this.applySettings();
        },

        updateDisplay() {
            elements.fontSizeValue.textContent = `${state.textSettings.fontSize}px`;
            elements.lineHeightValue.textContent = state.textSettings.lineHeight.toFixed(1);
            elements.letterSpacingValue.textContent = `${state.textSettings.letterSpacing.toFixed(2)}px`;
            elements.wordSpacingValue.textContent = `${state.textSettings.wordSpacing.toFixed(2)}px`;
        },

        applySettings() {
            const root = document.documentElement;
            const fontSize = state.textSettings.fontSize;

            // Update CSS custom properties
            root.style.setProperty('--text-base', `${fontSize}px`);
            root.style.setProperty('--text-sm', `${fontSize * 0.875}px`);
            root.style.setProperty('--text-lg', `${fontSize * 1.125}px`);
            root.style.setProperty('--text-xl', `${fontSize * 1.25}px`);
            root.style.setProperty('--text-2xl', `${fontSize * 1.5}px`);
            root.style.setProperty('--text-3xl', `${fontSize * 1.875}px`);
            root.style.setProperty('--text-4xl', `${fontSize * 2.25}px`);
            root.style.setProperty('--text-5xl', `${fontSize * 3}px`);
            root.style.setProperty('--text-6xl', `${fontSize * 3.75}px`);

            // Apply body styles
            document.body.style.lineHeight = state.textSettings.lineHeight;
            document.body.style.letterSpacing = `${state.textSettings.letterSpacing}em`;
            document.body.style.wordSpacing = `${state.textSettings.wordSpacing}em`;
        },

        saveSettings() {
            localStorage.setItem('textFontSize', state.textSettings.fontSize);
            localStorage.setItem('textLineHeight', state.textSettings.lineHeight);
            localStorage.setItem('textLetterSpacing', state.textSettings.letterSpacing);
            localStorage.setItem('textWordSpacing', state.textSettings.wordSpacing);
        },

        applyPreset(preset) {
            const presets = {
                normal: {fontSize: 16, lineHeight: 1.6, letterSpacing: 0, wordSpacing: 0},
                'wcag-aa': {fontSize: 18, lineHeight: 1.5, letterSpacing: 0.12, wordSpacing: 0.16},
                'wcag-aaa': {fontSize: 20, lineHeight: 1.6, letterSpacing: 0.16, wordSpacing: 0.2},
                'low-vision': {fontSize: 22, lineHeight: 1.7, letterSpacing: 0.2, wordSpacing: 0.25},
                reset: {fontSize: 16, lineHeight: 1.6, letterSpacing: 0, wordSpacing: 0}
            };

            if (presets[preset]) {
                const html = document.documentElement;

                // Remove existing theme attributes
                ['wcag-aa', 'wcag-aaa', 'low-vision', 'cognitive'].forEach(attr => {
                    html.removeAttribute('data-theme', attr);
                });

                // Apply new preset
                if (preset !== 'normal' && preset !== 'reset') {
                    html.setAttribute('data-theme', preset);
                }

                state.textSettings = {...presets[preset]};
                this.init();
                this.saveSettings();
            }
        }
    };

    // Dialog management
    const dialog = {
        open() {
            if (elements.accessibilityDialog) {
                elements.accessibilityDialog.showModal();
                state.isDialogOpen = true;
                elements.accessibilityMenuToggle?.setAttribute('aria-expanded', 'true');

                // Focus management
                setTimeout(() => {
                    const firstFocusable = elements.accessibilityDialog.querySelector('button, input, select, textarea, a');
                    firstFocusable?.focus();
                }, 100);
            }
        },

        close() {
            if (elements.accessibilityDialog) {
                elements.accessibilityDialog.close();
                state.isDialogOpen = false;
                elements.accessibilityMenuToggle?.setAttribute('aria-expanded', 'false');
                elements.accessibilityMenuToggle?.focus();
            }
        }
    };

    // Navigation management
    const navigation = {
        toggle() {
            state.isMenuOpen = !state.isMenuOpen;
            elements.navMenu?.classList.toggle('active');
            elements.navToggle?.classList.toggle('active');
            elements.navToggle?.setAttribute('aria-expanded', state.isMenuOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        },

        close() {
            if (state.isMenuOpen) {
                state.isMenuOpen = false;
                elements.navMenu?.classList.remove('active');
                elements.navToggle?.classList.remove('active');
                elements.navToggle?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        },

        smoothScroll(target) {
            const element = document.querySelector(target);
            if (element) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    // Content loading
    const contentLoader = {
        async loadContent() {
            try {
                const {cursus, projets, studies, extras, contacts} = await import('./data/data.js');

                this.loadExperience(cursus);
                this.loadEducation(studies);
                this.loadProjects(projets);
                this.loadExtras(extras);
                this.loadContactLinks(contacts);

            } catch (error) {
                console.error('Error loading content:', error);
            }
        },

        loadExperience(cursus) {
            const timeline = document.getElementById('experience-timeline');
            if (!timeline) return;

            const html = cursus.map(item => `
                <article class="timeline-item" role="article">
                    <div class="timeline-date">${utils.formatDate(item.date)}</div>
                    <div class="timeline-content">
                        <h3>${item.job}</h3>
                        <h4>${item.place}</h4>
                        <ul class="missions">
                            ${item.missions.map(mission => `<li>${mission}</li>`).join('')}
                        </ul>
                    </div>
                </article>
            `).join('');

            timeline.innerHTML = html;
        },

        loadEducation(studies) {
            const grid = document.getElementById('diplomas-grid');
            if (!grid) return;

            const html = studies.map(item => `
                <article class="diploma-card" role="article">
                    <div class="diploma-icon">🎓</div>
                    <h3>${item.job}</h3>
                    <div class="diploma-date">${utils.formatDate({start: item.date})}</div>
                    <div class="diploma-place">${item.place}</div>
                    <ul class="diploma-details">
                        ${item.missions.map(mission => `<li>${mission}</li>`).join('')}
                    </ul>
                </article>
            `).join('');

            grid.innerHTML = html;
        },

        loadProjects(projets) {
            const grid = document.getElementById('projects-grid');
            if (!grid) return;

            const html = projets.map(project => `
                <article class="project-card" role="article">
                    <div class="project-image">
                        <div class="project-placeholder">🚀</div>
                    </div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <div class="project-date">${utils.formatDate(project.date)}</div>
                        <p>${project.description}</p>
                        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">View Project</a>` : ''}
                    </div>
                </article>
            `).join('');

            grid.innerHTML = html;
        },

        loadExtras(extras) {
            const grid = document.getElementById('extras-grid');
            if (!grid) return;

            const html = extras.map(item => `
                <div class="extra-item">
                    <div class="extra-icon">🌟</div>
                    <h3>${item.job}</h3>
                    <div class="extra-date">${utils.formatDate(item.date)}</div>
                    <ul class="extra-details">
                        ${item.missions.map(mission => `<li>${mission}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

            grid.innerHTML = html;
        },

        loadContactLinks(contacts) {
            const contactMethods = document.querySelector('.contact-methods');
            if (!contactMethods) return;

            const allContacts = [...(contacts.networks || []), ...(contacts.links || [])];

            const html = allContacts.map(contact => `
                <div class="contact-method">
                    <span class="contact-icon">${utils.getContactIcon(contact.name)}</span>
                    <a href="${contact.url}" target="_blank" rel="noopener noreferrer">${contact.name}</a>
                </div>
            `).join('');

            contactMethods.innerHTML = html;
        }
    };

    // Intersection Observer for animations
    const setupIntersectionObserver = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe timeline items, cards, and sections
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .diploma-card, .project-card, .extra-item, .section-title'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    // Keyboard navigation
    const setupKeyboardNavigation = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (state.isDialogOpen) {
                    dialog.close();
                } else if (state.isMenuOpen) {
                    navigation.close();
                }
            }
        });

        // Close dialog when clicking backdrop
        elements.accessibilityDialog?.addEventListener('click', (e) => {
            if (e.target === elements.accessibilityDialog) {
                dialog.close();
            }
        });

        // Focus trap for mobile menu
        elements.navMenu?.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && state.isMenuOpen) {
                const focusableElements = elements.navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    };

    // Event listeners setup
    const setupEventListeners = () => {
        // Navigation
        elements.navToggle?.addEventListener('click', navigation.toggle);

        // Smooth scrolling for navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                navigation.smoothScroll(target);
                navigation.close();
            });
        });

        // Accessibility controls
        elements.fontSizeToggle?.addEventListener('click', accessibility.toggleLargeFont);
        elements.dyslexicFontToggle?.addEventListener('click', accessibility.toggleDyslexicFont);
        elements.accessibilityMenuToggle?.addEventListener('click', dialog.open);
        elements.animationToggle?.addEventListener('click', accessibility.toggleAnimations);
        elements.closeDialogBtn?.addEventListener('click', dialog.close);

        // Theme switcher
        elements.themeLight?.addEventListener('click', () => themeManager.handleThemeSwitch('light'));
        elements.themeDark?.addEventListener('click', () => themeManager.handleThemeSwitch('dark'));
        elements.themeInverted?.addEventListener('click', () => themeManager.handleThemeSwitch('inverted-contrast'));

        // Custom color controls
        elements.primaryColorPicker?.addEventListener('input', (e) => {
            const color = e.target.value;
            customColorManager.syncColorInputs('primary', color);
        });

        elements.primaryColorHex?.addEventListener('input', (e) => {
            let value = e.target.value;
            
            if (value && !value.startsWith('#')) {
                value = '#' + value;
                e.target.value = value;
            }
            
            if (customColorManager.isValidHex(value)) {
                customColorManager.syncColorInputs('primary', value);
            }
        });

        elements.applyPrimaryColor?.addEventListener('click', () => {
            const hexColor = elements.primaryColorHex?.value || elements.primaryColorPicker?.value;
            const success = customColorManager.applyPrimaryColor(hexColor);
            customColorManager.showApplyFeedback(elements.applyPrimaryColor, success);
        });

        elements.backgroundColorPicker?.addEventListener('input', (e) => {
            const color = e.target.value;
            customColorManager.syncColorInputs('background', color);
        });

        elements.backgroundColorHex?.addEventListener('input', (e) => {
            let value = e.target.value;
            
            if (value && !value.startsWith('#')) {
                value = '#' + value;
                e.target.value = value;
            }
            
            if (customColorManager.isValidHex(value)) {
                customColorManager.syncColorInputs('background', value);
            }
        });

        elements.applyBackgroundColor?.addEventListener('click', () => {
            const hexColor = elements.backgroundColorHex?.value || elements.backgroundColorPicker?.value;
            const success = customColorManager.applyBackgroundColor(hexColor);
            customColorManager.showApplyFeedback(elements.applyBackgroundColor, success);
        });

        elements.textColorPicker?.addEventListener('input', (e) => {
            const color = e.target.value;
            customColorManager.syncColorInputs('text', color);
        });

        elements.textColorHex?.addEventListener('input', (e) => {
            let value = e.target.value;
            
            if (value && !value.startsWith('#')) {
                value = '#' + value;
                e.target.value = value;
            }
            
            if (customColorManager.isValidHex(value)) {
                customColorManager.syncColorInputs('text', value);
            }
        });

        elements.applyTextColor?.addEventListener('click', () => {
            const hexColor = elements.textColorHex?.value || elements.textColorPicker?.value;
            const success = customColorManager.applyTextColor(hexColor);
            customColorManager.showApplyFeedback(elements.applyTextColor, success);
        });

        // Allow Enter key to apply colors
        ['primary', 'background', 'text'].forEach(type => {
            const hexInput = elements[`${type}ColorHex`];
            if (hexInput) {
                hexInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        elements[`apply${type.charAt(0).toUpperCase() + type.slice(1)}Color`]?.click();
                    }
                });
            }
        });

        // Reset colors button
        elements.resetColorsBtn?.addEventListener('click', () => {
            customColorManager.resetColors();
        });

        // Text settings sliders with debouncing
        const debouncedUpdate = utils.debounce(() => {
            textSettings.applySettings();
            textSettings.saveSettings();
        }, 150);

        elements.fontSizeSlider?.addEventListener('input', (e) => {
            state.textSettings.fontSize = parseInt(e.target.value);
            textSettings.updateDisplay();
            debouncedUpdate();
        });

        elements.lineHeightSlider?.addEventListener('input', (e) => {
            state.textSettings.lineHeight = parseFloat(e.target.value);
            textSettings.updateDisplay();
            debouncedUpdate();
        });

        elements.letterSpacingSlider?.addEventListener('input', (e) => {
            state.textSettings.letterSpacing = parseFloat(e.target.value);
            textSettings.updateDisplay();
            debouncedUpdate();
        });

        elements.wordSpacingSlider?.addEventListener('input', (e) => {
            state.textSettings.wordSpacing = parseFloat(e.target.value);
            textSettings.updateDisplay();
            debouncedUpdate();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                textSettings.applyPreset(preset);
            });
        });

        // Handle system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (state.currentTheme === 'auto') {
                themeManager.applyTheme('auto');
            }
        });

        // Handle resize events with debouncing
        const debouncedResize = utils.debounce(() => {
            if (window.innerWidth > 768 && state.isMenuOpen) {
                navigation.close();
            }
        }, 250);

        window.addEventListener('resize', debouncedResize);

        // Scroll position updates with throttling
        const throttledScroll = utils.throttle(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

                if (scrollPos >= top && scrollPos < top + height) {
                    elements.navLinks.forEach(link => link.classList.remove('active'));
                    navLink?.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', throttledScroll);
    };

    // Initialize theme
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'auto';
        const savedPrimaryColor = localStorage.getItem('customPrimaryColor');
        const savedBackgroundColor = localStorage.getItem('customBackgroundColor');
        const savedTextColor = localStorage.getItem('customTextColor');
        const savedHighContrast = localStorage.getItem('highContrast') === 'true';
        const savedLargeFont = localStorage.getItem('largeFont') === 'true';
        const savedDyslexicFont = localStorage.getItem('dyslexicFont') === 'true';
        const savedTextSpacing = localStorage.getItem('textSpacing') === 'true';
        const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
        const savedInvertedContrast = localStorage.getItem('invertedContrast') === 'true';

        state.currentTheme = savedTheme;
        themeManager.applyTheme(savedTheme);
        
        // Apply custom colors if they exist
        if (savedPrimaryColor) {
            customColorManager.applyPrimaryColor(savedPrimaryColor);
            customColorManager.syncColorInputs('primary', savedPrimaryColor);
        }
        
        if (savedBackgroundColor) {
            customColorManager.applyBackgroundColor(savedBackgroundColor);
            customColorManager.syncColorInputs('background', savedBackgroundColor);
        }
        
        if (savedTextColor) {
            customColorManager.applyTextColor(savedTextColor);
            customColorManager.syncColorInputs('text', savedTextColor);
        }

        // Apply saved accessibility settings
        if (savedHighContrast) {
            state.isHighContrast = true;
            document.documentElement.setAttribute('data-theme', 'high-contrast');
            const contrastToggle = document.getElementById('contrast-toggle');
            contrastToggle?.setAttribute('aria-expanded', 'true');
        }

        if (savedLargeFont) {
            state.isLargeFont = true;
            document.documentElement.setAttribute('data-theme', 'large-font');
            elements.fontSizeToggle?.setAttribute('aria-expanded', 'true');
        }

        if (savedDyslexicFont) {
            state.isDyslexicFont = true;
            document.documentElement.setAttribute('data-theme', 'dyslexic-font');
            elements.dyslexicFontToggle?.setAttribute('aria-expanded', 'true');
        }

        if (savedTextSpacing) {
            state.isTextSpacing = true;
            document.documentElement.setAttribute('data-theme', 'text-spacing');
            const textSettingsToggle = document.getElementById('text-settings-toggle');
            textSettingsToggle?.setAttribute('aria-expanded', 'true');
        }

        if (savedReducedMotion) {
            state.isReducedMotion = true;
            document.documentElement.setAttribute('data-theme', 'reduced-motion');
            elements.animationToggle?.setAttribute('aria-expanded', 'true');
        }

        if (savedInvertedContrast) {
            state.isInvertedContrast = true;
            document.documentElement.setAttribute('data-theme', 'inverted-contrast');
            const contrastToggle = document.getElementById('contrast-toggle');
            contrastToggle?.setAttribute('aria-expanded', 'true');
            const contrastToggleSpan = contrastToggle?.querySelector('span');
            contrastToggleSpan.textContent = '🔄';
        }

        textSettings.init();
    };

    // Main initialization
    const init = async () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initTheme();
        setupEventListeners();
        setupKeyboardNavigation();
        setupIntersectionObserver();

        // Load content
        await contentLoader.loadContent();

        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = 'Portfolio website loaded successfully';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    };

    // Start initialization
    init();

    // Export for external use
    window.PortfolioApp = {
        toggleTheme: () => themeManager.handleThemeSwitch(state.currentTheme === 'auto' ? 'light' : 'auto'),
        toggleHighContrast: accessibility.toggleHighContrast,
        toggleLargeFont: accessibility.toggleLargeFont,
        toggleDyslexicFont: accessibility.toggleDyslexicFont,
        smoothScroll: navigation.smoothScroll,
        toggleAnimations: accessibility.toggleAnimations
    };
})();
