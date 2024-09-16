import { describe, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PciAnnouncementBanner } from './PciAnnouncementBanner';
import * as announcementBannerHook from './useAnnouncementBanner.hook';

const mockNavigateTo = vi.fn();

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({ navigateTo: mockNavigateTo }),
}));

const queryClient = new QueryClient();

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PciAnnouncementBanner projectId="projectId" />
    </QueryClientProvider>,
  );

describe('PciAnnouncementBanner component Tests', () => {
  it('should display the banner when component is rendered', () => {
    vi.spyOn(announcementBannerHook, 'useAnnouncementBanner').mockReturnValue({
      isBannerVisible: true,
      isLoading: false,
    });

    const { getByTestId } = renderComponent();

    expect(getByTestId('actionBanner-message_container')).toBeInTheDocument();
    expect(getByTestId('actionBanner-message_container')).toBeVisible();
  });

  it('should navigate to region on btn click', () => {
    vi.spyOn(announcementBannerHook, 'useAnnouncementBanner').mockReturnValue({
      isBannerVisible: true,
      isLoading: false,
    });

    const { queryByTestId } = renderComponent();

    const actionBtn = queryByTestId('actionBanner-button');

    act(() => {
      fireEvent.click(actionBtn);
    });

    expect(mockNavigateTo).toHaveBeenNthCalledWith(
      1,
      'public-cloud',
      '#/pci/projects/projectId/regions',
      {},
    );
  });
});
