import React, { PropsWithChildren } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { LinkCardProps, OnboardingLayoutProps } from '@ovh-ux/muk';

import { useShares } from '@/data/hooks/shares/useShares';
import { useGetUser } from '@/hooks/useGetUser';

import OnboardingPage from '../Onboarding.page';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Navigate: () => null,
}));

vi.mock('@ovh-ux/muk', () => {
  const OnboardingLayout = ({
    title,
    img,
    description,
    children,
    orderButtonLabel,
    onOrderButtonClick,
  }: OnboardingLayoutProps): React.ReactElement => (
    <div>
      <h1>{title}</h1>
      {img && <img src={img.src} alt={img.alt} />}
      <div>{description}</div>
      {orderButtonLabel && onOrderButtonClick && (
        <button onClick={onOrderButtonClick}>{orderButtonLabel}</button>
      )}
      <div>{children}</div>
    </div>
  );

  const LinkCard = ({ href, texts }: LinkCardProps): React.ReactElement => (
    <a href={href}>
      <h2>{texts.title}</h2>
      <p>{texts.description}</p>
      <span>{texts.category}</span>
    </a>
  );

  const BaseLayout = ({ children }: PropsWithChildren): React.ReactElement => <div>{children}</div>;

  return { OnboardingLayout, LinkCard, BaseLayout };
});

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: () => <nav aria-label="Breadcrumb">Breadcrumb</nav>,
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useEnvironment: vi.fn().mockReturnValue({ region: 'EU' }),
}));

vi.mock('@/hooks/useGetUser', () => ({
  useGetUser: vi.fn().mockReturnValue({ ovhSubsidiary: 'FR' }),
}));

vi.mock('@/data/hooks/shares/useShares', () => ({
  useShares: vi.fn().mockReturnValue({
    data: false,
    isLoading: false,
    fetchNextPage: vi.fn(),
    fetchPreviousPage: vi.fn(),
    hasNextPage: false,
    hasPreviousPage: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
  }),
}));

describe('OnboardingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('rendering', () => {
    it('renders page structure with title, breadcrumb, and order button', () => {
      render(<OnboardingPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('onboarding:title');
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'onboarding:action-button' })).toBeVisible();
    });

    it('renders all guide link cards', () => {
      render(<OnboardingPage />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });
  });

  describe('guide link cards', () => {
    it('renders link cards with correct hrefs for FR subsidiary', () => {
      render(<OnboardingPage />);

      const links = screen.getAllByRole('link');

      expect(links[0]).toHaveAttribute('href', 'https://labs.ovhcloud.com/en/file-storage/');
      expect(links[1]).toHaveAttribute(
        'href',
        'https://help.ovhcloud.com/csm/fr-public-cloud-storage-file-storage-service-getting-started?id=kb_article_view&sysparm_article=KB0072902',
      );
      expect(links[2]).toHaveAttribute('href', 'https://discord.com/invite/ovhcloud');
    });

    it('renders link cards with correct translations', () => {
      render(<OnboardingPage />);

      expect(screen.getByText('guides:learn-more.title')).toBeVisible();
      expect(screen.getByText('guides:learn-more.description')).toBeVisible();
      expect(screen.getByText('guides:learn-more.category')).toBeVisible();

      expect(screen.getByText('guides:get-started.title')).toBeVisible();
      expect(screen.getByText('guides:get-started.description')).toBeVisible();
      expect(screen.getByText('guides:get-started.category')).toBeVisible();

      expect(screen.getByText('guides:discord.title')).toBeVisible();
      expect(screen.getByText('guides:discord.description')).toBeVisible();
      expect(screen.getByText('guides:discord.category')).toBeVisible();
    });
  });

  describe('user interactions', () => {
    it('navigates to create page when order button is clicked', async () => {
      const user = userEvent.setup();
      render(<OnboardingPage />);

      const orderButton = screen.getByRole('button', { name: 'onboarding:action-button' });
      await user.click(orderButton);

      expect(mockNavigate).toHaveBeenCalledWith('../new');
    });
  });

  describe('redirect when shares exist', () => {
    it('redirects to list page when user has shares', () => {
      vi.mocked(useShares).mockReturnValueOnce({
        data: true,
        isLoading: false,
        fetchNextPage: vi.fn(),
        fetchPreviousPage: vi.fn(),
        hasNextPage: false,
        hasPreviousPage: false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false,
      } as unknown as ReturnType<typeof useShares>);
      render(<OnboardingPage />);

      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    });
  });

  describe('US region', () => {
    beforeEach(() => {
      vi.mocked(useEnvironment).mockReturnValue({ region: 'US' } as ReturnType<
        typeof useEnvironment
      >);
      vi.mocked(useGetUser).mockReturnValue({ ovhSubsidiary: 'US' });
    });

    it('renders only the get-started link card', () => {
      render(<OnboardingPage />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
    });

    it('renders get-started link card with correct US href', () => {
      render(<OnboardingPage />);

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        expect.stringContaining('https://support.us.ovhcloud.com/hc/en-us/articles/'),
      );
    });

    it('renders get-started guide translations', () => {
      render(<OnboardingPage />);

      expect(screen.getByText('guides:get-started.title')).toBeVisible();
      expect(screen.getByText('guides:get-started.description')).toBeVisible();
    });
  });
});
