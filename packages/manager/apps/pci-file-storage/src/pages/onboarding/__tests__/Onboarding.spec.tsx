import React, { PropsWithChildren } from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LinkCardProps, OnboardingLayoutProps } from '@ovh-ux/muk';

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

  const BaseLayout = ({ children }: PropsWithChildren) => <div>{children}</div>;

  return { OnboardingLayout, LinkCard, BaseLayout };
});

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

vi.mock('@/hooks/useGetUser', () => ({
  useGetUser: () => ({
    ovhSubsidiary: 'FR',
  }),
}));

describe('OnboardingPage', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('renders layout with translated title, description, hero image and link cards', () => {
    render(<OnboardingPage />);

    const layout = screen.getByTestId('layout');
    expect(layout).toBeVisible();

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('onboarding:title');

    expect(screen.getByTestId('description')).toBeVisible();

    const cards = screen.getAllByTestId('link-card');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveAttribute('href', 'https://labs.ovhcloud.com/en/file-storage/');
    expect(cards[1]).toHaveAttribute(
      'href',
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072902',
    );
    expect(cards[2]).toHaveAttribute('href', 'https://discord.com/invite/ovhcloud');
  });
});
