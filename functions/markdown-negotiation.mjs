const MARKDOWN_MEDIA_TYPE = 'text/markdown';

function normalizePath(pathname = '/') {
  if (!pathname) return '/';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}

function parseAcceptHeader(acceptHeader = '') {
  return acceptHeader
    .split(',')
    .map((entry) => {
      const [type, ...params] = entry.trim().toLowerCase().split(';').map((part) => part.trim());
      const qParam = params.find((part) => part.startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return {
        type,
        q: Number.isFinite(q) ? q : 1
      };
    })
    .filter((entry) => entry.type);
}

export function shouldServeMarkdown(pathname = '/', acceptHeader = '') {
  const normalizedPath = normalizePath(pathname);
  const isHomepage = normalizedPath === '/' || normalizedPath === '/index.html';
  if (!isHomepage) return false;

  const acceptedTypes = parseAcceptHeader(acceptHeader);
  const markdown = acceptedTypes.find((entry) => entry.type === MARKDOWN_MEDIA_TYPE || entry.type === 'text/*' || entry.type === '*/*');
  const html = acceptedTypes.find((entry) => entry.type === 'text/html');

  if (!markdown) return false;
  if (!html) return markdown.q > 0;

  return markdown.q >= html.q;
}

export function estimateMarkdownTokens(markdownContent = '') {
  // Lightweight token estimate used only for telemetry headers.
  return Math.max(1, Math.ceil(markdownContent.length / 4));
}

export function markdownResponseHeaders(markdownContent = '') {
  return {
    'content-type': 'text/markdown; charset=utf-8',
    vary: 'Accept',
    'x-markdown-tokens': String(estimateMarkdownTokens(markdownContent))
  };
}
