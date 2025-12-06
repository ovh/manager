import React from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LinkCardProps, OnboardingLayoutProps, TextProps } from '@ovh-ux/muk';

import type { OnboardingContentType, OnboardingLinksType } from '@/types/Onboarding.type';

import OnboardingPage from '../Onboarding.page';

type MockUseOnboardingDataModule = {
  useOnboardingContent: () => OnboardingContentType;
  useGuideLinks: () => OnboardingLinksType;
};

vi.mock('react-i18next', () => ({
  useTranslation: (): {
    t: (key: string, vars?: Record<string, unknown>) => string;
  } => ({
    t: (key: string, vars?: Record<string, unknown>) => `${key}${vars ? JSON.stringify(vars) : ''}`,
  }),
}));

vi.mock(
  '@/hooks/onboarding/useOnboardingData',
  (): MockUseOnboardingDataModule => ({
    useOnboardingContent: () => ({
      productName: 'Web Hosting',
      productCategory: 'Hosting',
      brand: 'OVHcloud',
      title: 'Welcome to Web Hosting',
      heroImage: { src: 'hero.jpg', alt: 'Hero Image' },
      tiles: [
        { id: 1, key: 'discover', linkKey: 'discover' },
        { id: 2, key: 'tutorial', linkKey: 'tutorial' },
        { id: 3, key: 'faq', linkKey: 'faq' },
      ],
    }),
    useGuideLinks: () => ({
      discover: 'https://guides.ovh.com/discover',
      tutorial: 'https://guides.ovh.com/tutorial',
      faq: 'https://guides.ovh.com/faq',
    }),
  }),
);

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

    // Layout + title
    const layout = screen.getByTestId('layout');
    expect(layout).toBeInTheDocument();

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Welcome to Web Hosting');

    // Hero image
    const img = screen.getByTestId('hero-img');
    expect(img).toHaveAttribute('src', 'hero.jpg');
    expect(img).toHaveAttribute('alt', 'Hero Image');

    // Description section
    expect(screen.getByTestId('description')).toBeInTheDocument();

    // Link cards
    const cards = screen.getAllByTestId('link-card');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveAttribute('href', 'https://guides.ovh.com/discover');
    expect(cards[1]).toHaveAttribute('href', 'https://guides.ovh.com/tutorial');
    expect(cards[2]).toHaveAttribute('href', 'https://guides.ovh.com/faq');
  });

  it('renders fallback title and no hero image when data missing', async () => {
    vi.resetModules(); // clear previous imports

    vi.doMock(
      '@/hooks/onboarding/useOnboardingData',
      (): MockUseOnboardingDataModule => ({
        useOnboardingContent: () => ({
          productName: 'Cloud',
          productCategory: undefined,
          brand: undefined,
          title: undefined,
          heroImage: undefined,
          tiles: [],
        }),
        useGuideLinks: () => ({
          discover: '',
          tutorial: '',
          faq: '',
        }),
      }),
    );

    // 👇 re-import component after mocks are applied
    const { default: OnboardingPageDynamic } = await import('../Onboarding.page');
    render(<OnboardingPageDynamic />);

    const layout = screen.getByTestId('layout');
    expect(layout).toBeInTheDocument();

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('onboarding:title_fallback{"productName":"Cloud"}');

    expect(screen.queryByTestId('hero-img')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('link-card')).toHaveLength(0);
  });
});
