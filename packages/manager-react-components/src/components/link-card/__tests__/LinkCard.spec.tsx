import React from 'react';
import { vitest, describe, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import {
  texts,
  href,
  description,
  img,
  renderLinkCard,
  badges,
} from './LinkCard.spec.utils';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vi.fn(() => ({ isAuthorized: true })),
}));

describe('LinkCard tests', () => {
  it('renders with mandatory props', async () => {
    renderLinkCard({ texts, href });
    const titleElement = screen.getByText(texts.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H3');

    const categoryElement = screen.getByText(texts.category);
    expect(categoryElement).toBeInTheDocument();
    expect(categoryElement.tagName).toBe('H4');
  });

  it('renders with description', () => {
    renderLinkCard({
      href,
      texts: {
        ...texts,
        description,
      },
    });
    const descriptionElement = screen.getByText(description);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement.tagName).toBe('P');
  });

  it('renders with image', () => {
    renderLinkCard({ texts, href, img });
    const imageElement = screen.getByAltText(img.alt);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.tagName).toBe('IMG');
  });

  it('renders with badge', () => {
    renderLinkCard({ texts, href, badges });
    badges.forEach((badge) => {
      expect(screen.queryByText(badge.text)).toBeInTheDocument();
    });
  });

  it('renders with custom href', () => {
    const hrefLabel = 'Custom Link Label';
    renderLinkCard({ texts, href, hrefLabel });
    expect(screen.queryByText(hrefLabel)).toBeInTheDocument();
  });

  it('renders with external href', () => {
    const { container } = renderLinkCard({ texts, href, externalHref: true });
    const linkElement = container.querySelector('[tab-index="-1"]');
    const [iconElement] = linkElement.getElementsByTagName('span');
    expect(iconElement.className).toContain('external-link');
  });

  it('calls onClick when the card is clicked', () => {
    const onClick = vitest.fn();
    renderLinkCard({ texts, href, onClick });
    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);
    expect(onClick).toHaveBeenCalled();
  });

  it('sets data-tracking label', () => {
    const trackingLabel = 'Tracking Label';
    const { container } = renderLinkCard({ texts, href, trackingLabel });
    expect(
      container.querySelector(`[data-tracking="${trackingLabel}"]`),
    ).toBeInTheDocument();
  });
});
