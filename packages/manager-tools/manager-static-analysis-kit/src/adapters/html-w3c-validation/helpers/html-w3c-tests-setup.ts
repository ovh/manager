import { expect } from 'vitest';

import { validateHtmlString } from './html-w3c-validator';

/** Wraps an HTML fragment into a minimal valid document when needed. */
function asDocument(html: string): string {
  const hasDoctype = /<!doctype\s+html/i.test(html);
  const hasHtmlTag = /<html[\s>]/i.test(html);

  // If it already looks like a full document, leave it as-is.
  if (hasDoctype || hasHtmlTag) return html;

  // Minimal, valid HTML5 document wrapper for fragments
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head><meta charset="utf-8"><title>Test</title></head>',
    '<body>',
    html,
    '</body></html>',
  ].join('');
}

expect.extend({
  async toBeValidHtml(received: string) {
    // Auto-wrap fragments so components validated from RTL work out of the box
    const input = asDocument(received);

    const result = await validateHtmlString(input, ['--errors-only', '--stdout']);

    if (result.success) {
      return {
        pass: true,
        message: () => 'expected HTML not to be valid, but it passed W3C validation',
      };
    }

    return {
      pass: false,
      message: () => `expected HTML to be valid, but got:\n${result.stderr || result.stdout}`,
    };
  },
});
