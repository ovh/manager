import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPage from './Onboarding.page';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nasha_onboarding_content': 'Explore managed storage services...',
        'nasha_onboarding_getting-started_title': 'Getting started with HA-NAS',
        'nasha_onboarding_getting-started_content': 'Learn how to manage HA-NAS',
        'nasha_onboarding_nfs_title': 'Mount your NAS via NFS',
        'nasha_onboarding_nfs_content': 'Learn how to mount NAS via NFS',
        'nasha_onboarding_cifs_title': 'Mount NAS on Windows via CIFS',
        'nasha_onboarding_cifs_content': 'Learn how to mount NAS via CIFS',
        'nasha_onboarding_order': 'Order HA-NAS',
        'nasha_onboarding_guides_title': 'Guides',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock tracking
const mockTrackClick = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick: mockTrackClick }),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ header, children }: any) => (
    <div>
      <h1>{header.title}</h1>
      {children}
    </div>
  ),
  Button: ({ children, onClick, variant, size }: any) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Title: ({ children, level, className }: any) => (
    <h2 data-level={level} className={className}>
      {children}
    </h2>
  ),
  Subtitle: ({ children, className }: any) => (
    <p className={className}>{children}</p>
  ),
  Links: ({ items }: any) => (
    <div data-testid="links">
      {items.map((item: any) => (
        <a
          key={item.id}
          href={item.href}
          data-external={item.external}
          onClick={item.onClick}
        >
          {item.label} - {item.description}
        </a>
      ))}
    </div>
  ),
}));

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders onboarding content', () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('NAS-HA')).toBeInTheDocument();
    expect(screen.getByText('Explore managed storage services...')).toBeInTheDocument();
    expect(screen.getByText('Order HA-NAS')).toBeInTheDocument();
  });

  it('renders guide links', () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Guides')).toBeInTheDocument();
    expect(screen.getByText('Getting started with HA-NAS - Learn how to manage HA-NAS')).toBeInTheDocument();
    expect(screen.getByText('Mount your NAS via NFS - Learn how to mount NAS via NFS')).toBeInTheDocument();
    expect(screen.getByText('Mount NAS on Windows via CIFS - Learn how to mount NAS via CIFS')).toBeInTheDocument();
  });

  it('handles order button click', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    const orderButton = screen.getByText('Order HA-NAS');
    fireEvent.click(orderButton);

    expect(mockTrackClick).toHaveBeenCalledWith('onboarding::add');
    expect(mockOpen).toHaveBeenCalledWith('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  });

  it('handles guide link clicks', () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    const guideLinks = screen.getAllByRole('link');
    fireEvent.click(guideLinks[0]); // First guide link

    expect(mockTrackClick).toHaveBeenCalledWith('onboarding::documentation::getting-started');
  });

  it('has correct button attributes', () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    const orderButton = screen.getByTestId('button');
    expect(orderButton).toHaveAttribute('data-variant', 'primary');
    expect(orderButton).toHaveAttribute('data-size', 'lg');
  });

  it('has external links with correct hrefs', () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'https://docs.ovh.com/gb/en/storage/nas/get-started/');
    expect(links[0]).toHaveAttribute('data-external', 'true');
    expect(links[1]).toHaveAttribute('href', 'https://docs.ovh.com/gb/en/storage/nas-nfs/');
    expect(links[2]).toHaveAttribute('href', 'https://docs.ovh.com/gb/en/storage/nas/nas-cifs/');
  });
});
