import { ApiError } from '@ovh-ux/manager-core-api';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import { useDeleteArchive, useGetArchiveByName } from '@/api/hooks/useArchive';
import DeletePage from './Delete.page';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useArchive', () => ({
  useDeleteArchive: vi.fn(),
  useGetArchiveByName: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));

type UseGetArchiveByNameReturnType = ReturnType<typeof useGetArchiveByName>;
type UseDeleteArchiveReturnType = ReturnType<typeof useDeleteArchive>;

describe('DeletePage', () => {
  const mockNavigate = vi.fn();
  const mockTrackConfirmAction = vi.fn();
  const mockTrackCancelAction = vi.fn();
  const mockTrackSuccessPage = vi.fn();
  const mockTrackErrorPage = vi.fn();
  const mockTrackActionClick = vi.fn();
  const mockTrackNavigationClick = vi.fn();
  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();
  const mockDeleteArchive = vi.fn();
  const mockTackCopyClipboardClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useDeleteArchive).mockReturnValue(({
      deleteArchive: mockDeleteArchive,
      isPending: false,
    } as unknown) as UseDeleteArchiveReturnType);

    vi.mocked(useTracking).mockReturnValue({
      trackConfirmAction: mockTrackConfirmAction,
      trackCancelAction: mockTrackCancelAction,
      trackSuccessPage: mockTrackSuccessPage,
      trackErrorPage: mockTrackErrorPage,
      trackActionClick: mockTrackActionClick,
      trackNavigationClick: mockTrackNavigationClick,
      trackCopyClipboardClick: mockTackCopyClipboardClick,
    });

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    });
  });

  it('shows loading state when archive data is loading', async () => {
    vi.mocked(useGetArchiveByName).mockReturnValue(null);

    render(<DeletePage />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('shows warning odsMessage when archive objectsCount is greater than 0', async () => {
    vi.mocked(useGetArchiveByName).mockReturnValue({
      objectsCount: 2,
    } as UseGetArchiveByNameReturnType);

    vi.mocked(useDeleteArchive).mockImplementation(
      () =>
        ({
          deleteArchive: (archiveName) => mockDeleteArchive(archiveName),
          isPending: false,
        } as UseDeleteArchiveReturnType),
    );

    render(<DeletePage />);

    await (() => {
      expect(
        screen.getByTestId('delete-archive_warning-message'),
      ).toBeVisible();
    });
  });

  it('shows loading state when delete operation is pending', async () => {
    vi.mocked(useGetArchiveByName).mockReturnValue({
      objectsCount: 0,
    } as UseGetArchiveByNameReturnType);

    vi.mocked(useDeleteArchive).mockImplementation(
      () =>
        ({
          deleteArchive: (archiveName) => mockDeleteArchive(archiveName),
          isPending: true,
        } as UseDeleteArchiveReturnType),
    );

    render(<DeletePage />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('should navigate back when cancel button is clicked', () => {
    vi.mocked(useGetArchiveByName).mockReturnValue({
      objectsCount: 0,
    } as UseGetArchiveByNameReturnType);

    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_cancel'));

    expect(mockTrackCancelAction).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call deleteArchive when confirm button is clicked', () => {
    vi.mocked(useGetArchiveByName).mockReturnValue({
      objectsCount: 0,
    } as UseGetArchiveByNameReturnType);

    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    expect(mockTrackConfirmAction).toHaveBeenCalled();
    expect(mockDeleteArchive).toHaveBeenCalledWith('archive1');
  });

  it('should handles successful API response correctly', async () => {
    vi.mocked(useDeleteArchive).mockImplementation(
      ({ onSuccess }) =>
        ({
          deleteArchive: (archiveName) => {
            mockDeleteArchive(archiveName);
            onSuccess();
          },
          isPending: false,
        } as UseDeleteArchiveReturnType),
    );

    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddSuccessMessage).toHaveBeenCalled();
      expect(mockTrackSuccessPage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handles error API response correctly', async () => {
    vi.mocked(useDeleteArchive).mockImplementation(
      ({ onError }) =>
        ({
          deleteArchive: (archiveName) => {
            mockDeleteArchive(archiveName);
            onError(new Error('API Error') as ApiError);
          },
          isPending: false,
        } as UseDeleteArchiveReturnType),
    );

    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddErrorMessage).toHaveBeenCalled();
      expect(mockTrackErrorPage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });
});
