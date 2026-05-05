(function () {
    'use strict';

    const supportedThemes = ['auto', 'light', 'dark', 'inverted-contrast'];
    const sectionSelectorMap = {
        experience: '#experience',
        diplomas: '#diplomas',
        projects: '#projects',
        talks: '#talks',
        extras: '#extras',
        contact: '#contact'
    };

    function scrollToSection(section) {
        const selector = sectionSelectorMap[section];
        if (!selector) {
            return { ok: false, message: `Unknown section: ${section}` };
        }

        const target = document.querySelector(selector);
        if (!target) {
            return { ok: false, message: `Section not found: ${section}` };
        }

        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 20,
            behavior: 'smooth'
        });

        return { ok: true, section, selector };
    }

    function openAccessibilityDrawer() {
        const toggle = document.getElementById('accessibility-menu-toggle');
        const drawer = document.getElementById('accessibility-drawer');

        if (!toggle || !drawer) {
            return { ok: false, message: 'Accessibility drawer is unavailable.' };
        }

        if (toggle.getAttribute('aria-expanded') !== 'true') {
            toggle.click();
        }

        drawer.setAttribute('open', '');
        drawer.querySelector('button, input, select, textarea, a')?.focus();

        return { ok: true };
    }

    function setTheme(theme) {
        if (!supportedThemes.includes(theme)) {
            return { ok: false, message: `Unsupported theme: ${theme}` };
        }

        const select = document.getElementById('theme-select');
        if (select) {
            select.value = theme;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }

        return { ok: true, theme };
    }

    function getDomSummary() {
        return {
            name: document.querySelector('.hero-title .name')?.textContent?.trim() || 'François Eoche',
            role: document.querySelector('.hero-title .role')?.textContent?.trim() || '',
            summary: Array.from(document.querySelectorAll('.hero-description')).map((node) => node.textContent.trim()),
            counts: {
                experience: document.querySelectorAll('.timeline-item').length,
                projects: document.querySelectorAll('.project-card').length,
                talks: document.querySelectorAll('.talk-card').length,
                extras: document.querySelectorAll('.extra-item').length
            },
            contact: Array.from(document.querySelectorAll('.contact-link')).map((link) => ({
                label: link.textContent.replace('(opens in a new tab)', '').trim(),
                url: link.getAttribute('href')
            }))
        };
    }

    function getProfileSummary() {
        const data = window.portfolioData || {};

        if (!data.hero) {
            return getDomSummary();
        }

        return {
            name: data.hero?.name || 'François Eoche',
            role: data.hero?.role || '',
            summary: data.hero?.descriptions || [],
            counts: {
                experience: data.experience?.length || 0,
                projects: data.projects?.length || 0,
                talks: data.talks?.length || 0,
                extras: data.extras?.length || 0
            },
            contact: data.contact?.methods || []
        };
    }

    async function registerWebMcp() {
        if (!navigator.modelContext || typeof navigator.modelContext.provideContext !== 'function') {
            return;
        }

        try {
            await navigator.modelContext.provideContext({
                tools: [
                    {
                        name: 'navigate_to_section',
                        description: 'Scroll to a named section of the portfolio.',
                        inputSchema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                section: {
                                    type: 'string',
                                    enum: Object.keys(sectionSelectorMap)
                                }
                            },
                            required: ['section']
                        },
                        execute: async ({ section }) => scrollToSection(section)
                    },
                    {
                        name: 'open_accessibility_settings',
                        description: 'Open the accessibility settings drawer.',
                        inputSchema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {}
                        },
                        execute: async () => openAccessibilityDrawer()
                    },
                    {
                        name: 'set_theme',
                        description: 'Apply one of the supported visual themes.',
                        inputSchema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                theme: {
                                    type: 'string',
                                    enum: supportedThemes
                                }
                            },
                            required: ['theme']
                        },
                        execute: async ({ theme }) => setTheme(theme)
                    },
                    {
                        name: 'get_profile_summary',
                        description: 'Return a compact summary of the visible portfolio content.',
                        inputSchema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {}
                        },
                        execute: async () => getProfileSummary()
                    }
                ]
            });
        } catch (error) {
            console.warn('WebMCP registration failed.', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerWebMcp, { once: true });
    } else {
        registerWebMcp();
    }
})();



