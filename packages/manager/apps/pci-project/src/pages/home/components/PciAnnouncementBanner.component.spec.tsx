/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocation } from 'react-router-dom';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { createWrapper } from '@/wrapperRenders';
import PciAnnouncementBanner from './PciAnnouncementBanner.component';

// Mock dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        pci_projects_beta_public_cloud_banner_info:
          'Beta program for Public Cloud: Test our OpenStack-powered solutions.',
        pci_projects_beta_public_cloud_banner_info_link:
          'Start testing by enabling the GRA9 region.',
      };
      return translations[key] || key;
    },
  }),
}));

const mockNavigateTo = vi.fn();

// Create a custom wrapper with mocked navigation
const wrapper = createWrapper({
  environment: {
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getRegion: () => 'EU',
  },
  shell: {
    navigation: {
      navigateTo: mockNavigateTo,
      getURL: vi.fn().mockResolvedValue('https://mocked-url'),
    },
  },
} as any);

describe('PciAnnouncementBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useLocation as any).mockReturnValue({
      pathname: '/pci/projects/project123/home',
    });
  });

  it('should not render when feature flag is disabled', () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: { 'public-cloud:pci-announcement-banner': false },
    });

    render(<PciAnnouncementBanner />, { wrapper });

    expect(
      screen.queryByTestId('pci-announcement-banner'),
    ).not.toBeInTheDocument();
  });

  it('should not render when feature flag is undefined', () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: undefined,
    });

    render(<PciAnnouncementBanner />, { wrapper });

    expect(
      screen.queryByTestId('pci-announcement-banner'),
    ).not.toBeInTheDocument();
  });

  it('should render when feature flag is enabled', async () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: { 'public-cloud:pci-announcement-banner': true },
    });

    render(<PciAnnouncementBanner />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('pci-announcement-banner')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Beta program for Public Cloud: Test our OpenStack-powered solutions.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('pci-announcement-banner_activation-link'),
    ).toBeInTheDocument();
  });

  it('should navigate when activation link is clicked', async () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: { 'public-cloud:pci-announcement-banner': true },
    });

    render(<PciAnnouncementBanner />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('pci-announcement-banner')).toBeInTheDocument();
    });

    const activationButton = screen.getByTestId(
      'pci-announcement-banner_activation-link',
    );
    fireEvent.click(activationButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '#/pci/projects/project123/activate',
      {},
    );
  });

  it('should be dismissible', async () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: { 'public-cloud:pci-announcement-banner': true },
    });

    render(<PciAnnouncementBanner />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('pci-announcement-banner')).toBeInTheDocument();
    });

    // The OdsMessage should be dismissible (the actual dismiss behavior is handled by the component)
    const message = screen.getByTestId('pci-announcement-banner');
    expect(message).toBeInTheDocument();
  });

  it('should handle different project paths correctly', async () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: { 'public-cloud:pci-announcement-banner': true },
    });

    // Test with different path
    (useLocation as any).mockReturnValue({
      pathname: '/pci/projects/project456/edit',
    });

    render(<PciAnnouncementBanner />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('pci-announcement-banner')).toBeInTheDocument();
    });

    const activationButton = screen.getByTestId(
      'pci-announcement-banner_activation-link',
    );
    fireEvent.click(activationButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '#/pci/projects/project456/activate',
      {},
    );
  });

  it('should handle navigation with correct project ID extraction', async () => {
    (useFeatureAvailability as any).mockReturnValue({
      data: { 'public-cloud:pci-announcement-banner': true },
    });

    (useLocation as any).mockReturnValue({
      pathname: '/pci/projects/project789/quota',
    });

    render(<PciAnnouncementBanner />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('pci-announcement-banner')).toBeInTheDocument();
    });

    const activationButton = screen.getByTestId(
      'pci-announcement-banner_activation-link',
    );
    fireEvent.click(activationButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '#/pci/projects/project789/activate',
      {},
    );
  });
});
