import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextViewer from './TextViewer.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => new Promise(() => {}) },
  }),
  Trans: ({ defaults }: { defaults?: string }) => defaults ?? null,
}));

describe('TextViewer.component', () => {
  it('renders plain text without URLs or emails', () => {
    const text = 'Hello, this is plain text.';
    render(<TextViewer text={text} />);

    const pre = screen.getByText((content) => content.includes('Hello, this is plain text.'));
    expect(pre).toBeInTheDocument();
  });

  it('renders empty text', () => {
    const { container } = render(<TextViewer text="" />);

    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveTextContent('');
  });

  it('linkifies URLs in the text', () => {
    const text = 'Visit https://example.com for more.';
    const { container } = render(<TextViewer text={text} />);

    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain('https://example.com');
    expect(pre?.textContent).toContain('href="https://example.com"');
  });

  it('linkifies emails in the text', () => {
    const text = 'Contact us at user@example.com for help.';
    const { container } = render(<TextViewer text={text} />);

    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain('user@example.com');
    expect(pre?.textContent).toContain('href="mailto:user@example.com"');
  });

  it('linkifies both URLs and emails in the same text', () => {
    const text = 'Go to https://ovhcloud.com or email support@ovhcloud.com';
    const { container } = render(<TextViewer text={text} />);

    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain('https://ovhcloud.com');
    expect(pre?.textContent).toContain('support@ovhcloud.com');
    expect(pre?.textContent).toContain('href="https://ovhcloud.com"');
    expect(pre?.textContent).toContain('href="mailto:support@ovhcloud.com"');
  });

  it('preserves whitespace and line breaks', () => {
    const text = 'Line one\nLine two\n  Indented';
    const { container } = render(<TextViewer text={text} />);

    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveClass('whitespace-pre-wrap');
    expect(pre?.textContent).toContain('Line one');
    expect(pre?.textContent).toContain('Line two');
    expect(pre?.textContent).toContain('  Indented');
  });
});
