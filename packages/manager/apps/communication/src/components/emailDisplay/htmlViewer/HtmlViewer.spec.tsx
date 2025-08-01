import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HtmlViewer from './HtmlViewer.component';

describe('HtmlViewer.component', () => {
  it('filters out malicious elements like <script>, <iframe>, <object>, and <embed>', () => {
    const maliciousHtml = `
      <div>Hello world</div>
      <script>alert('XSS')</script>
      <iframe src="https://it.do.be.evil.ovh"></iframe>
      <object data="https://it.do.be.malware.ovh"></object>
      <embed src="https://it.do.be.spyware.ovh" />
    `;

    render(<HtmlViewer html={maliciousHtml} />);

    const iframe = screen.getByTestId('html-viewer') as HTMLIFrameElement;

    // Assert that the iframe exists
    expect(iframe).toBeInTheDocument();

    // srcDoc should NOT contain malicious tags
    const { srcdoc } = iframe;
    expect(srcdoc).toContain('Hello world');
    expect(srcdoc).not.toContain('<script');
    expect(srcdoc).not.toContain('<iframe');
    expect(srcdoc).not.toContain('<object');
    expect(srcdoc).not.toContain('<embed');
  });
});
