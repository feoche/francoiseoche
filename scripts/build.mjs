import { access, copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'docs');

const requiredFiles = ['index.html', 'index.js', 'styles.css'];
const optionalFiles = ['404.html', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'CNAME'];
const optionalDirectories = ['assets', 'images', 'fonts', 'public'];

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Pre-render: load data.js, generate HTML fragments, inject into index.html
// ---------------------------------------------------------------------------

async function loadData() {
  const raw = await readFile(path.join(rootDir, 'data', 'data.js'), 'utf-8');
  // Strip the `window.portfolioData = ` wrapper so we can eval as plain object
  const trimmed = raw
    .replace(/^[\s\S]*?window\.portfolioData\s*=\s*/, '')
    .replace(/;\s*$/, '');
  return new Function(`return (${trimmed})`)();
}

function renderNavLinks(data) {
  return data.navigation.links
    .map(link => `<li><a href="${link.href}" class="nav-link">${link.label}</a></li>`)
    .join('\n            ');
}

function renderHero(data) {
  const hero = data.hero;
  const descriptions = hero.descriptions
    .map(d => `<p class="hero-description">${d}</p>`)
    .join('\n            ');

  return `
            <h1 id="hero-title" class="hero-title">
                <img src="${hero.avatar}" alt="${hero.avatarAlt}" class="hero-avatar">
                <span class="name">${hero.name}</span>
                <span class="role">${hero.role}</span>
            </h1>
            ${descriptions}`;
}

function renderExperience(data) {
  return data.experience.map(item => {
    const subtitle = item.subtitle ? `<p class="subtitle">${item.subtitle}</p>` : '';
    const missions = item.missions.map(m => `<li>${m}</li>`).join('');
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
                </article>`;
  }).join('\n');
}

function renderDiplomas(data) {
  return data.diplomas.map(item => {
    const subtitle = item.subtitle ? `<span class="subtitle">${item.subtitle}</span>` : '';
    const details = item.details.map(d => `<li>${d}</li>`).join('\n                        ');
    return `
                <article class="diploma-card">
                    <h3 class="diploma-title">${item.title}${subtitle}</h3>
                    <p class="diploma-place">at <a class="cv-item_link" href="${item.place.url}" target="_blank" rel="noopener noreferrer">${item.place.name}</a> - <time class="diploma-date"><span class="calendar-icon" aria-hidden="true">📅</span>&nbsp;${item.date}</time></p>
                    <ul class="diploma-details">
                        ${details}
                    </ul>
                </article>`;
  }).join('\n');
}

function renderProjects(data) {
  return data.projects.map(item => {
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
                </article>`;
  }).join('\n');
}

function renderTalks(data) {
  return data.talks.map(item => {
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
                </article>`;
  }).join('\n');
}

function renderExtras(data) {
  return data.extras.map(item => {
    const title = item.url
      ? `<a class="cv-item_link" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a>`
      : item.title;
    const subtitle = item.subtitle
      ? `<p class="extra-subtitle">${item.subtitle}</p>`
      : '';
    const details = item.details.map(d => `<li>${d}</li>`).join('\n                        ');
    return `
                <article class="extra-item">
                    <h3 class="extra-title">${title}</h3>
                    ${subtitle}
                    <time class="extra-date">${item.date}</time>
                    <ul class="extra-details">
                        ${details}
                    </ul>
                </article>`;
  }).join('\n');
}

function renderContact(data) {
  const methods = data.contact.methods.map(m => `
                        <li class="contact-method">
                            <a class="contact-link" href="${m.url}" target="_blank" rel="noopener noreferrer">${m.label}</a>
                        </li>`).join('\n');

  return `
                <p class="contact-intro">${data.contact.intro}</p>
                <ul class="contact-methods">${methods}
                </ul>`;
}

function renderFooter(data) {
  return `<p class="footer-text">${data.footer.text}</p>`;
}

function renderBrandName(data) {
  return data.navigation.brandName;
}

/**
 * Inject a visually-hidden "(opens in a new tab)" span inside every
 * target="_blank" anchor that doesn't already have one.
 */
function addNewTabLabels(html) {
  return html.replace(
    /(<a\b[^>]*\btarget="_blank"[^>]*>)([\s\S]*?)(<\/a>)/g,
    (match, open, content, close) => {
      if (content.includes('sr-only-newtab')) return match;
      return `${open}${content}<span class="sr-only sr-only-newtab"> (opens in a new tab)</span>${close}`;
    }
  );
}

async function buildFlattenedHtml() {
  const data = await loadData();
  let html = await readFile(path.join(rootDir, 'index.html'), 'utf-8');

  // Inject nav links into <ul class="nav-menu">
  html = html.replace(
    /(<ul class="nav-menu">)[\s\S]*?(<\/ul>)/,
    `$1\n            ${renderNavLinks(data)}\n        $2`
  );

  // Inject brand name
  html = html.replace(
    /(<span class="nav-brand-name">)[\s\S]*?(<\/span>)/,
    `$1${renderBrandName(data)}$2`
  );

  // Inject hero content
  html = html.replace(
    /(<div class="container" id="hero-content">)[\s\S]*?(<\/div>\s*<\/section>)/,
    `$1${renderHero(data)}\n        $2`
  );

  // Inject experience timeline
  html = html.replace(
    /(<div class="timeline" id="experience-timeline">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${renderExperience(data)}\n            $2`
  );

  // Inject diplomas grid
  html = html.replace(
    /(<div class="diplomas-grid" id="diplomas-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${renderDiplomas(data)}\n            $2`
  );

  // Inject projects grid
  html = html.replace(
    /(<div class="projects-grid" id="projects-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${renderProjects(data)}\n            $2`
  );

  // Inject talks grid
  html = html.replace(
    /(<div class="talks-grid" id="talks-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${renderTalks(data)}\n            $2`
  );

  // Inject extras grid
  html = html.replace(
    /(<div class="extras-grid" id="extras-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${renderExtras(data)}\n            $2`
  );

  // Inject contact content
  html = html.replace(
    /(<div class="contact-content" id="contact-content">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${renderContact(data)}\n            $2`
  );

  // Inject footer content
  html = html.replace(
    /(<div class="container" id="footer-content">)[\s\S]*?(<\/div>\s*<\/footer>)/,
    `$1${renderFooter(data)}$2`
  );

  // Remove data.js, render.js and module script tags — not needed in flattened build
  html = html.replace(/\s*<script src="data\/data\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/render\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/utils\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/colors\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/theme\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/font-switcher\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/text-settings\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/accessibility\.js"><\/script>/, '');

  // Inject aria labels for new-tab links
  html = addNewTabLabels(html);

  return html;
}

// ---------------------------------------------------------------------------

async function copyRequiredFiles() {
  for (const fileName of requiredFiles) {
    const sourcePath = path.join(rootDir, fileName);

    if (!(await exists(sourcePath))) {
      throw new Error(`Missing required file: ${fileName}`);
    }

    await copyFile(sourcePath, path.join(outputDir, fileName));
  }
}

async function copyOptionalFiles() {
  for (const fileName of optionalFiles) {
    const sourcePath = path.join(rootDir, fileName);

    if (await exists(sourcePath)) {
      await copyFile(sourcePath, path.join(outputDir, fileName));
    }
  }
}

async function copyOptionalDirectories() {
  for (const directoryName of optionalDirectories) {
    const sourcePath = path.join(rootDir, directoryName);

    if (await exists(sourcePath)) {
      await cp(sourcePath, path.join(outputDir, directoryName), { recursive: true });
    }
  }
}

async function build() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await copyRequiredFiles();
  await copyOptionalFiles();
  await copyOptionalDirectories();

  // Overwrite index.html with flattened (pre-rendered) version
  const flatHtml = await buildFlattenedHtml();
  await writeFile(path.join(outputDir, 'index.html'), flatHtml, 'utf-8');

  await writeFile(path.join(outputDir, '.nojekyll'), '\n');

  console.log(`Built GitHub Pages output in ${path.relative(rootDir, outputDir)}`);
}

build().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
