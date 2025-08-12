import React from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as onboardingHooks from '@/data/hooks/onboarding/useOnboarding';
import type { OnboardingContentType, OnboardingLinksType } from '@/types/Onboarding.type';

import Onboarding from './Onboarding.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  OnboardingLayout: ({
    title,
    img,
    description,
    children,
  }: {
    title?: string;
    img?: { src: string; alt?: string };
    description?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <div>
      {title ? <h1>{title}</h1> : null}
      {img ? <img alt={img.alt ?? ''} src={img.src} /> : null}
      <div data-testid="desc">{description}</div>
      <div data-testid="cards">{children}</div>
    </div>
  ),
  // eslint-disable-next-line react/no-multi-comp
  Card: ({ href, texts }: { href: string; texts: { title?: string } }) => (
    <a href={href}>{texts.title}</a>
  ),
}));
vi.mock('@ovhcloud/ods-components/react', () => ({
  // eslint-disable-next-line react/no-multi-comp
  OdsText: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Onboarding', () => {
  it('renders title, description, hero image, and valid cards', () => {
    vi.spyOn(onboardingHooks, 'useOnboardingContent').mockReturnValue({
      productName: 'MyProduct',
      productCategory: 'CategoryX',
      brand: 'MyBrand',
      title: 'Custom Title',
      heroImage: { src: '/hero.png', alt: 'Hero Alt' },
      tiles: [
        { id: 1, key: 'tile1', linkKey: 'discover' },
        { id: 2, key: 'tile2', linkKey: 'tutorial' },
      ],
    } satisfies OnboardingContentType);

    vi.spyOn(onboardingHooks, 'useGuideLinks').mockReturnValue({
      discover: '/docs/1',
      tutorial: '/docs/2',
      faq: '',
    } satisfies OnboardingLinksType);

    render(<Onboarding />);

    expect(screen.getByRole('heading', { name: 'Custom Title' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/hero.png');
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('filters out tiles with missing links and falls back title', () => {
    vi.spyOn(onboardingHooks, 'useOnboardingContent').mockReturnValue({
      productName: 'MyProduct',
      productCategory: 'CategoryX',
      brand: 'MyBrand',
      title: undefined,
      heroImage: undefined,
      tiles: [
        { id: 1, key: 'tile1', linkKey: 'discover' },
        { id: 2, key: 'tile2', linkKey: 'faq' },
      ],
    } satisfies OnboardingContentType);

    vi.spyOn(onboardingHooks, 'useGuideLinks').mockReturnValue({
      discover: '',
      tutorial: '',
      faq: '/faq',
    } satisfies OnboardingLinksType);

    render(<Onboarding />);

    expect(screen.getByRole('heading', { name: 'onboarding:title_fallback' })).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/faq');
  });
});
