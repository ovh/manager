import { ApiError } from '@ovh-ux/manager-core-api';
import { useDownloadRCloneConfig } from '@ovh-ux/manager-pci-common';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTracking } from '@/hooks/useTracking';
import { useProductRegionsAvailability } from '@/api/hooks/useRegions';
import RCloneDownload from './RCloneDownload.page';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useRegions', () => ({
  useProductRegionsAvailability: vi.fn(),
}));

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useDownloadRCloneConfig: vi.fn(),
  };
});

describe('RCloneDownload', () => {
  const mockNavigate = vi.fn();

  const mockDownload = vi.fn();

  const mockTrackConfirmAction = vi.fn();
  const mockTrackCancelAction = vi.fn();
  const mockTrackSuccessPage = vi.fn();
  const mockTrackErrorPage = vi.fn();
  const mockTrackActionClick = vi.fn();
  const mockTrackNavigationClick = vi.fn();
  const mockTrackCopyClipboardClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useDownloadRCloneConfig).mockReturnValue({
      download: mockDownload,
      isLoading: false,
    } as ReturnType<typeof useDownloadRCloneConfig>);

    vi.mocked(useTracking).mockReturnValue({
      trackConfirmAction: mockTrackConfirmAction,
      trackCancelAction: mockTrackCancelAction,
      trackSuccessPage: mockTrackSuccessPage,
      trackErrorPage: mockTrackErrorPage,
      trackActionClick: mockTrackActionClick,
      trackNavigationClick: mockTrackNavigationClick,
      trackCopyClipboardClick: mockTrackCopyClipboardClick,
    });
  });

  it('shows loading state when user data is loading', async () => {
    vi.mocked(useProductRegionsAvailability).mockReturnValue({
      data: [],
      isPending: true,
    } as ReturnType<typeof useProductRegionsAvailability>);

    render(<RCloneDownload />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('shows loading state when delete operation is pending', async () => {
    vi.mocked(useDownloadRCloneConfig).mockReturnValue({
      download: mockDownload,
      isLoading: true,
    } as ReturnType<typeof useDownloadRCloneConfig>);

    render(<RCloneDownload />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('should navigate back when cancel button is clicked', () => {
    render(<RCloneDownload />);

    fireEvent.click(screen.getByTestId('pciModal-button_cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call download when confirm button is clicked', () => {
    render(<RCloneDownload />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    expect(mockDownload).toHaveBeenCalled();
  });

  it('should handles successful API response correctly', async () => {
    vi.mocked(useDownloadRCloneConfig).mockImplementation(
      ({ onSuccess }) =>
        ({
          download: ({
            region,
            fileType,
          }: {
            region: string;
            fileType: string;
          }) => {
            mockDownload({ region, fileType });
            onSuccess('content');
          },
          isLoading: false,
        } as ReturnType<typeof useDownloadRCloneConfig>),
    );

    render(<RCloneDownload />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handles error API response correctly', async () => {
    vi.mocked(useDownloadRCloneConfig).mockImplementation(
      ({ onError }) =>
        ({
          download: ({
            region,
            fileType,
          }: {
            region: string;
            fileType: string;
          }) => {
            mockDownload({
              region,
              fileType,
            });
            onError(new Error('API Error') as ApiError);
          },
          isLoading: false,
        } as ReturnType<typeof useDownloadRCloneConfig>),
    );

    render(<RCloneDownload />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });
});
