// OnboardingPage.test.tsx
import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// --- after mocks ---
import OnboardingPage from './Onboarding.page';

// --- mocks ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

// Simple stateless stubs → not counted as multi-comp
function MockOdsText({ children }: { children: React.ReactNode }) {
  return <div data-testid="ods-text">{children}</div>;
}

// eslint-disable-next-line react/no-multi-comp
function MockOnboardingLayout(props: {
  title: string;
  img?: { src: string; alt: string } | undefined;
  description: React.ReactNode;
  orderButtonLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div data-testid="onboarding-layout">
      <div data-testid="layout-title">{props.title}</div>
      <div data-testid="layout-img-src">{props.img?.src ?? 'no-src'}</div>
      <div data-testid="layout-img-alt">{props.img?.alt ?? 'no-alt'}</div>
      <div data-testid="layout-description">{props.description}</div>
      <div data-testid="layout-children">{props.children}</div>
    </div>
  );
}

type CardProps = {
  href: string;
  texts: { title: string; description: string; category: string };
  hrefLabel: string;
};

// eslint-disable-next-line react/no-multi-comp
function MockCard({ href, texts, hrefLabel }: CardProps) {
  return (
    <div data-testid="card">
      <span>{href}</span>
      <span>{texts.title}</span>
      <span>{texts.description}</span>
      <span>{texts.category}</span>
      <span>{hrefLabel}</span>
    </div>
  );
}

vi.mock('@ovhcloud/ods-components/react', () => ({ OdsText: MockOdsText }));
vi.mock('@ovh-ux/manager-react-components', () => ({
  OnboardingLayout: MockOnboardingLayout,
  Card: MockCard,
}));

const mockUseOnboardingContent = vi.fn();
const mockUseGuideLinks = vi.fn();

vi.mock('@/data/hooks/onboarding/useOnboardingData', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useOnboardingContent: () => mockUseOnboardingContent(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useGuideLinks: () => mockUseGuideLinks(),
}));

describe('OnboardingPage', () => {
  beforeEach(() => {
    mockUseOnboardingContent.mockReset();
    mockUseGuideLinks.mockReset();
  });

  it('renders layout with title, description, and hero image', () => {
    mockUseOnboardingContent.mockReturnValue({
      productName: 'ProductX',
      productCategory: 'CategoryY',
      brand: 'BrandZ',
      title: 'Welcome to ProductX',
      heroImage: { src: '/hero.png', alt: 'hero' },
      tiles: [],
    });
    mockUseGuideLinks.mockReturnValue({});

    render(<OnboardingPage />);
    expect(screen.getByTestId('layout-title')).toHaveTextContent('Welcome to ProductX');
    expect(screen.getByTestId('layout-img-src')).toHaveTextContent('/hero.png');
    expect(screen.getByTestId('layout-img-alt')).toHaveTextContent('hero');
    expect(screen.getByTestId('ods-text')).toBeInTheDocument();
  });

  it('falls back to translated title and hero alt when not provided', () => {
    mockUseOnboardingContent.mockReturnValue({
      productName: 'ProductX',
      productCategory: 'CategoryY',
      brand: 'BrandZ',
      title: undefined,
      heroImage: { src: '/hero.png', alt: undefined },
      tiles: [],
    });
    mockUseGuideLinks.mockReturnValue({});

    render(<OnboardingPage />);
    expect(screen.getByTestId('layout-title')).toHaveTextContent(
      'onboarding:title_fallback:{"productName":"ProductX"}',
    );
    expect(screen.getByTestId('layout-img-src')).toHaveTextContent('/hero.png');
    expect(screen.getByTestId('layout-img-alt')).toHaveTextContent(
      'onboarding:hero_alt:{"productName":"ProductX"}',
    );
  });

  it('renders only tiles with matching guide links', () => {
    mockUseOnboardingContent.mockReturnValue({
      productName: 'ProductX',
      productCategory: 'CategoryY',
      brand: 'BrandZ',
      title: 'Title',
      heroImage: undefined,
      tiles: [
        { id: '1', key: 'guide1', linkKey: 'link1' },
        { id: '2', key: 'guide2', linkKey: 'missing' },
      ],
    });
    mockUseGuideLinks.mockReturnValue({
      link1: '/docs/guide1',
    });

    render(<OnboardingPage />);
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('/docs/guide1');
    expect(cards[0]).toHaveTextContent('onboarding:guides.guide1.title:{"productName":"ProductX"}');
    expect(cards[0]).toHaveTextContent(
      'onboarding:guides.guide1.description:{"productName":"ProductX"}',
    );
    expect(cards[0]).toHaveTextContent('onboarding:guides.guide1.category');
    expect(cards[0]).toHaveTextContent('onboarding:guides.guide1.cta');
  });
});
