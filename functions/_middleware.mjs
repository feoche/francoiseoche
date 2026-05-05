import { markdownResponseHeaders, shouldServeMarkdown } from './markdown-negotiation.mjs';

async function getMarkdownAsset(request) {
  const markdownUrl = new URL('/index.md', request.url);
  return fetch(markdownUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: 'text/markdown'
    }
  });
}

export async function onRequest(context) {
  const acceptHeader = context.request.headers.get('accept') || '';
  const pathname = new URL(context.request.url).pathname;

  if (shouldServeMarkdown(pathname, acceptHeader)) {
    const markdownAsset = await getMarkdownAsset(context.request);

    if (markdownAsset.ok) {
      const markdownContent = await markdownAsset.text();
      const headers = new Headers(markdownAsset.headers);
      const overrides = markdownResponseHeaders(markdownContent);

      Object.entries(overrides).forEach(([name, value]) => {
        headers.set(name, value);
      });

      return new Response(markdownContent, {
        status: markdownAsset.status,
        headers
      });
    }
  }

  const response = await context.next();
  if (pathname === '/' || pathname === '/index.html') {
    const currentVary = response.headers.get('vary');
    if (!currentVary) {
      response.headers.set('vary', 'Accept');
    } else if (!currentVary.toLowerCase().includes('accept')) {
      response.headers.set('vary', `${currentVary}, Accept`);
    }
  }

  return response;
}
