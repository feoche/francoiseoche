// Performance and accessibility optimized portfolio script
(function() {
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
        perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {
        // PerformanceObserver not supported
    }

    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const contrastToggle = document.getElementById('contrast-toggle');
    const fontSizeToggle = document.getElementById('font-size-toggle');
    const dyslexicFontToggle = document.getElementById('dyslexic-font-toggle');
    const accessibilityMenuToggle = document.getElementById('accessibility-menu-toggle');
    const animationToggle = document.getElementById('animation-toggle');
    const skipLink = document.querySelector('.skip-link');
    
    // Theme switcher elements
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    const themeInverted = document.getElementById('theme-inverted');
    
    // Dialog elements
    const accessibilityDialog = document.getElementById('accessibility-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');
    
    // Text settings elements
    const textSettingsPanel = document.querySelector('.text-settings-panel');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const lineHeightSlider = document.getElementById('line-height-slider');
    const letterSpacingSlider = document.getElementById('letter-spacing-slider');
    const wordSpacingSlider = document.getElementById('word-spacing-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    const lineHeightValue = document.getElementById('line-height-value');
    const letterSpacingValue = document.getElementById('letter-spacing-value');
    const wordSpacingValue = document.getElementById('word-spacing-value');

    // State management
    let isMenuOpen = false;
    let currentTheme = localStorage.getItem('theme') || 'auto';
    let isHighContrast = localStorage.getItem('highContrast') === 'true';
    let isLargeFont = localStorage.getItem('largeFont') === 'true';
    let isTextSpacing = localStorage.getItem('textSpacing') === 'true';
    let isReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    let isInvertedContrast = localStorage.getItem('invertedContrast') === 'true';
    let isTextSettingsOpen = false;
    let isDyslexicFont = localStorage.getItem('dyslexicFont') === 'true';
    let isDialogOpen = false;
    
    // Text settings state
    let textSettings = {
        fontSize: parseInt(localStorage.getItem('textFontSize')) || 16,
        lineHeight: parseFloat(localStorage.getItem('textLineHeight')) || 1.6,
        letterSpacing: parseFloat(localStorage.getItem('textLetterSpacing')) || 0,
        wordSpacing: parseFloat(localStorage.getItem('textWordSpacing')) || 0
    };

    // Initialize theme
    function initTheme() {
        applyTheme(currentTheme);
        if (isHighContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
            contrastToggle.setAttribute('aria-expanded', 'true');
        }
        if (isLargeFont) {
            document.documentElement.setAttribute('data-theme', 'large-font');
            fontSizeToggle.setAttribute('aria-expanded', 'true');
        }
        if (isDyslexicFont) {
            document.documentElement.setAttribute('data-theme', 'dyslexic-font');
            dyslexicFontToggle.setAttribute('aria-expanded', 'true');
        }
        if (isTextSpacing) {
            document.documentElement.setAttribute('data-theme', 'text-spacing');
            textSettingsToggle.setAttribute('aria-expanded', 'true');
        }
        if (isReducedMotion) {
            document.documentElement.setAttribute('data-theme', 'reduced-motion');
            animationToggle.setAttribute('aria-expanded', 'true');
        }
        if (isInvertedContrast) {
            document.documentElement.setAttribute('data-theme', 'inverted-contrast');
            // Update contrast toggle to show inverted mode
            contrastToggle.setAttribute('aria-expanded', 'true');
            contrastToggle.querySelector('span').textContent = '🔄';
        }
        
        // Initialize text settings
        initTextSettings();
    }

    // Dialog functions
    function openAccessibilityDialog() {
        if (accessibilityDialog) {
            accessibilityDialog.showModal();
            isDialogOpen = true;
            accessibilityMenuToggle.setAttribute('aria-expanded', 'true');
            
            // Focus management
            setTimeout(() => {
                const firstFocusable = accessibilityDialog.querySelector('button, input, select, textarea, a');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 100);
        }
    }

    function closeAccessibilityDialog() {
        if (accessibilityDialog) {
            accessibilityDialog.close();
            isDialogOpen = false;
            accessibilityMenuToggle.setAttribute('aria-expanded', 'false');
            accessibilityMenuToggle.focus();
        }
    }

    // Text settings functions
    function initTextSettings() {
        // Set slider values
        fontSizeSlider.value = textSettings.fontSize;
        lineHeightSlider.value = textSettings.lineHeight;
        letterSpacingSlider.value = textSettings.letterSpacing;
        wordSpacingSlider.value = textSettings.wordSpacing;
        
        // Update display values
        updateTextSettingsDisplay();
        
        // Apply text settings
        applyTextSettings();
    }

    function updateTextSettingsDisplay() {
        fontSizeValue.textContent = `${textSettings.fontSize}px`;
        lineHeightValue.textContent = textSettings.lineHeight.toFixed(1);
        letterSpacingValue.textContent = `${textSettings.letterSpacing.toFixed(2)}px`;
        wordSpacingValue.textContent = `${textSettings.wordSpacing.toFixed(2)}px`;
    }

    function applyTextSettings() {
        document.documentElement.style.setProperty('--text-base', `${textSettings.fontSize}px`);
        document.documentElement.style.setProperty('--text-sm', `${textSettings.fontSize * 0.875}px`);
        document.documentElement.style.setProperty('--text-lg', `${textSettings.fontSize * 1.125}px`);
        document.documentElement.style.setProperty('--text-xl', `${textSettings.fontSize * 1.25}px`);
        document.documentElement.style.setProperty('--text-2xl', `${textSettings.fontSize * 1.5}px`);
        document.documentElement.style.setProperty('--text-3xl', `${textSettings.fontSize * 1.875}px`);
        document.documentElement.style.setProperty('--text-4xl', `${textSettings.fontSize * 2.25}px`);
        document.documentElement.style.setProperty('--text-5xl', `${textSettings.fontSize * 3}px`);
        document.documentElement.style.setProperty('--text-6xl', `${textSettings.fontSize * 3.75}px`);
        
        document.body.style.lineHeight = textSettings.lineHeight;
        document.body.style.letterSpacing = `${textSettings.letterSpacing}em`;
        document.body.style.wordSpacing = `${textSettings.wordSpacing}em`;
    }

    function toggleTextSettings() {
        isTextSettingsOpen = !isTextSettingsOpen;
        if (isTextSettingsOpen) {
            textSettingsPanel.classList.add('active');
            textSettingsToggle.setAttribute('aria-expanded', 'true');
        } else {
            textSettingsPanel.classList.remove('active');
            textSettingsToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function saveTextSettings() {
        localStorage.setItem('textFontSize', textSettings.fontSize);
        localStorage.setItem('textLineHeight', textSettings.lineHeight);
        localStorage.setItem('textLetterSpacing', textSettings.letterSpacing);
        localStorage.setItem('textWordSpacing', textSettings.wordSpacing);
    }

    function applyTextPreset(preset) {
        const presets = {
            normal: { fontSize: 16, lineHeight: 1.6, letterSpacing: 0, wordSpacing: 0 },
            'wcag-aa': { fontSize: 18, lineHeight: 1.5, letterSpacing: 0.12, wordSpacing: 0.16 },
            'wcag-aaa': { fontSize: 20, lineHeight: 1.6, letterSpacing: 0.16, wordSpacing: 0.2 },
            'low-vision': { fontSize: 22, lineHeight: 1.7, letterSpacing: 0.2, wordSpacing: 0.25 },
            cognitive: { fontSize: 19, lineHeight: 1.8, letterSpacing: 0.08, wordSpacing: 0.12 },
            reset: { fontSize: 16, lineHeight: 1.6, letterSpacing: 0, wordSpacing: 0 }
        };
        
        if (presets[preset]) {
            // Remove existing theme attributes
            document.documentElement.removeAttribute('data-theme', 'wcag-aa');
            document.documentElement.removeAttribute('data-theme', 'wcag-aaa');
            document.documentElement.removeAttribute('data-theme', 'low-vision');
            document.documentElement.removeAttribute('data-theme', 'cognitive');
            
            // Apply new preset
            if (preset !== 'normal' && preset !== 'reset') {
                document.documentElement.setAttribute('data-theme', preset);
            }
            
            textSettings = { ...presets[preset] };
            initTextSettings();
            saveTextSettings();
        }
    }

    // Dyslexic font toggle
    function toggleDyslexicFont() {
        isDyslexicFont = !isDyslexicFont;
        if (isDyslexicFont) {
            document.documentElement.setAttribute('data-theme', 'dyslexic-font');
            dyslexicFontToggle.setAttribute('aria-expanded', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme', 'dyslexic-font');
            dyslexicFontToggle.setAttribute('aria-expanded', 'false');
        }
        localStorage.setItem('dyslexicFont', isDyslexicFont);
    }

    // Theme management
    function applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            html.setAttribute('data-theme', theme);
        }
        
        localStorage.setItem('theme', theme);
        currentTheme = theme;
        updateThemeToggle();
    }

    function updateThemeToggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.setAttribute('aria-expanded', isDark);
        themeToggle.querySelector('span').textContent = isDark ? '☀️' : '🌓';
    }

    function cycleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        applyTheme(themes[nextIndex]);
    }

    // High contrast toggle
    function toggleHighContrast() {
        // Cycle through: normal -> high-contrast -> inverted-contrast -> normal
        const currentAttr = document.documentElement.getAttribute('data-theme');
        
        if (currentAttr === 'high-contrast') {
            // Switch to inverted contrast
            document.documentElement.setAttribute('data-theme', 'inverted-contrast');
            contrastToggle.setAttribute('aria-expanded', 'true');
            contrastToggle.querySelector('span').textContent = '🔄';
            isHighContrast = false;
            isInvertedContrast = true;
        } else if (currentAttr === 'inverted-contrast') {
            // Switch to normal
            document.documentElement.removeAttribute('data-theme', 'inverted-contrast');
            document.documentElement.removeAttribute('data-theme', 'high-contrast');
            contrastToggle.setAttribute('aria-expanded', 'false');
            contrastToggle.querySelector('span').textContent = '◐';
            isHighContrast = false;
            isInvertedContrast = false;
        } else {
            // Switch to high contrast
            document.documentElement.setAttribute('data-theme', 'high-contrast');
            contrastToggle.setAttribute('aria-expanded', 'true');
            contrastToggle.querySelector('span').textContent = '◐';
            isHighContrast = true;
            isInvertedContrast = false;
        }
        
        localStorage.setItem('highContrast', isHighContrast);
        localStorage.setItem('invertedContrast', isInvertedContrast);
        
        // Re-apply current theme if not contrast modes
        if (!isHighContrast && !isInvertedContrast) {
            applyTheme(currentTheme);
        }
    }

    // Large font toggle
    function toggleLargeFont() {
        isLargeFont = !isLargeFont;
        if (isLargeFont) {
            document.documentElement.setAttribute('data-theme', 'large-font');
            fontSizeToggle.setAttribute('aria-expanded', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme', 'large-font');
            fontSizeToggle.setAttribute('aria-expanded', 'false');
        }
        localStorage.setItem('largeFont', isLargeFont);
    }

    // Text spacing toggle
    function toggleTextSpacing() {
        isTextSpacing = !isTextSpacing;
        if (isTextSpacing) {
            document.documentElement.setAttribute('data-theme', 'text-spacing');
            textSpacingToggle.setAttribute('aria-expanded', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme', 'text-spacing');
            textSpacingToggle.setAttribute('aria-expanded', 'false');
        }
        localStorage.setItem('textSpacing', isTextSpacing);
    }

    // Animation toggle
    function toggleAnimations() {
        isReducedMotion = !isReducedMotion;
        if (isReducedMotion) {
            document.documentElement.setAttribute('data-theme', 'reduced-motion');
            animationToggle.setAttribute('aria-expanded', 'true');
            animationToggle.querySelector('span').textContent = '▶️';
        } else {
            document.documentElement.removeAttribute('data-theme', 'reduced-motion');
            animationToggle.setAttribute('aria-expanded', 'false');
            animationToggle.querySelector('span').textContent = '⏸️';
        }
        localStorage.setItem('reducedMotion', isReducedMotion);
    }

    // Mobile menu toggle
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // Smooth scrolling with offset for fixed header
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Intersection Observer for animations
    function setupIntersectionObserver() {
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
    }

    // Form validation and submission - removed
    function setupFormValidation() {
        // Form functionality removed - only contact links remain
    }

    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;
        let errorMessage = '';

        // Remove previous error state
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }

        // Validation rules
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.id === 'message' && field.value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        }

        return isValid;
    }

    function handleFormSubmit(e) {
        // Form functionality removed - only contact links remain
    }

    // Keyboard navigation enhancement
    function setupKeyboardNavigation() {
        // Close dialog on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (isDialogOpen) {
                    closeAccessibilityDialog();
                } else if (isMenuOpen) {
                    closeMenu();
                }
            }
        });

        // Close dialog when clicking backdrop
        accessibilityDialog?.addEventListener('click', (e) => {
            if (e.target === accessibilityDialog) {
                closeAccessibilityDialog();
            }
        });

        // Focus trap for mobile menu
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && isMenuOpen) {
                const focusableElements = navMenu.querySelectorAll('a, button');
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

        // Skip link focus enhancement
        if (skipLink) {
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
        }
    }

    // Lazy loading for images (if any are added later)
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    // Preload critical resources
    function preloadResources() {
        const criticalResources = [
            { href: '#experience', as: 'document' },
            { href: '#projects', as: 'document' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource.href;
            if (resource.as) link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // Load content from data.js
    async function loadContent() {
        try {
            // Import data from data.js
            const { cursus, projets, studies, extras, contacts } = await import('./data/data.js');
            
            // Load experience
            loadExperience(cursus);
            
            // Load education
            loadEducation(studies);
            
            // Load projects
            loadProjects(projets);
            
            // Load extras
            loadExtras(extras);
            
            // Load contact links
            loadContactLinks(contacts);
            
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    function formatDate(dateObj) {
        if (!dateObj) return 'Date TBD';
        
        if (typeof dateObj === 'string') {
            // Handle simple date strings like "2014-8-1"
            const [year, month] = dateObj.split('-').map(Number);
            return new Date(year, month - 1).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
        }
        
        if (dateObj.start && dateObj.end) {
            const startDate = new Date(dateObj.start.split('-')[0], dateObj.start.split('-')[1] - 1);
            const endDate = new Date(dateObj.end.split('-')[0], dateObj.end.split('-')[1] - 1);
            
            const startFormatted = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
            const endFormatted = endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
            
            return `${startFormatted} - ${endFormatted}`;
        } else if (dateObj.start) {
            const startDate = new Date(dateObj.start.split('-')[0], dateObj.start.split('-')[1] - 1);
            const startFormatted = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
            return `Since ${startFormatted}`;
        }
        
        return 'Date TBD';
    }

    function loadExperience(cursus) {
        const timeline = document.getElementById('experience-timeline');
        if (!timeline) return;
        
        timeline.innerHTML = cursus.map((item, index) => `
            <article class="timeline-item" role="article">
                <div class="timeline-date">${formatDate(item.date)}</div>
                <div class="timeline-content">
                    <h3>${item.job}</h3>
                    <h4>${item.place}</h4>
                    ${item.missions ? `
                        <ul class="tech-stack">
                            ${item.missions.map(mission => `<li>${mission}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </article>
        `).join('');
    }

    function loadEducation(studies) {
        const grid = document.getElementById('diplomas-grid');
        if (!grid) return;
        
        grid.innerHTML = studies.map(item => `
            <article class="diploma-card" role="article">
                <div class="diploma-icon">🎓</div>
                <h3>${item.job}</h3>
                <h4>${item.place}</h4>
                <p class="diploma-date">${formatDate({ start: item.date })}</p>
                ${item.missions ? `
                    <ul class="tech-stack">
                        ${item.missions.map(mission => `<li>${mission}</li>`).join('')}
                    </ul>
                ` : ''}
            </article>
        `).join('');
    }

    function loadProjects(projets) {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        
        grid.innerHTML = projets.map(project => `
            <article class="project-card" role="article">
                <div class="project-image">
                    <div class="project-placeholder">🚀</div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p class="project-date">${formatDate(project.date)}</p>
                    ${project.keywords ? `
                        <ul class="project-tech">
                            ${project.keywords.map(keyword => `<li>${keyword}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <div class="project-links">
                        ${project.link ? `<a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View project">View Project</a>` : ''}
                    </div>
                </div>
            </article>
        `).join('');
    }

    function loadExtras(extras) {
        const grid = document.getElementById('extras-grid');
        if (!grid) return;
        
        grid.innerHTML = extras.map(item => `
            <div class="extra-item">
                <div class="extra-icon">🌟</div>
                <h3>${item.job}</h3>
                <p class="extra-date">${formatDate(item.date)}</p>
                ${item.missions ? `
                    <ul class="tech-stack">
                        ${item.missions.map(mission => `<li>${mission}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `).join('');
    }

    function loadContactLinks(contacts) {
        const contactMethods = document.querySelector('.contact-methods');
        if (!contactMethods) return;
        
        const allContacts = [...(contacts.networks || []), ...(contacts.links || [])];
        
        contactMethods.innerHTML = allContacts.map(contact => `
            <div class="contact-method">
                <span class="contact-icon">${getContactIcon(contact.name)}</span>
                <a href="${contact.url}" target="_blank" rel="noopener noreferrer">${contact.name}</a>
            </div>
        `).join('');
    }

    function getContactIcon(name) {
        const icons = {
            'LinkedIn': '💼',
            'Mail': '📧',
            'Twitter': '🐦',
            'GitHub': '🐙',
            'Codepen': '🎨'
        };
        return icons[name] || '🔗';
    }
        // Performance optimizations
    function optimizePerformance() {
        // Debounce scroll events
        let ticking = false;
        function updateScrollPosition() {
            // Update active navigation based on scroll position
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });

        // Optimize images with WebP support detection
        if (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            // Browser supports WebP
            console.log('WebP supported');
        }
    }

    // Event listeners
    function setupEventListeners() {
        // Navigation
        if (navToggle) {
            navToggle.addEventListener('click', toggleMenu);
        }

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                smoothScroll(target);
                closeMenu();
            });
        });

        // Theme controls
        if (themeToggle) {
            themeToggle.addEventListener('click', cycleTheme);
        }

        if (contrastToggle) {
            contrastToggle.addEventListener('click', toggleHighContrast);
        }

        if (fontSizeToggle) {
            fontSizeToggle.addEventListener('click', toggleLargeFont);
        }

        if (dyslexicFontToggle) {
            dyslexicFontToggle.addEventListener('click', toggleDyslexicFont);
        }

        if (accessibilityMenuToggle) {
            accessibilityMenuToggle.addEventListener('click', openAccessibilityDialog);
        }

        if (closeDialogBtn) {
            closeDialogBtn.addEventListener('click', closeAccessibilityDialog);
        }

        if (animationToggle) {
            animationToggle.addEventListener('click', toggleAnimations);
        }
        
        // Text settings sliders
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                textSettings.fontSize = parseInt(e.target.value);
                updateTextSettingsDisplay();
                applyTextSettings();
                saveTextSettings();
            });
        }
        
        if (lineHeightSlider) {
            lineHeightSlider.addEventListener('input', (e) => {
                textSettings.lineHeight = parseFloat(e.target.value);
                updateTextSettingsDisplay();
                applyTextSettings();
                saveTextSettings();
            });
        }
        
        if (letterSpacingSlider) {
            letterSpacingSlider.addEventListener('input', (e) => {
                textSettings.letterSpacing = parseFloat(e.target.value);
                updateTextSettingsDisplay();
                applyTextSettings();
                saveTextSettings();
            });
        }
        
        if (wordSpacingSlider) {
            wordSpacingSlider.addEventListener('input', (e) => {
                textSettings.wordSpacing = parseFloat(e.target.value);
                updateTextSettingsDisplay();
                applyTextSettings();
                saveTextSettings();
            });
        }
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                applyTextPreset(preset);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Handle system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (currentTheme === 'auto') {
                applyTheme('auto');
            }
        });

        // Handle resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && isMenuOpen) {
                    closeMenu();
                }
            }, 250);
        });
    }

    // Initialize everything when DOM is ready
    function init() {
        // Wait for DOM to be interactive
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initTheme();
        setupEventListeners();
        setupKeyboardNavigation();
        setupFormValidation();
        setupIntersectionObserver();
        setupLazyLoading();
        preloadResources();
        optimizePerformance();
        
        // Load content from data.js
        loadContent();

        // Announce to screen readers that page is loaded
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = 'Portfolio website loaded successfully';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Start initialization
    init();

    // Export functions for potential external use
    window.PortfolioApp = {
        toggleTheme: cycleTheme,
        toggleHighContrast,
        toggleLargeFont,
        smoothScroll
    };

})();
