import React from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LinkCardProps, OnboardingLayoutProps, TextProps } from '@ovh-ux/muk';

import OnboardingPage from '../Onboarding.page';

vi.mock('@ovh-ux/muk', () => {
  const OnboardingLayout = ({
    title,
    img,
    description,
    children,
  }: OnboardingLayoutProps): JSX.Element => (
    <div data-testid="layout">
      <h1>{title}</h1>
      {img && <img src={img.src} alt={img.alt} data-testid="hero-img" />}
      <div data-testid="description">{description}</div>
      <div data-testid="children">{children}</div>
    </div>
  );

  const LinkCard = ({ href, texts }: LinkCardProps): JSX.Element => (
    <a href={href} data-testid="link-card">
      <h2>{texts.title}</h2>
      <p>{texts.description}</p>
      <span>{texts.category}</span>
    </a>
  );

  const Text = ({ children }: TextProps): JSX.Element => <p>{children}</p>;

  return { OnboardingLayout, LinkCard, Text };
});

describe('OnboardingPage', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('renders layout with translated title, description, hero image and link cards', () => {
    render(<OnboardingPage />);

    const layout = screen.getByTestId('layout');
    expect(layout).toBeVisible();

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('onboarding:title_fallback');

    expect(screen.getByTestId('description')).toBeVisible();

    const cards = screen.getAllByTestId('link-card');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveAttribute('href', 'https://docs.ovh.com/discover');
    expect(cards[1]).toHaveAttribute('href', 'https://docs.ovh.com/tutorial');
    expect(cards[2]).toHaveAttribute('href', 'https://docs.ovh.com/faq');
  });
});
