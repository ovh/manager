import { ApiError } from '@ovh-ux/manager-core-api';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TArchiveContainer } from '@/api/data/archive';
import { useGetArchiveByName, useRestoreArchive } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '@/constants';
import { useNotifications } from '@/hooks/useNotifications';
import { useTracking } from '@/hooks/useTracking';
import Restore from './Restore.page';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useArchive', () => ({
  useRestoreArchive: vi.fn(),
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

describe('Restore', () => {
  const mockNavigate = vi.fn();
  const mockTrackConfirmAction = vi.fn();
  const mockTrackCancelAction = vi.fn();
  const mockTrackSuccessPage = vi.fn();
  const mockTrackErrorPage = vi.fn();
  const mockTrackActionClick = vi.fn();
  const mockTrackNavigationClick = vi.fn();
  const mockTrackCopyClipboardClick = vi.fn();
  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();
  const mockRestoreArchive = vi.fn();

  const mockArchive = {
    name: 'archive1',
    status: COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
    objectsCount: 42,
  } as TArchiveContainer;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useGetArchiveByName).mockReturnValue(mockArchive);

    vi.mocked(useRestoreArchive).mockReturnValue({
      restoreArchive: (archiveName: string) => mockRestoreArchive(archiveName),
      isPending: false,
    } as ReturnType<typeof useRestoreArchive>);

    vi.mocked(useTracking).mockReturnValue({
      trackConfirmAction: mockTrackConfirmAction,
      trackCancelAction: mockTrackCancelAction,
      trackSuccessPage: mockTrackSuccessPage,
      trackErrorPage: mockTrackErrorPage,
      trackActionClick: mockTrackActionClick,
      trackNavigationClick: mockTrackNavigationClick,
      trackCopyClipboardClick: mockTrackCopyClipboardClick,
    });

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    });
  });

  it('should disable submit button when restore action is pending', async () => {
    vi.mocked(useRestoreArchive).mockReturnValue({
      restoreArchive: (archiveName: string) => mockRestoreArchive(archiveName),
      isPending: true,
    } as ReturnType<typeof useRestoreArchive>);

    render(<Restore />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('should disable submit button when archive is null', async () => {
    vi.mocked(useGetArchiveByName).mockReturnValue(null);

    render(<Restore />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('should navigate back when cancel button is clicked', () => {
    render(<Restore />);

    fireEvent.click(screen.getByTestId('pciModal-button_cancel'));

    expect(mockTrackCancelAction).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call restoreArchive when confirm button is clicked', () => {
    render(<Restore />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    expect(mockTrackConfirmAction).toHaveBeenCalled();
    expect(mockRestoreArchive).toHaveBeenCalledWith('archive1');
  });

  it('should handles successful API response correctly', async () => {
    vi.mocked(useRestoreArchive).mockImplementation(
      ({ onSuccess }) =>
        ({
          restoreArchive: (archiveName: string) => {
            mockRestoreArchive(archiveName);
            onSuccess();
          },
          isPending: false,
        } as ReturnType<typeof useRestoreArchive>),
    );

    render(<Restore />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddSuccessMessage).toHaveBeenCalled();
      expect(mockTrackSuccessPage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handles error API response correctly', async () => {
    vi.mocked(useRestoreArchive).mockImplementation(
      ({ onError }) =>
        ({
          restoreArchive: (archiveName: string) => {
            mockRestoreArchive(archiveName);
            onError(new Error('API Error') as ApiError);
          },
          isPending: false,
        } as ReturnType<typeof useRestoreArchive>),
    );

    render(<Restore />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddErrorMessage).toHaveBeenCalled();
      expect(mockTrackErrorPage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });
});
