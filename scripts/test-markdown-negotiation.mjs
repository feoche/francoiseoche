import assert from 'node:assert/strict';
import { estimateMarkdownTokens, markdownResponseHeaders, shouldServeMarkdown } from '../functions/markdown-negotiation.mjs';

function run() {
  assert.equal(shouldServeMarkdown('/', 'text/markdown'), true);
  assert.equal(shouldServeMarkdown('/', 'text/html'), false);
  assert.equal(shouldServeMarkdown('/', 'text/html;q=1, text/markdown;q=0.9'), false);
  assert.equal(shouldServeMarkdown('/', 'text/html;q=0.6, text/markdown;q=0.9'), true);
  assert.equal(shouldServeMarkdown('/index.html', 'text/*'), true);
  assert.equal(shouldServeMarkdown('/projects', 'text/markdown'), false);

  assert.equal(estimateMarkdownTokens('abcd'), 1);
  assert.equal(estimateMarkdownTokens('abcdefgh'), 2);

  const headers = markdownResponseHeaders('# Hello');
  assert.equal(headers['content-type'], 'text/markdown; charset=utf-8');
  assert.equal(headers.vary, 'Accept');
  assert.ok(Number(headers['x-markdown-tokens']) >= 1);

  console.log('markdown-negotiation: ok');
}

run();

