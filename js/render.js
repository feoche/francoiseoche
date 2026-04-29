/**
 * Portfolio renderer
 * Generates all HTML content from portfolioData objects.
 */
(function () {
    'use strict';

    const data = window.portfolioData;
    if (!data) return;

    function renderNavigation() {
        const nav = data.navigation;
        const brand = document.querySelector('.nav-brand-name');
        if (brand) brand.textContent = nav.brandName;

        const menu = document.querySelector('.nav-menu');
        if (menu) {
            menu.innerHTML = nav.links
                .map(link => `<li><a href="${link.href}" class="nav-link">${link.label}</a></li>`)
                .join('');
        }
    }

    function renderHero() {
        const hero = data.hero;
        const container = document.getElementById('hero-content');
        if (!container) return;

        const descriptions = hero.descriptions
            .map(d => `<p class="hero-description">${d}</p>`)
            .join('');

        container.innerHTML = `
            <h1 id="hero-title" class="hero-title">
                <img src="${hero.avatar}" alt="${hero.avatarAlt}" class="hero-avatar">
                <span class="name">${hero.name}</span>
                <span class="role">${hero.role}</span>
            </h1>
            ${descriptions}
        `;
    }

    function renderExperience() {
        const container = document.getElementById('experience-timeline');
        if (!container) return;

        container.innerHTML = data.experience.map(item => {
            const subtitle = item.subtitle
                ? `<p class="subtitle">${item.subtitle}</p>`
                : '';

            const missions = item.missions
                .map(m => `<li>${m}</li>`)
                .join('');

            return `
                <article class="timeline-item">
                    <time class="timeline-date">
                        <span class="calendar-icon" aria-hidden="true">📅</span>&nbsp;
                        ${item.date}
                    </time>
                    <div class="timeline-content">
                        <h3 class="timeline-title">${item.title}</h3>
                        ${subtitle}
                        <h4 class="timeline-company">at <a class="cv-item_link" href="${item.company.url}" target="_blank" rel="noopener noreferrer">${item.company.name}</a></h4>
                        <ul class="missions">${missions}</ul>
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderDiplomas() {
        const container = document.getElementById('diplomas-grid');
        if (!container) return;

        container.innerHTML = data.diplomas.map(item => {
            const subtitle = item.subtitle
                ? `<span class="subtitle">${item.subtitle}</span>`
                : '';

            const details = item.details
                .map(d => `<li>${d}</li>`)
                .join('');

            return `
                <article class="diploma-card">
                    <h3 class="diploma-title">${item.title}${subtitle}</h3>
                    <p class="diploma-place">at <a class="cv-item_link" href="${item.place.url}" target="_blank" rel="noopener noreferrer">${item.place.name}</a> - <time class="diploma-date"><span class="calendar-icon" aria-hidden="true">📅</span>&nbsp;${item.date}</time></p>
                    <ul class="diploma-details">${details}</ul>
                </article>
            `;
        }).join('');
    }

    function renderProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        container.innerHTML = data.projects.map(item => {
            const subtitle = item.subtitle
                ? `<p class="project-subtitle">${item.subtitle}</p>`
                : '';
            const link = item.url
                ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="project-link">View Project</a>`
                : '';

            return `
                <article class="project-card">
                    <div class="project-content">
                        <h3 class="project-title">${item.title}</h3>
                        ${subtitle}
                        <time class="project-date">
                            <span class="calendar-icon" aria-hidden="true">📅</span>&nbsp;${item.date}
                        </time>
                        <p class="project-description">${item.description}</p>
                        ${link}
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderTalks() {
        const container = document.getElementById('talks-grid');
        if (!container) return;

        container.innerHTML = data.talks.map(item => {
            const event = item.event
                ? `<p class="talk-event">at <a class="cv-item_link" href="${item.event.url}" target="_blank" rel="noopener noreferrer">${item.event.name}</a> — <time class="talk-date"><span class="calendar-icon" aria-hidden="true">📅</span>&nbsp;${item.date}</time></p>`
                : `<time class="talk-date"><span class="calendar-icon" aria-hidden="true">📅</span>&nbsp;${item.date}</time>`;
            const link = item.link
                ? `<a href="${item.link.url}" target="_blank" rel="noopener noreferrer" class="project-link">${item.link.label}</a>`
                : '';

            return `
                <article class="talk-card">
                    <div class="talk-content">
                        <h3 class="talk-title">${item.title}</h3>
                        ${event}
                        <p class="talk-description">${item.description}</p>
                        ${link}
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderExtras() {
        const container = document.getElementById('extras-grid');
        if (!container) return;

        container.innerHTML = data.extras.map(item => {
            const title = item.url
                ? `<a class="cv-item_link" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a>`
                : item.title;
            const subtitle = item.subtitle
                ? `<p class="extra-subtitle">${item.subtitle}</p>`
                : '';
            const details = item.details
                .map(d => `<li>${d}</li>`)
                .join('');

            return `
                <article class="extra-item">
                    <h3 class="extra-title">${title}</h3>
                    ${subtitle}
                    <time class="extra-date">${item.date}</time>
                    <ul class="extra-details">${details}</ul>
                </article>
            `;
        }).join('');
    }

    function renderContact() {
        const container = document.getElementById('contact-content');
        if (!container) return;

        const methods = data.contact.methods
            .map(m => `
                <li class="contact-method">
                    <a class="contact-link" href="${m.url}" target="_blank" rel="noopener noreferrer">${m.label}</a>
                </li>
            `).join('');

        container.innerHTML = `
            <p class="contact-intro">${data.contact.intro}</p>
            <ul class="contact-methods">${methods}</ul>
        `;
    }

    function renderFooter() {
        const container = document.getElementById('footer-content');
        if (!container) return;
        container.innerHTML = `<p class="footer-text">${data.footer.text}</p>`;
    }

    function addNewTabLabels() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.querySelector('.sr-only-newtab')) {
                const span = document.createElement('span');
                span.className = 'sr-only sr-only-newtab';
                span.textContent = ' (opens in a new tab)';
                link.appendChild(span);
            }
        });
    }

    function renderAll() {
        renderNavigation();
        renderHero();
        renderExperience();
        renderDiplomas();
        renderProjects();
        renderTalks();
        renderExtras();
        renderContact();
        renderFooter();
        addNewTabLabels();
    }

    window.renderPortfolio = renderAll;
})();
