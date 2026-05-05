import { createHash } from 'node:crypto';
import { access, copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'docs');

const requiredFiles = ['index.html', 'index.js', 'styles.css'];
const optionalFiles = ['404.html', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'CNAME', '_headers'];
const optionalDirectories = ['assets', 'images', 'fonts', 'public', 'js', '.well-known', 'api-docs'];
const agentSkillMetadata = {
  'api-catalog.md': {
    name: 'API catalog discovery',
    description: 'Explains the published API catalog, OpenAPI description, and supporting API endpoints.'
  },
  'robots-txt.md': {
    name: 'Robots.txt discovery',
    description: 'Describes crawl rules, AI crawler policies, and Content-Signal directives.'
  },
  'sitemap.md': {
    name: 'Sitemap discovery',
    description: 'Documents the canonical sitemap and how it is published during the build.'
  },
  'oauth-discovery.md': {
    name: 'OAuth and OIDC discovery',
    description: 'Explains published OAuth 2.0 and OpenID Connect discovery metadata for agents.'
  },
  'oauth-protected-resource.md': {
    name: 'OAuth protected resource metadata',
    description: 'Describes the published OAuth Protected Resource Metadata document for API authentication discovery.'
  },
  'link-headers.md': {
    name: 'Link headers discovery',
    description: 'Lists homepage Link response headers used for machine discovery of key resources.'
  },
  'markdown-negotiation.md': {
    name: 'Markdown negotiation',
    description: 'Describes how Accept: text/markdown requests receive markdown responses with negotiation headers.'
  },
  'webmcp.md': {
    name: 'WebMCP discovery',
    description: 'Describes the browser-side tools exposed through the WebMCP API.'
  }
};

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

async function loadSiteConfig() {
  const raw = await readFile(path.join(rootDir, 'site.config.json'), 'utf-8');
  return JSON.parse(raw);
}

function toAbsoluteUrl(siteUrl, relativePath = '/') {
  const target = relativePath === '/' ? '' : relativePath.replace(/^\//, '');
  return new URL(target, siteUrl).toString();
}

function decodeEntities(value = '') {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&copy;/g, '©')
    .replace(/&emsp;/g, ' — ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value = '') {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function renderContentSignal(siteConfig) {
  const { aiTrain, search, aiInput } = siteConfig.contentSignals;
  return `Content-Signal: ai-train=${aiTrain}, search=${search}, ai-input=${aiInput}`;
}

function renderRobotsTxt(siteConfig) {
  const lines = ['User-agent: *'];

  siteConfig.robots.allow.forEach((allowedPath) => lines.push(`Allow: ${allowedPath}`));
  siteConfig.robots.disallow.forEach((blockedPath) => lines.push(`Disallow: ${blockedPath}`));
  lines.push(renderContentSignal(siteConfig), '');

  siteConfig.aiCrawlers.forEach((crawler) => {
    lines.push(`User-agent: ${crawler.name}`);

    (crawler.allow.length ? crawler.allow : (crawler.disallow.length ? [] : ['/'])).forEach((allowedPath) => {
      lines.push(`Allow: ${allowedPath}`);
    });

    crawler.disallow.forEach((blockedPath) => {
      lines.push(`Disallow: ${blockedPath}`);
    });

    lines.push(renderContentSignal(siteConfig), '');
  });

  lines.push(`Sitemap: ${toAbsoluteUrl(siteConfig.siteUrl, siteConfig.publishPaths.sitemap)}`);

  return `${lines.join('\n').trim()}\n`;
}

function renderSitemapXml(siteConfig, buildTime) {
  const priorities = {
    '/': '1.0',
    '/api-docs/': '0.6'
  };

  const urls = siteConfig.sitemapPages.map((pagePath) => `  <url>\n    <loc>${toAbsoluteUrl(siteConfig.siteUrl, pagePath)}</loc>\n    <lastmod>${buildTime.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priorities[pagePath] || '0.5'}</priority>\n  </url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n');
}

function renderMarkdown(data, siteConfig) {
  const lines = [
    `# ${data.hero.name}`,
    '',
    `> ${data.hero.role}`,
    '',
    stripHtml(siteConfig.siteDescription),
    ''
  ];

  data.hero.descriptions.forEach((paragraph) => {
    lines.push(stripHtml(paragraph), '');
  });

  const sectionDefinitions = [
    ['Experience', data.experience, (item) => [
      `### ${stripHtml(item.title)} — ${stripHtml(item.date)}`,
      `- Company: ${stripHtml(item.company.name)}`,
      ...item.missions.map((mission) => `- ${stripHtml(mission)}`)
    ]],
    ['Education & Certifications', data.diplomas, (item) => [
      `### ${stripHtml(item.title)} — ${stripHtml(item.date)}`,
      `- Place: ${stripHtml(item.place.name)}`,
      ...item.details.map((detail) => `- ${stripHtml(detail)}`)
    ]],
    ['Featured Projects', data.projects, (item) => [
      `### ${stripHtml(item.title)} — ${stripHtml(item.date)}`,
      item.subtitle ? `- Subtitle: ${stripHtml(item.subtitle)}` : null,
      `- Description: ${stripHtml(item.description)}`,
      item.url ? `- URL: ${item.url}` : null
    ].filter(Boolean)],
    ['Talks & Lectures', data.talks, (item) => [
      `### ${stripHtml(item.title)} — ${stripHtml(item.date)}`,
      item.event ? `- Event: ${stripHtml(item.event.name)}` : null,
      `- Description: ${stripHtml(item.description)}`,
      item.link ? `- ${stripHtml(item.link.label)}: ${item.link.url}` : null
    ].filter(Boolean)],
    ['Extras & Activities', data.extras, (item) => [
      `### ${stripHtml(item.title)} — ${stripHtml(item.date)}`,
      item.subtitle ? `- Subtitle: ${stripHtml(item.subtitle)}` : null,
      ...item.details.map((detail) => `- ${stripHtml(detail)}`),
      item.url ? `- URL: ${item.url}` : null
    ].filter(Boolean)]
  ];

  sectionDefinitions.forEach(([heading, items, renderItem]) => {
    lines.push(`## ${heading}`, '');
    items.forEach((item) => {
      lines.push(...renderItem(item), '');
    });
  });

  lines.push('## Contact', '');
  lines.push(stripHtml(data.contact.intro), '');
  data.contact.methods.forEach((method) => {
    lines.push(`- ${method.label}: ${method.url}`);
  });

  lines.push('', stripHtml(data.footer.text), '');

  return lines.join('\n');
}

function buildProfileDocument(data, siteConfig) {
  return {
    site: {
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
      description: siteConfig.siteDescription,
      language: siteConfig.defaultLanguage
    },
    hero: {
      name: data.hero.name,
      role: data.hero.role,
      descriptions: data.hero.descriptions.map((paragraph) => stripHtml(paragraph))
    },
    counts: {
      experience: data.experience.length,
      diplomas: data.diplomas.length,
      projects: data.projects.length,
      talks: data.talks.length,
      extras: data.extras.length
    },
    contact: data.contact.methods,
    sections: {
      experience: data.experience.map((item) => ({
        title: stripHtml(item.title),
        date: stripHtml(item.date),
        company: stripHtml(item.company.name),
        missions: item.missions.map((mission) => stripHtml(mission))
      })),
      projects: data.projects.map((item) => ({
        title: stripHtml(item.title),
        subtitle: item.subtitle ? stripHtml(item.subtitle) : null,
        date: stripHtml(item.date),
        description: stripHtml(item.description),
        url: item.url || null
      })),
      talks: data.talks.map((item) => ({
        title: stripHtml(item.title),
        date: stripHtml(item.date),
        event: item.event ? stripHtml(item.event.name) : null,
        description: stripHtml(item.description),
        link: item.link || null
      }))
    }
  };
}

function buildHealthDocument(siteConfig, buildTime) {
  return {
    status: 'ok',
    service: 'portfolio-api',
    public: true,
    site: siteConfig.siteUrl,
    generatedAt: buildTime.toISOString()
  };
}

function buildOpenApiDocument(siteConfig) {
  return {
    openapi: '3.1.0',
    info: {
      title: siteConfig.api.title,
      version: siteConfig.api.version,
      summary: siteConfig.api.summary
    },
    servers: [
      { url: siteConfig.siteUrl }
    ],
    paths: {
      [siteConfig.publishPaths.profileApi]: {
        get: {
          operationId: 'getPortfolioProfile',
          summary: 'Get public portfolio metadata.',
          responses: {
            200: {
              description: 'Public portfolio profile document.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      },
      [siteConfig.publishPaths.healthApi]: {
        get: {
          operationId: 'getApiHealth',
          summary: 'Get the public API health document.',
          responses: {
            200: {
              description: 'Health/status document.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      service: { type: 'string' },
                      public: { type: 'boolean' },
                      site: { type: 'string', format: 'uri' },
                      generatedAt: { type: 'string', format: 'date-time' }
                    },
                    required: ['status', 'service', 'public', 'site', 'generatedAt']
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}

function buildApiCatalog(siteConfig) {
  const protectedResourcePath = siteConfig.publishPaths?.oauthProtectedResource || '/.well-known/oauth-protected-resource';
  const authItems = siteConfig.authDiscovery?.enabled ? [
    {
      href: toAbsoluteUrl(siteConfig.siteUrl, '/.well-known/oauth-authorization-server'),
      rel: 'oauth-authorization-server',
      type: 'application/json'
    },
    {
      href: toAbsoluteUrl(siteConfig.siteUrl, protectedResourcePath),
      rel: 'oauth-protected-resource',
      type: 'application/json'
    }
  ] : [];

  return {
    linkset: [
      {
        anchor: toAbsoluteUrl(siteConfig.siteUrl, '/api/'),
        item: [
          {
            href: toAbsoluteUrl(siteConfig.siteUrl, siteConfig.publishPaths.openApi),
            rel: 'service-desc',
            type: 'application/openapi+json'
          },
          {
            href: toAbsoluteUrl(siteConfig.siteUrl, siteConfig.publishPaths.apiDocs),
            rel: 'service-doc',
            type: 'text/html'
          },
          {
            href: toAbsoluteUrl(siteConfig.siteUrl, siteConfig.publishPaths.healthApi),
            rel: 'status',
            type: 'application/json'
          },
          ...authItems
        ]
      }
    ]
  };
}

function getAuthDiscoveryConfig(siteConfig) {
  if (!siteConfig.authDiscovery?.enabled) return null;

  const auth = siteConfig.authDiscovery;
  const issuer = (auth.issuer || siteConfig.siteUrl).replace(/\/$/, '');

  return {
    issuer,
    authorizationEndpoint: toAbsoluteUrl(siteConfig.siteUrl, auth.authorizationEndpoint),
    tokenEndpoint: toAbsoluteUrl(siteConfig.siteUrl, auth.tokenEndpoint),
    jwksUri: toAbsoluteUrl(siteConfig.siteUrl, auth.jwksUri),
    grantTypesSupported: auth.grantTypesSupported || ['authorization_code'],
    responseTypesSupported: auth.responseTypesSupported || ['code'],
    tokenEndpointAuthMethodsSupported: auth.tokenEndpointAuthMethodsSupported || ['private_key_jwt'],
    scopesSupported: auth.scopesSupported || ['portfolio.read'],
    codeChallengeMethodsSupported: auth.codeChallengeMethodsSupported || ['S256']
  };
}

function buildOauthAuthorizationServerMetadata(siteConfig) {
  const auth = getAuthDiscoveryConfig(siteConfig);
  if (!auth) return null;

  return {
    issuer: auth.issuer,
    authorization_endpoint: auth.authorizationEndpoint,
    token_endpoint: auth.tokenEndpoint,
    jwks_uri: auth.jwksUri,
    grant_types_supported: auth.grantTypesSupported,
    response_types_supported: auth.responseTypesSupported,
    token_endpoint_auth_methods_supported: auth.tokenEndpointAuthMethodsSupported,
    scopes_supported: auth.scopesSupported,
    code_challenge_methods_supported: auth.codeChallengeMethodsSupported
  };
}

function buildOauthProtectedResourceMetadata(siteConfig) {
  const auth = getAuthDiscoveryConfig(siteConfig);
  if (!auth) return null;

  const protectedResourceConfig = siteConfig.authDiscovery?.protectedResource || {};
  const authorizationServers =
    protectedResourceConfig.authorizationServers?.length
      ? protectedResourceConfig.authorizationServers
      : [auth.issuer];

  return {
    resource: protectedResourceConfig.resource || toAbsoluteUrl(siteConfig.siteUrl, '/api/'),
    authorization_servers: authorizationServers,
    scopes_supported: protectedResourceConfig.scopesSupported || auth.scopesSupported
  };
}

function buildOidcDiscoveryMetadata(siteConfig) {
  const oauthMetadata = buildOauthAuthorizationServerMetadata(siteConfig);
  if (!oauthMetadata) return null;

  return {
    ...oauthMetadata,
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: ['iss', 'sub', 'aud', 'exp', 'iat', 'scope']
  };
}

function buildJwksDocument() {
  // Static site mode: discovery is published, but signing keys are managed externally.
  return { keys: [] };
}

function buildMcpServerCard(siteConfig) {
  return {
    serverInfo: {
      name: siteConfig.mcp.name,
      version: siteConfig.mcp.version
    },
    documentationUrl: toAbsoluteUrl(siteConfig.siteUrl, siteConfig.publishPaths.apiDocs),
    transports: [
      {
        type: 'webmcp',
        url: siteConfig.siteUrl
      }
    ],
    capabilities: {
      tools: [
        'navigate_to_section',
        'open_accessibility_settings',
        'set_theme',
        'get_profile_summary'
      ]
    }
  };
}

async function writeGeneratedFile(relativePath, content) {
  const outputPath = path.join(outputDir, ...relativePath.split('/').filter(Boolean));
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, content, 'utf-8');
}

async function writeGeneratedJson(relativePath, value) {
  await writeGeneratedFile(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function hashSha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function buildAgentSkillsIndex(siteConfig) {
  const skillsDir = path.join(rootDir, '.well-known', 'agent-skills');
  const files = (await readdir(skillsDir)).filter((fileName) => fileName.endsWith('.md')).sort();

  return {
    $schema: 'https://agentskills.io/schemas/agent-skills-index-v0.2.0.json',
    skills: await Promise.all(files.map(async (fileName) => {
      const fileContent = await readFile(path.join(skillsDir, fileName), 'utf-8');
      const metadata = agentSkillMetadata[fileName] || {
        name: fileName.replace(/\.md$/, ''),
        description: 'Agent-facing skill description.'
      };

      return {
        name: metadata.name,
        type: 'text/markdown',
        description: metadata.description,
        url: toAbsoluteUrl(siteConfig.siteUrl, `/.well-known/agent-skills/${fileName}`),
        sha256: hashSha256(fileContent)
      };
    }))
  };
}

async function writeGeneratedArtifacts(data, siteConfig) {
  const buildTime = new Date();

  await writeGeneratedFile('robots.txt', renderRobotsTxt(siteConfig));
  await writeGeneratedFile('sitemap.xml', renderSitemapXml(siteConfig, buildTime));
  await writeGeneratedFile('index.md', renderMarkdown(data, siteConfig));
  await writeGeneratedJson('api/profile.json', buildProfileDocument(data, siteConfig));
  await writeGeneratedJson('api/health.json', buildHealthDocument(siteConfig, buildTime));
  await writeGeneratedJson('api/openapi.json', buildOpenApiDocument(siteConfig));
  await writeGeneratedJson('.well-known/api-catalog', buildApiCatalog(siteConfig));
  await writeGeneratedJson('.well-known/mcp/server-card.json', buildMcpServerCard(siteConfig));
  await writeGeneratedJson('.well-known/agent-skills/index.json', await buildAgentSkillsIndex(siteConfig));

  const oauthMetadata = buildOauthAuthorizationServerMetadata(siteConfig);
  if (oauthMetadata) {
    const protectedResourcePath = siteConfig.publishPaths?.oauthProtectedResource || '/.well-known/oauth-protected-resource';
    await writeGeneratedJson('.well-known/oauth-authorization-server', oauthMetadata);
    await writeGeneratedJson('.well-known/openid-configuration', buildOidcDiscoveryMetadata(siteConfig));
    await writeGeneratedJson(protectedResourcePath, buildOauthProtectedResourceMetadata(siteConfig));
    await writeGeneratedJson('.well-known/jwks.json', buildJwksDocument());
  }
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

  // Remove data.js and render.js — content is pre-rendered; runtime JS modules are kept
  html = html.replace(/\s*<script src="data\/data\.js"><\/script>/, '');
  html = html.replace(/\s*<script src="js\/render\.js"><\/script>/, '');

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
  const data = await loadData();
  const siteConfig = await loadSiteConfig();

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await copyRequiredFiles();
  await copyOptionalFiles();
  await copyOptionalDirectories();
  await writeGeneratedArtifacts(data, siteConfig);

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
