import { useMemo } from 'react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { Card } from '@ovhcloud/ods-react';

type Props = {
  html: string;
  className?: string;
  /**
   * If true, the iframe will be visible.
   * Has been done to optimize re-sanitazing the html
   */
  isVisible?: boolean;
};

export default function HtmlViewer({ html, className, isVisible }: Props) {
  const sanitized = useMemo(() => {
    const parser = new DOMParser();
    const sanitizedHtml = DOMPurify.sanitize(html, { WHOLE_DOCUMENT: true });

    // open all links in a new tab
    const doc = parser.parseFromString(sanitizedHtml, 'text/html');
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  }, [html]);

  return (
    <Card
      className={clsx('w-full h-full p-0', isVisible ? 'flex' : 'hidden')}
    >
      <iframe
        srcDoc={sanitized}
        data-testid="html-viewer"
        sandbox="allow-popups allow-popups-to-escape-sandbox" // allow links to open in new tabs
        className={clsx(
          'border-none w-full rounded-[var(--ods-theme-border-radius)]',
          isVisible ? 'flex' : 'hidden',
          className,
        )}
      />
    </Card>
  );
}
