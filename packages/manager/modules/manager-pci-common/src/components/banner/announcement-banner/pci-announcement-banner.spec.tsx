import { describe, vi } from 'vitest';
import { act, fireEvent, render, renderHook } from '@testing-library/react';
import * as coreApplication from '@ovh-ux/manager-react-core-application';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  PciAnnouncementBanner,
  pciAnnouncementBannerId,
  useAnnouncementBanner,
} from './pci-announcement-banner';

const mockNavigateTo = vi.fn();

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({ navigateTo: mockNavigateTo }),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PciAnnouncementBanner projectId="projectId" />
    </QueryClientProvider>,
  );

describe('PciAnnouncementBanner component Tests', () => {
  it('should display the banner when component is rendered', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('actionBanner-message_container')).toBeInTheDocument();
    expect(getByTestId('actionBanner-message_container')).toBeVisible();
  });

  it('should navigate to region on btn click', () => {
    const { getByTestId } = renderComponent();

    const actionButton = getByTestId('actionBanner-button');

    act(() => {
      fireEvent.click(actionButton);
    });

    expect(mockNavigateTo).toHaveBeenNthCalledWith(
      1,
      'public-cloud',
      '#/pci/projects/projectId/regions',
      {},
    );
  });
});

describe('useAnnouncementBanner', () => {
  it('should return banner visibility as true when feature is available', () => {
    vi.spyOn(coreApplication, 'useFeatureAvailability').mockReturnValue({
      data: { [pciAnnouncementBannerId]: true },
      isLoading: false,
    } as UseQueryResult<Record<string, boolean>, unknown>);

    const { result } = renderHook(() => useAnnouncementBanner(), { wrapper });

    expect(result.current.isBannerVisible).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return banner visibility as false when feature is not available', () => {
    vi.spyOn(coreApplication, 'useFeatureAvailability').mockReturnValue({
      data: { [pciAnnouncementBannerId]: false },
      isLoading: false,
    } as UseQueryResult<Record<string, boolean>, unknown>);

    const { result } = renderHook(() => useAnnouncementBanner(), { wrapper });

    expect(result.current.isBannerVisible).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return isLoading as true when feature availability is loading', () => {
    vi.spyOn(coreApplication, 'useFeatureAvailability').mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseQueryResult<Record<string, boolean>, unknown>);

    const { result } = renderHook(() => useAnnouncementBanner(), { wrapper });

    expect(result.current.isBannerVisible).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });
});
